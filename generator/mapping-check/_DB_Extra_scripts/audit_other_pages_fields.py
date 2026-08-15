#!/usr/bin/env python3
"""
messages.json FIELD-level usage audit.

audit_other_pages.py only proves each top-level namespace (e.g. 'nav',
'footer') is called somewhere in prod via getTranslations()/useTranslations().
That does not prove every individual leaf key *inside* that namespace is
actually read — a namespace can be "used" while half its keys are dead.

This script goes one level deeper: for every namespace, it finds every
component file that calls getTranslations(<namespace>)/useTranslations(<namespace>)
(assigning it to some local alias, e.g. `const t = useTranslations('nav')`),
then scans that same file for `<alias>('key')` / `<alias>.rich('key')` /
`<alias>.raw('key')` calls to collect which literal leaf keys are actually
referenced. Any leaf key present in messages.json but never referenced by a
static string literal call is flagged UNVERIFIED (it may still be used via a
dynamic/templated key inside a .map() loop — those cases are called out
separately, not silently counted as dead).

Read-only: only reads dot-to-dot-web source + content; writes only the audit
.db.

Usage:
    python audit_other_pages_fields.py <messages.json path> <prod_root> [--db path.db]
"""

from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

# Leaf keys the automated static-literal scan flagged as "no reference found"
# that were hand-verified by actually reading the consuming component
# end-to-end (not just re-running the regex), then removed from
# messages.json entirely once confirmed dead. Kept empty now that those 40
# keys (puzzleSearch: 24, languageSwitcher: 15, contactPage.termsLink: 1)
# are gone — re-populate this dict the same way if a future scan turns up
# new no-static-reference candidates that need the same manual read-through
# before being deleted.
MANUALLY_CONFIRMED_DEAD: dict[str, dict[str, str]] = {}

ALIAS_RE = re.compile(
    r"const\s+(\w+)\s*=\s*(?:await\s+)?(?:get|use)Translations\(\s*(?:\{[^}]*namespace:\s*)?['\"]([\w.]+)['\"]"
)
CALL_RE_TMPL = r"\b{alias}(?:\.rich|\.raw|\.markup)?\(\s*['\"]([\w.]+)['\"]"
DYNAMIC_RE_TMPL = r"\b{alias}(?:\.rich|\.raw|\.markup)?\(\s*[`\w][^'\"]*?\$\{{"


def leaf_paths(obj, prefix: str = "") -> set[str]:
    paths: set[str] = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{prefix}.{k}" if prefix else k
            paths |= leaf_paths(v, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            paths |= leaf_paths(v, prefix)  # list items don't add addressable leaf paths via t()
    else:
        if prefix:
            paths.add(prefix)
    return paths


def scan_file(path: Path) -> list[tuple[str, str, set[str], bool]]:
    """Returns list of (alias, namespace, referenced_keys, has_dynamic_call) for this file."""
    text = path.read_text(encoding="utf-8", errors="ignore")
    results = []
    for m in ALIAS_RE.finditer(text):
        alias, namespace = m.group(1), m.group(2)
        calls = set(re.findall(CALL_RE_TMPL.format(alias=re.escape(alias)), text))
        dynamic = bool(re.search(DYNAMIC_RE_TMPL.format(alias=re.escape(alias)), text))
        results.append((alias, namespace, calls, dynamic))
    return results


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS other_pages_field_audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namespace TEXT NOT NULL,
            leaf_key TEXT NOT NULL,
            status TEXT NOT NULL,
            where_checked TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("messages_json_path", type=Path)
    parser.add_argument("prod_root", type=Path, help="Path to dot-to-dot-web repo")
    parser.add_argument("--db", type=Path, default=None)
    args = parser.parse_args()

    data = json.loads(args.messages_json_path.read_text(encoding="utf-8-sig"))

    files = list((args.prod_root / "app").rglob("*.tsx")) + list((args.prod_root / "components").rglob("*.tsx"))
    files = [f for f in files if ".next" not in f.parts and "node_modules" not in f.parts]

    # namespace -> {alias: [(file, referenced_keys, dynamic)]}
    per_namespace: dict[str, list[tuple[Path, set[str], bool]]] = {}
    for f in files:
        for alias, namespace, calls, dynamic in scan_file(f):
            per_namespace.setdefault(namespace, []).append((f, calls, dynamic))

    db_path = args.db or Path(__file__).resolve().parent / "mapping_audit_other_pages_fields.db"
    if db_path.exists():
        try:
            db_path.unlink()
        except PermissionError:
            print(f"NOTE: {db_path} is open elsewhere; clearing rows instead of recreating.")
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)
    conn.execute("DELETE FROM other_pages_field_audit")
    timestamp = datetime.now(timezone.utc).isoformat()

    rows = []
    summary = {}
    for namespace, value in data.items():
        leaves = sorted(leaf_paths(value))
        sites = per_namespace.get(namespace, [])
        referenced: set[str] = set()
        has_dynamic = False
        site_desc = []
        for f, calls, dynamic in sites:
            referenced |= calls
            has_dynamic = has_dynamic or dynamic
            rel = f.relative_to(args.prod_root)
            site_desc.append(f"{rel}{' [+dynamic key calls]' if dynamic else ''}")
        where_checked = "; ".join(site_desc) if site_desc else "NOT FOUND: no getTranslations/useTranslations call for this namespace"

        confirmed_dead_map = MANUALLY_CONFIRMED_DEAD.get(namespace, {})
        verified = unverified = confirmed_dead = 0
        for leaf in leaves:
            if leaf in referenced:
                status, checked_at = "VERIFIED", where_checked
                verified += 1
            elif leaf in confirmed_dead_map:
                status, checked_at = "CONFIRMED_DEAD", confirmed_dead_map[leaf]
                confirmed_dead += 1
            elif has_dynamic:
                status, checked_at = "UNVERIFIED (dynamic key in a loop — likely used, not statically provable)", where_checked
                unverified += 1
            else:
                status, checked_at = "UNVERIFIED (no static reference found — not yet manually reviewed)", where_checked
                unverified += 1
            rows.append((namespace, leaf, status, checked_at, timestamp))
        summary[namespace] = (len(leaves), verified, unverified, confirmed_dead, has_dynamic)

    conn.executemany(
        "INSERT INTO other_pages_field_audit (namespace, leaf_key, status, where_checked, created_at) VALUES (?, ?, ?, ?, ?)",
        rows,
    )
    conn.commit()
    conn.close()

    total_leaves = sum(v[0] for v in summary.values())
    total_verified = sum(v[1] for v in summary.values())
    total_unverified = sum(v[2] for v in summary.values())
    total_confirmed_dead = sum(v[3] for v in summary.values())
    print(
        f"{total_leaves} leaf keys across {len(summary)} namespaces | "
        f"VERIFIED={total_verified} CONFIRMED_DEAD={total_confirmed_dead} "
        f"UNVERIFIED(still needs review)={total_unverified}"
    )
    print()
    for ns, (n, v, u, dead, dyn) in sorted(summary.items(), key=lambda x: -(x[1][2] + x[1][3])):
        if u or dead:
            flag = " (remaining unverified rows use dynamic key calls — spot-check before assuming dead)" if dyn else ""
            print(f"  {ns}: {v}/{n} verified, {dead} confirmed dead, {u} still unverified{flag}")
    print(f"\nWrote {db_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
