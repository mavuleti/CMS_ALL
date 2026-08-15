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

HERE = Path(__file__).resolve().parent

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
        if has_lang:
            pages = conn.execute("SELECT DISTINCT puzzle_slug, language FROM mapping_audit").fetchall()
            # A puzzle can legitimately be re-audited later (content edited,
            # the slug re-run against the same db) — only the LATEST row per
            # (slug, language, new_key) reflects current reality, not every
            # historical value ever inserted for that key.
            latest_rows_sql = """
                SELECT m1.new_key, m1.new_value FROM mapping_audit m1
                WHERE m1.puzzle_slug = ? AND m1.language = ?
                  AND m1.id = (SELECT MAX(m2.id) FROM mapping_audit m2
                               WHERE m2.puzzle_slug = m1.puzzle_slug AND m2.language = m1.language
                               AND m2.new_key = m1.new_key)
            """
        else:
            pages = [(r[0], "en") for r in conn.execute("SELECT DISTINCT puzzle_slug FROM mapping_audit").fetchall()]
            latest_rows_sql = """
                SELECT m1.new_key, m1.new_value FROM mapping_audit m1
                WHERE m1.puzzle_slug = ?
                  AND m1.id = (SELECT MAX(m2.id) FROM mapping_audit m2
                               WHERE m2.puzzle_slug = m1.puzzle_slug AND m2.new_key = m1.new_key)
            """

        results = []
        for slug, language in pages:
            params = (slug, language) if has_lang else (slug,)
            latest = conn.execute(latest_rows_sql, params).fetchall()
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
    args = parser.parse_args()

    out_conn = sqlite3.connect(args.db)
    ensure_schema(out_conn)

    all_results: list[dict] = []
    for db_path in sorted(HERE.glob("mapping_audit_*.db")):
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
