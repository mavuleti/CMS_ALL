#!/usr/bin/env python3
"""
Export full per-locale content JSON straight from the mapping_audit_*.db
files in this folder — no reference/skeleton file, no ui-app dependency.

Each mapping_audit row's (new_key, new_value) pair is a dotted/bracket key
path plus an already-translated value for one language (e.g.
"body.dot_guide.sections[0].fact" -> Arabic text). Reconstructing every row
for a given (puzzle_slug, language) is enough to build the complete document
on its own; unlike export_new_fields.py this script does not merge onto or
skip fields present in any external reference — every language's export is
built purely from that language's own DB rows.

Usage:
    python export_locale_content.py                       # all langs, all dbs
    python export_locale_content.py --langs en ar de fi    # specific langs
    python export_locale_content.py cute dinosaurs         # specific dbs
    python export_locale_content.py --out-dir DIR          # default: ./export
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sqlite3
import sys
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from collection_status import is_active

HERE = Path(__file__).resolve().parent
# As of the 2026-08-14 "Reorganize mapping tools" commit, the mapping_audit_*.db
# files live in a sibling DB/ folder rather than alongside this script.
DEFAULT_DB_DIR = HERE.parent / "DB"

DEFAULT_LANGS = ["en", "ar", "de", "fi"]

# mapping-check db stem -> output filename. Multiple db stems may point at
# the same output file (e.g. "cute-puppy" + "cute" both feed
# puzzles-cute.json) — their rows are merged into one export.
DB_TO_OUTPUT = {
    "canada": "puzzles-canada.json",
    "circus": "puzzles-circus.json",
    "cute": "puzzles-cute.json",
    "cute-puppy-dot-to-dot-puzzle": "puzzles-cute.json",
    "dinosaurs": "puzzles-dinosaurs.json",
    "flowers": "puzzles-flowers.json",
    "garden": "puzzles-garden.json",
    "ocean": "puzzles-ocean.json",
    "planes": "puzzles-planes.json",
    "playgrounds": "puzzles-playgrounds.json",
    "space": "puzzles-space.json",
    "uae": "puzzles-uae.json",
    "usa-250": "puzzles-usa-250.json",
    "blog_all": "blog.json",
}

# The "legal" db covers four unrelated single-document outputs (one per
# slug), and "home" covers one single-document output — both handled
# separately from DB_TO_OUTPUT since they're one-db-to-many/one-slug-doc
# relationships, not the many-dbs-to-one-array-file shape above.
LEGAL_SLUG_TO_OUTPUT = {
    "about": "about.json",
    "contact": "contact.json",
    "privacy-policy": "privacy-policy.json",
    "terms": "terms.json",
}
HOME_SLUG_TO_OUTPUT = {"home": "home.json"}

# The "hub" db covers the six age/difficulty hub pages (/ages/*, /difficulty/*)
# -- same one-db-to-many-single-document shape as "legal", handled the same way.
HUB_SLUG_TO_OUTPUT = {
    "hub-ages-4-6": "hub-ages-4-6.json",
    "hub-ages-7-9": "hub-ages-7-9.json",
    "hub-ages-9-12": "hub-ages-9-12.json",
    "hub-difficulty-easy-1-20-dots": "hub-difficulty-easy-1-20-dots.json",
    "hub-difficulty-medium-21-60-dots": "hub-difficulty-medium-21-60-dots.json",
    "hub-difficulty-hard-61-plus-dots": "hub-difficulty-hard-61-plus-dots.json",
}

_INDEX_RE = re.compile(r"^([^\[]+)\[(\d+)\]$")


def parse_key_path(key: str) -> list[tuple[str, int | None]]:
    """'body.dot_guide.sections[0].range' -> [('body', None), ('dot_guide', None), ('sections', 0), ('range', None)]"""
    parts = []
    for part in key.split("."):
        m = _INDEX_RE.match(part)
        parts.append((m.group(1), int(m.group(2))) if m else (part, None))
    return parts


def set_path(root: dict, key: str, value: Any) -> None:
    """Writes `value` at a dotted/bracket `key` inside `root`, creating dicts
    and growing lists as needed."""
    current = root
    parts = parse_key_path(key)
    for i, (name, index) in enumerate(parts):
        last = i == len(parts) - 1
        if index is None:
            if last:
                # Don't let a bare scalar row (e.g. a whole array duplicated
                # as a stringified blob) clobber a list already built from
                # this same key's indexed rows — the structured rows win.
                if isinstance(current.get(name), list) and current[name]:
                    continue
                current[name] = value
            else:
                current = current.setdefault(name, {})
        else:
            existing = current.get(name)
            if not isinstance(existing, list):
                # A prior row set this key to a scalar (e.g. a whole
                # stringified array duplicated alongside per-item indexed
                # rows) — the indexed rows are the structured source of
                # truth, so replace the scalar with a fresh list.
                current[name] = []
            lst = current[name]
            while len(lst) <= index:
                lst.append({})
            if last:
                lst[index] = value
            else:
                current = lst[index]


def read_rows(db_path: Path, language: str) -> list[sqlite3.Row]:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        columns = {row[1] for row in conn.execute("PRAGMA table_info(mapping_audit)")}
        if not columns:
            print(f"SKIP {db_path.name}: no mapping_audit table")
            return []
        where = "WHERE language = ?" if "language" in columns else ""
        params = (language,) if "language" in columns else ()
        return conn.execute(
            f"SELECT puzzle_slug, new_key, new_value FROM mapping_audit {where}", params
        ).fetchall()
    finally:
        conn.close()


def apply_rows(
    rows: list[sqlite3.Row], source_name: str,
    puzzles: dict[str, dict], collection: dict, seen: dict[tuple[str, str], tuple[str, str]],
) -> int:
    """Builds `puzzles` (keyed by slug) and `collection` purely from DB rows
    — no reference document is read or merged onto. `seen` still guards
    against two source dbs disagreeing on the same (slug, key)."""
    written = 0
    for row in rows:
        slug, new_key, new_value = row["puzzle_slug"], row["new_key"], row["new_value"]
        if new_value in (None, "", "<absent>"):
            continue

        seen_key = (slug, new_key)
        prior = seen.get(seen_key)
        if prior is not None:
            prior_value, prior_source = prior
            if prior_value != new_value:
                print(
                    f"CONFLICT {slug}::{new_key}: {prior_source}={prior_value!r} vs "
                    f"{source_name}={new_value!r} — keeping {prior_source}'s value"
                )
            continue
        seen[seen_key] = (new_value, source_name)

        try:
            if slug.endswith("-collection"):
                set_path(collection, new_key, new_value)
            else:
                puzzles.setdefault(slug, {"slug": slug})
                set_path(puzzles[slug], new_key, new_value)
        except (TypeError, IndexError) as exc:
            print(f"SKIP BAD ROW {source_name} {slug}::{new_key}={new_value!r}: {exc}")
            continue
        written += 1
    return written


def write_puzzles_export(puzzles: dict[str, dict], collection: dict, out_path: Path) -> None:
    puzzles_list = list(puzzles.values())
    # Always include "collection", even as {} — consumers (export-content.ts)
    # require the key to be present (a truthy object, however empty) to
    # recognize this as the envelope shape rather than a legacy bare array.
    output: Any = {"collection": collection, "puzzles": puzzles_list}
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_bare_array_export(puzzles: dict[str, dict], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(list(puzzles.values()), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_single_document_export(document: dict, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(document, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def export_legal_bundle(out_dir: Path, language: str, db_dir: Path) -> int:
    db_path = db_dir / "mapping_audit_legal.db"
    if not db_path.exists():
        print("SKIP legal: mapping_audit_legal.db not found")
        return 0

    rows_by_slug: dict[str, list[sqlite3.Row]] = {}
    for row in read_rows(db_path, language):
        rows_by_slug.setdefault(row["puzzle_slug"], []).append(row)

    total = 0
    for slug, out_name in LEGAL_SLUG_TO_OUTPUT.items():
        rows = rows_by_slug.get(slug, [])
        document: dict[str, Any] = {"slug": slug}
        seen: dict[tuple[str, str], tuple[str, str]] = {}
        written = 0
        for row in rows:
            new_key, new_value = row["new_key"], row["new_value"]
            if new_value in (None, "", "<absent>"):
                continue
            seen_key = (slug, new_key)
            if seen_key in seen:
                continue
            seen[seen_key] = (new_value, "legal.db")
            set_path(document, new_key, new_value)
            written += 1
        out_path = out_dir / out_name
        write_single_document_export(document, out_path)
        print(f"[{language}] legal.db [{slug}]: {written} key/value pairs -> {out_path}")
        total += written
    return total


def export_hub_bundle(out_dir: Path, language: str, db_dir: Path) -> int:
    db_path = db_dir / "mapping_audit_hub.db"
    if not db_path.exists():
        print("SKIP hub: mapping_audit_hub.db not found")
        return 0

    rows_by_slug: dict[str, list[sqlite3.Row]] = {}
    for row in read_rows(db_path, language):
        rows_by_slug.setdefault(row["puzzle_slug"], []).append(row)

    total = 0
    for slug, out_name in HUB_SLUG_TO_OUTPUT.items():
        rows = rows_by_slug.get(slug, [])
        document: dict[str, Any] = {"slug": slug}
        seen: dict[tuple[str, str], tuple[str, str]] = {}
        written = 0
        for row in rows:
            new_key, new_value = row["new_key"], row["new_value"]
            if new_value in (None, "", "<absent>"):
                continue
            seen_key = (slug, new_key)
            if seen_key in seen:
                continue
            seen[seen_key] = (new_value, "hub.db")
            set_path(document, new_key, new_value)
            written += 1
        out_path = out_dir / out_name
        write_single_document_export(document, out_path)
        print(f"[{language}] hub.db [{slug}]: {written} key/value pairs -> {out_path}")
        total += written
    return total


def export_home(out_dir: Path, language: str, db_dir: Path) -> int:
    db_path = db_dir / "mapping_audit_home.db"
    if not db_path.exists():
        print("SKIP home: mapping_audit_home.db not found")
        return 0

    puzzles: dict[str, dict] = {}
    seen: dict[tuple[str, str], tuple[str, str]] = {}
    written = apply_rows(read_rows(db_path, language), "home.db", puzzles, {}, seen)
    document = next(iter(puzzles.values()), {"slug": "home"})
    out_path = out_dir / HOME_SLUG_TO_OUTPUT["home"]
    write_single_document_export(document, out_path)
    print(f"[{language}] home.db: {written} key/value pairs -> {out_path}")
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("names", nargs="*", help="db stems to export (default: all known)")
    parser.add_argument("--langs", nargs="*", default=DEFAULT_LANGS, help=f"language codes to export (default: {DEFAULT_LANGS})")
    parser.add_argument("--out-dir", type=Path, default=HERE.parent / "export", help="base export dir; each language gets its own subfolder")
    parser.add_argument("--db-dir", type=Path, default=DEFAULT_DB_DIR, help="folder containing mapping_audit_*.db files")
    args = parser.parse_args()
    db_dir = args.db_dir

    requested = args.names or list(DB_TO_OUTPUT) + ["legal", "home", "hub"]

    all_by_output: dict[str, list[str]] = {}
    for name, out_name in DB_TO_OUTPUT.items():
        all_by_output.setdefault(out_name, []).append(name)

    requested_outputs: set[str] = set()
    for name in requested:
        if name in ("legal", "home", "hub"):
            continue
        out_name = DB_TO_OUTPUT.get(name)
        if out_name is None:
            print(f"SKIP {name}: no known db (known: {', '.join(DB_TO_OUTPUT)}, legal, home, hub)")
            continue
        requested_outputs.add(out_name)

    grand_total = 0
    for language in args.langs:
        lang_out_dir = args.out_dir / language
        total = 0

        if "legal" in requested:
            total += export_legal_bundle(lang_out_dir, language, db_dir)
        if "home" in requested:
            total += export_home(lang_out_dir, language, db_dir)
        if "hub" in requested:
            total += export_hub_bundle(lang_out_dir, language, db_dir)

        for out_name in requested_outputs:
            db_names = [n for n in all_by_output[out_name] if (db_dir / f"mapping_audit_{n}.db").exists()]
            missing = [n for n in all_by_output[out_name] if n not in db_names]
            if missing:
                print(f"NOTE {out_name}: {', '.join(m + '.db' for m in missing)} not found on disk, exporting from the rest")
            if not db_names:
                print(f"SKIP {out_name}: no source db found")
                continue

            active_db_names = [n for n in db_names if is_active(n, language)]
            inactive_db_names = [n for n in db_names if n not in active_db_names]
            if inactive_db_names:
                print(f"INACTIVE {out_name} for '{language}': {', '.join(inactive_db_names)} marked active=false, skipping")
            if not active_db_names:
                out_path = lang_out_dir / out_name
                if out_path.exists():
                    out_path.unlink()
                    print(f"REMOVED stale {out_path} (inactive for '{language}')")
                continue

            puzzles: dict[str, dict] = {}
            collection: dict = {}
            seen: dict[tuple[str, str], tuple[str, str]] = {}
            written = 0
            for name in active_db_names:
                rows = read_rows(db_dir / f"mapping_audit_{name}.db", language)
                written += apply_rows(rows, f"{name}.db", puzzles, collection, seen)

            out_path = lang_out_dir / out_name
            if out_name == "blog.json":
                write_bare_array_export(puzzles, out_path)
            else:
                write_puzzles_export(puzzles, collection, out_path)
            slot_count = len(puzzles) + (1 if collection else 0)
            print(f"[{language}] {', '.join(n + '.db' for n in db_names)}: {written} key/value pairs across {slot_count} slot(s) -> {out_path}")
            total += written

        print(f"[{language}] total key/value pairs exported: {total}\n")
        grand_total += total

    print(f"Grand total across {len(args.langs)} language(s): {grand_total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
