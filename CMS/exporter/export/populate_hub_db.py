#!/usr/bin/env python3
"""One-off script: creates mapping_audit_hub.db (schema copied from
mapping_audit_legal.db) and populates it with translated age/difficulty hub
page copy for all 33 locales, plus adds 5 short footer-label rows to
mapping_audit_home.db for the hub nav links. Run once from CMS/exporter/export/.
"""
from __future__ import annotations
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

from hub_translations import TRANSLATIONS, HUB_SLUGS
from footer_hub_labels import FOOTER_HUB_LABELS

DB_DIR = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / "database"

LOCALES = [
    'en', 'ar', 'az', 'cs', 'da', 'de', 'el', 'es', 'fa', 'fi', 'fr',
    'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl',
    'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
]

FIELDS = ["h1", "intro", "seoTitle", "seoDescription"]

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS mapping_audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            puzzle_slug TEXT NOT NULL,
            language TEXT NOT NULL DEFAULT 'en',
            where_used_in_page TEXT NOT NULL,
            legacy_key TEXT NOT NULL,
            Legacy_value_by_key TEXT,
            new_key TEXT NOT NULL,
            new_value TEXT,
            status TEXT NOT NULL,
            relevant TEXT NOT NULL,
            usage_relevant TEXT NOT NULL DEFAULT 'UNVERIFIED',
            notes TEXT,
            created_at TEXT NOT NULL
        , i18nRequired INTEGER, updated_at TEXT);
CREATE TABLE IF NOT EXISTS "mapping_audit_history" (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    "id" INTEGER,
    "puzzle_slug" TEXT,
    "language" TEXT,
    "where_used_in_page" TEXT,
    "legacy_key" TEXT,
    "Legacy_value_by_key" TEXT,
    "new_key" TEXT,
    "new_value" TEXT,
    "status" TEXT,
    "relevant" TEXT,
    "usage_relevant" TEXT,
    "notes" TEXT,
    "created_at" TEXT,
    "i18nRequired" INTEGER,
    "updated_at" TEXT,
    version INTEGER NOT NULL,
    history_created_at TEXT NOT NULL
);
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def populate_hub_db():
    db_path = DB_DIR / "mapping_audit_hub.db"
    conn = sqlite3.connect(db_path)
    conn.executescript(SCHEMA_SQL)
    conn.execute("DELETE FROM mapping_audit")  # idempotent re-run
    rows = 0
    created = now()
    for hub_key, slug in HUB_SLUGS.items():
        for locale in LOCALES:
            hub_data = TRANSLATIONS[locale][hub_key]
            for field in FIELDS:
                value = hub_data[field]
                conn.execute(
                    "INSERT INTO mapping_audit "
                    "(puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, "
                    "new_key, new_value, status, relevant, usage_relevant, notes, created_at, i18nRequired, updated_at) "
                    "VALUES (?, ?, ?, ?, '', ?, ?, 'OK', 'YES', 'YES', '', ?, 1, NULL)",
                    (
                        slug, locale,
                        "age/difficulty hub page (see web-app/app/[locale]/ages/[range]/page.tsx "
                        "and app/[locale]/difficulty/[tier]/page.tsx)",
                        f"lib/hub-content.ts:{hub_key}.{field}",
                        f"body.{field}", value, created,
                    ),
                )
                rows += 1
    conn.commit()
    conn.close()
    print(f"mapping_audit_hub.db: inserted {rows} rows across {len(HUB_SLUGS)} slugs x {len(LOCALES)} locales -> {db_path}")
    return rows


def populate_footer_labels():
    db_path = DB_DIR / "mapping_audit_home.db"
    conn = sqlite3.connect(db_path)
    created = now()
    rows = 0
    for locale in LOCALES:
        labels = FOOTER_HUB_LABELS[locale]
        for key, value in labels.items():
            new_key = f"body.footer.{key}"
            # idempotent: delete any prior row for this (slug, language, new_key)
            conn.execute(
                "DELETE FROM mapping_audit WHERE puzzle_slug='home' AND language=? AND new_key=?",
                (locale, new_key),
            )
            conn.execute(
                "INSERT INTO mapping_audit "
                "(puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, "
                "new_key, new_value, status, relevant, usage_relevant, notes, created_at, i18nRequired, updated_at) "
                "VALUES ('home', ?, ?, ?, '', ?, ?, 'OK', 'YES', 'YES', '', ?, 1, NULL)",
                (
                    locale,
                    "home page footer (see components/sections.tsx Footer -- age/difficulty hub links)",
                    f"messages.json:footer.{key}",
                    new_key, value, created,
                ),
            )
            rows += 1
    conn.commit()
    conn.close()
    print(f"mapping_audit_home.db: inserted {rows} footer label rows -> {db_path}")
    return rows


if __name__ == "__main__":
    print(f"Using DB dir: {DB_DIR}")
    populate_hub_db()
    populate_footer_labels()
