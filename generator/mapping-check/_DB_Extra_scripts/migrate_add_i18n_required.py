#!/usr/bin/env python3
"""
One-time backfill: add an `i18nRequired` column (INTEGER, 0/1) to every
mapping_audit_*.db that has a `language` column, classify every row via
i18n_technical_fields.is_i18n_required(new_key), and for rows classified
as NOT requiring translation (technical fields — slug, hex codes, schema.org
constants, file paths, etc., per TRANSLATE-MISSING-CONTENT-RULES.md §2),
overwrite Legacy_value_by_key/new_value with the 'en' row's value for the
same (puzzle_slug, new_key) pair, across every language present.

This is safe to re-run (idempotent) and only ever touches these throwaway
audit .db files — never prod content.

Usage:
    python migrate_add_i18n_required.py [--dry-run]
"""
from __future__ import annotations

import argparse
import glob
import sqlite3

from i18n_technical_fields import is_i18n_required


def migrate_db(db_path: str, dry_run: bool) -> None:
    conn = sqlite3.connect(db_path)
    cols = [r[1] for r in conn.execute("PRAGMA table_info(mapping_audit)")]
    if "language" not in cols:
        conn.close()
        return  # not a language-scoped table (other_pages, validation, common_content, etc.)

    if "i18nRequired" not in cols:
        if not dry_run:
            conn.execute("ALTER TABLE mapping_audit ADD COLUMN i18nRequired INTEGER")
    else:
        cols_confirm = [r[1] for r in conn.execute("PRAGMA table_info(mapping_audit)")]
        # column already exists from a prior run; continue to reclassify/refresh.

    rows = conn.execute(
        "SELECT id, puzzle_slug, language, new_key FROM mapping_audit"
    ).fetchall()

    # Build an English value lookup: (puzzle_slug, new_key) -> (legacy_value, new_value)
    en_values = {}
    for r in conn.execute(
        "SELECT puzzle_slug, new_key, Legacy_value_by_key, new_value "
        "FROM mapping_audit WHERE language='en'"
    ):
        en_values[(r[0], r[1])] = (r[2], r[3])

    to_set_flag = []       # (i18nRequired, id)
    to_force_value = []    # (legacy_value, new_value, id)
    technical_count = 0
    forced_count = 0

    for row_id, slug, lang, new_key in rows:
        required = is_i18n_required(new_key)
        to_set_flag.append((1 if required else 0, row_id))
        if not required:
            technical_count += 1
            en_leg, en_new = en_values.get((slug, new_key), (None, None))
            if en_leg is not None or en_new is not None:
                to_force_value.append((en_leg, en_new, row_id))
                forced_count += 1

    print(f"[{db_path}] {len(rows)} rows total, {technical_count} technical "
          f"(i18nRequired=False), {forced_count} force-set to English value"
          + (" (dry-run, no changes written)" if dry_run else ""))

    if dry_run:
        conn.close()
        return

    conn.executemany("UPDATE mapping_audit SET i18nRequired=? WHERE id=?", to_set_flag)
    conn.executemany(
        "UPDATE mapping_audit SET Legacy_value_by_key=?, new_value=? WHERE id=?",
        to_force_value,
    )
    conn.commit()
    conn.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    for db_path in sorted(glob.glob("mapping_audit_*.db")):
        migrate_db(db_path, args.dry_run)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
