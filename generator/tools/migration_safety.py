"""Shared safety helpers for the content migration scripts in this directory.

Every migrator here should, at minimum:
  1. verify_transfer() every entry it rewrites, to catch dropped/lost content.
  2. check_count() before/after collections it reshapes, to catch dropped entries.
  3. require_clean_git_tree() before doing real (non-dry-run) writes, so a bad
     migration is a trivial `git diff` / `git checkout` away from being undone.
"""
from __future__ import annotations

import subprocess
import sys
from collections import Counter
from pathlib import Path
from typing import Any


def compact(value: Any) -> str:
    return " ".join(str(value or "").split())


def leaf_strings(value: Any) -> Counter:
    """Multiset of compacted, non-trivial string leaves found anywhere in value."""
    counts: Counter = Counter()
    if isinstance(value, dict):
        for item in value.values():
            counts.update(leaf_strings(item))
    elif isinstance(value, list):
        for item in value:
            counts.update(leaf_strings(item))
    elif isinstance(value, str):
        text = compact(value)
        if len(text) >= 3:
            counts[text] += 1
    return counts


def verify_transfer(raw: dict, migrated: dict, label: str, *, key: str = "body") -> bool:
    """Every string value present in the source must still appear somewhere under
    migrated[key] — i.e. no value was dropped or swapped during migration.
    Returns True if nothing was lost."""
    source_counts = leaf_strings(raw)
    target_counts = leaf_strings(migrated.get(key, {}))
    missing = []
    for text, needed in source_counts.items():
        if target_counts[text] < needed:
            missing.append(text if len(text) <= 80 else text[:77] + "...")
    if missing:
        print(f"WARNING: {label} lost {len(missing)} value(s) during migration:")
        for text in missing:
            print(f"    - {text!r}")
        return False
    return True


def check_count(before: int, after: int, label: str) -> bool:
    """A migration should never change how many entries exist — only their shape.
    Returns True if the count is unchanged."""
    if before != after:
        print(f"WARNING: {label} entry count changed: {before} -> {after}")
        return False
    return True


def require_clean_git_tree(paths: list[Path], *, force: bool = False) -> None:
    """Abort (SystemExit) if any of the given paths have uncommitted changes.
    This makes a botched migration trivially revertible with `git checkout`.
    Silently no-ops if git/the repo isn't available, or --force was passed."""
    if force:
        return
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain", "--", *[str(p) for p in paths]],
            capture_output=True, text=True, timeout=10,
        )
    except (OSError, subprocess.SubprocessError):
        return
    if result.returncode != 0:
        return
    dirty = result.stdout.strip()
    if dirty:
        print("ABORTING: uncommitted changes exist under the target path(s):", file=sys.stderr)
        print(dirty, file=sys.stderr)
        print("Commit or stash first, or pass --force to override.", file=sys.stderr)
        raise SystemExit(1)
