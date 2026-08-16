#!/usr/bin/env python3
"""
Header-health validator: scans every mapping_audit_*.db in this folder,
groups rows by page (puzzle_slug, language) — NOT puzzle_slug alone, since
most puzzle category dbs carry both 'en' and 'ar' rows for the same slug and
mixing them together would silently blend two different languages' content
into one count — and checks two rules per (page, language):

  1. at least 7 distinct, non-empty header.* keys (the baseline SEO set:
     header.title, header.og.title, header.meta_description,
     header.og.description, header.json_ld.type, header.json_ld.name,
     header.json_ld.description — home page is exempt from this exact set
     since it has a structurally different header, see --min-headers)
  2. exactly one non-empty body.h1

Counts use the LATEST row per (slug, language, new_key), which matters
because a puzzle can legitimately be re-audited later (content edited,
re-run against the same slug) — only the most recent value reflects current
reality, not every historical value ever inserted.

Writes results into its own SQLite db (mapping_audit_validation.db) — a
`header_validation` table, one row per page, re-runnable (clears old rows
for a source db before re-inserting) — plus prints a pass/fail summary.

Usage:
    python validate_headers.py                # validate every known db
    python validate_headers.py --min-headers 7
"""

from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path

from collection_status import is_active

HERE = Path(__file__).resolve().parent
# mapping_audit_*.db files live in the sibling DB/ folder, not next to this
# script (see export_locale_content.py's DEFAULT_DB_DIR for the same fix).
DEFAULT_DB_DIR = HERE.parent / "DB"

# Home has a structurally different header (site-wide JSON-LD graph, no
# single body.h1 concept — its slug is "home" and it has no body.h1 row at
# all), so it's checked for header count only, not the h1 rule.
NO_H1_SLUGS = {"home"}


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS header_validation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_db TEXT NOT NULL,
            puzzle_slug TEXT NOT NULL,
            language TEXT NOT NULL DEFAULT 'en',
            header_count INTEGER NOT NULL,
            h1_count INTEGER NOT NULL,
            headers_ok INTEGER NOT NULL,
            h1_ok INTEGER NOT NULL,
            passed INTEGER NOT NULL,
            notes TEXT NOT NULL,
            checked_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    existing_columns = {row[1] for row in conn.execute("PRAGMA table_info(header_validation)")}
    if "language" not in existing_columns:
        conn.execute("ALTER TABLE header_validation ADD COLUMN language TEXT NOT NULL DEFAULT 'en'")
    conn.commit()


def validate_db(db_path: Path, min_headers: int) -> list[dict]:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        cols = {r[1] for r in conn.execute("PRAGMA table_info(mapping_audit)")}
        if "new_key" not in cols:
            return []
        has_lang = "language" in cols
        # A puzzle can legitimately be re-audited later (content edited, the
        # slug re-run against the same db) — only the LATEST row per (slug,
        # language, new_key) reflects current reality, not every historical
        # value ever inserted for that key. A window-function rank replaces
        # the old per-row correlated MAX(id) subquery, which was O(rows^2)
        # and became unusably slow once dbs grew to tens of thousands of
        # rows across 33 locales.
        if has_lang:
            latest_rows_sql = """
                SELECT puzzle_slug, language, new_key, new_value FROM (
                    SELECT puzzle_slug, language, new_key, new_value,
                           ROW_NUMBER() OVER (
                               PARTITION BY puzzle_slug, language, new_key
                               ORDER BY id DESC
                           ) AS rn
                    FROM mapping_audit
                ) WHERE rn = 1
            """
        else:
            latest_rows_sql = """
                SELECT puzzle_slug, 'en' AS language, new_key, new_value FROM (
                    SELECT puzzle_slug, new_key, new_value,
                           ROW_NUMBER() OVER (
                               PARTITION BY puzzle_slug, new_key
                               ORDER BY id DESC
                           ) AS rn
                    FROM mapping_audit
                ) WHERE rn = 1
            """

        by_page: dict[tuple[str, str], list[sqlite3.Row]] = {}
        for row in conn.execute(latest_rows_sql):
            by_page.setdefault((row["puzzle_slug"], row["language"]), []).append(row)

        collection_name = db_path.stem.removeprefix("mapping_audit_")

        results = []
        for (slug, language), latest in by_page.items():
            if not is_active(collection_name, language):
                continue
            header_count = sum(
                1 for r in latest
                if r["new_key"].startswith("header") and r["new_value"] not in (None, "", "<absent>")
            )
            h1_values = [r["new_value"] for r in latest if r["new_key"] == "body.h1"]
            h1_count = 1 if (h1_values and h1_values[0] not in (None, "", "<absent>")) else 0

            headers_ok = header_count >= min_headers
            requires_h1 = slug not in NO_H1_SLUGS
            h1_ok = (h1_count == 1) if requires_h1 else True
            passed = headers_ok and h1_ok

            notes = []
            if not headers_ok:
                notes.append(f"only {header_count} distinct non-empty header.* keys, need >= {min_headers}")
            if requires_h1 and h1_count == 0:
                notes.append("no body.h1 found")
            elif requires_h1 and h1_count > 1:
                notes.append(f"{h1_count} distinct body.h1 values found — should be exactly 1")

            results.append({
                "source_db": db_path.name,
                "puzzle_slug": slug,
                "language": language,
                "header_count": header_count,
                "h1_count": h1_count,
                "headers_ok": headers_ok,
                "h1_ok": h1_ok,
                "passed": passed,
                "notes": "; ".join(notes),
            })
        return results
    finally:
        conn.close()


def write_results(out_conn: sqlite3.Connection, source_db: str, results: list[dict]) -> None:
    out_conn.execute("DELETE FROM header_validation WHERE source_db = ?", (source_db,))
    out_conn.executemany(
        """INSERT INTO header_validation
           (source_db, puzzle_slug, language, header_count, h1_count, headers_ok, h1_ok, passed, notes)
           VALUES (:source_db, :puzzle_slug, :language, :header_count, :h1_count, :headers_ok, :h1_ok, :passed, :notes)""",
        results,
    )
    out_conn.commit()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--min-headers", type=int, default=7)
    parser.add_argument("--db", type=Path, default=HERE / "mapping_audit_validation.db")
    parser.add_argument("--db-dir", type=Path, default=DEFAULT_DB_DIR, help="folder containing mapping_audit_*.db source files")
    args = parser.parse_args()

    out_conn = sqlite3.connect(args.db)
    ensure_schema(out_conn)

    all_results: list[dict] = []
    for db_path in sorted(args.db_dir.glob("mapping_audit_*.db")):
        if db_path.name == args.db.name:
            continue
        results = validate_db(db_path, args.min_headers)
        if not results:
            continue
        write_results(out_conn, db_path.name, results)
        all_results.extend(results)

    out_conn.close()

    failed = [r for r in all_results if not r["passed"]]
    print(f"Validated {len(all_results)} pages across {len({r['source_db'] for r in all_results})} dbs "
          f"(min_headers={args.min_headers})")
    print(f"PASS: {len(all_results) - len(failed)}  FAIL: {len(failed)}")
    if failed:
        print("\nFAILURES:")
        for r in failed:
            print(f"  [{r['source_db']}] {r['puzzle_slug']} ({r['language']}): headers={r['header_count']} h1={r['h1_count']} — {r['notes']}")
    print(f"\nWrote {args.db}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
