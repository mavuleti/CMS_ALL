"""Backfill empty mapping_audit_home.db 'body.puzzleSearch.*' rows from the
last committed export JSON (git HEAD:generator/mapping-check/export/<locale>/home.json),
which already contains real translated values for these fields even though
the live DB row is blank.
"""
from __future__ import annotations

import json
import subprocess
import sqlite3
from pathlib import Path

HERE = Path(__file__).resolve().parent
DB_DIR = HERE.parent / "DB"
REPO_ROOT = HERE.parent.parent.parent


def get_head_json(locale: str) -> dict | None:
    rel = f"generator/mapping-check/export/{locale}/home.json"
    result = subprocess.run(
        ["git", "show", f"HEAD:{rel}"], cwd=REPO_ROOT,
        capture_output=True, text=True, encoding="utf-8",
    )
    if result.returncode != 0:
        return None
    return json.loads(result.stdout)


def lookup(data: dict, key: str):
    # key like "body.puzzleSearch.dotRanges.35to50" or "body.puzzleSearch.categories.USA 250 Years"
    parts = key.split(".")
    assert parts[0] == "body" and parts[1] == "puzzleSearch"
    node = data.get("body", {}).get("puzzleSearch", {})
    rest = parts[2:]
    if len(rest) == 1:
        return node.get(rest[0])
    # nested: dotRanges.X or categories.X -- X itself may contain no further dots
    sub_key = ".".join(rest[1:])
    return node.get(rest[0], {}).get(sub_key)


def main(dry_run: bool) -> None:
    conn = sqlite3.connect(DB_DIR / "mapping_audit_home.db")
    rows = conn.execute(
        "SELECT id, language, new_key FROM mapping_audit "
        "WHERE new_key LIKE 'body.puzzleSearch.%' AND (new_value IS NULL OR TRIM(new_value)='')"
    ).fetchall()

    cache: dict[str, dict | None] = {}
    filled = 0
    still_missing = []

    for row_id, locale, key in rows:
        if locale not in cache:
            cache[locale] = get_head_json(locale)
        data = cache[locale]
        if data is None:
            still_missing.append((locale, key, "no HEAD export file"))
            continue
        value = lookup(data, key)
        if value is None or (isinstance(value, str) and not value.strip()):
            still_missing.append((locale, key, "empty in HEAD export too"))
            continue
        filled += 1
        if not dry_run:
            conn.execute("UPDATE mapping_audit SET new_value=? WHERE id=?", (value, row_id))

    if dry_run:
        conn.rollback()
    else:
        conn.commit()
    conn.close()

    print(json.dumps({
        "dry_run": dry_run,
        "total_empty_rows": len(rows),
        "filled_from_head": filled,
        "still_missing": len(still_missing),
    }, indent=2))
    for item in still_missing[:20]:
        print(" MISSING:", item)


if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    main(args.dry_run)
