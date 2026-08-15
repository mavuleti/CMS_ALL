#!/usr/bin/env python3
"""
One-off fix for mapping_audit_home.db: header.meta_description,
header.og.description, header.json_ld.organization.same_as, and
header.json_ld.collection_page.name were populated with literal audit/
documentation notes (e.g. "hardcoded literal in layout.tsx generateMetadata()
...") instead of real content, identically across every locale.

Real per-locale title/description text already exists, fully translated, in
dot-to-dot-web/content/<locale>/messages.json under homepageUi.title /
homepageUi.description. The sameAs URLs are locale-invariant and come from
dot-to-dot-web/app/[locale]/page.tsx (read-only reference, approved by user).

This script overwrites the 4 affected rows per locale in mapping_audit_home.db
with real values. Run export_locale_content.py home afterwards to regenerate
export/<locale>/home.json.
"""
from __future__ import annotations

import io
import json
import sqlite3
import sys
from pathlib import Path

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
CONTENT_ROOT = Path(r"C:\Users\Kalapa-Guest\CHATGPT_AUTO_SOURCE\dot-to-dot-web\content")
DB_PATH = HERE / "mapping_audit_home.db"

SAME_AS = json.dumps([
    "https://www.pinterest.com/hellokidsbookworld/",
    "https://www.facebook.com/dottodotfreeprintables",
    "https://www.youtube.com/@hellokidsbookworld",
])

FIELDS_TO_FIX = {
    "header.meta_description",
    "header.og.description",
    "header.json_ld.organization.same_as",
    "header.json_ld.collection_page.name",
}


def main() -> int:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("select distinct language from mapping_audit order by language")
    locales = [r[0] for r in cur.fetchall()]

    updated = 0
    skipped = []
    for locale in locales:
        messages_path = CONTENT_ROOT / locale / "messages.json"
        if not messages_path.exists():
            skipped.append(locale)
            continue
        messages = json.loads(messages_path.read_text(encoding="utf-8"))
        home_ui = messages.get("homepageUi", {})
        title = home_ui.get("title")
        description = home_ui.get("description")
        if not title or not description:
            skipped.append(locale)
            continue

        values = {
            "header.meta_description": description,
            "header.og.description": description,
            "header.json_ld.organization.same_as": SAME_AS,
            "header.json_ld.collection_page.name": title,
        }

        for key, value in values.items():
            cur.execute(
                "update mapping_audit set new_value = ?, status = 'OK', "
                "notes = 'fixed: was audit-note placeholder, replaced with real content' "
                "where puzzle_slug = 'home' and language = ? and new_key = ?",
                (value, locale, key),
            )
            if cur.rowcount == 0:
                print(f"WARN no existing row for home/{locale}/{key} — skipping insert (schema requires other cols)")
            else:
                updated += cur.rowcount

    conn.commit()

    cur.execute(
        "select puzzle_slug, language, new_key, new_value from mapping_audit "
        "where new_key in (%s) and language in ('en','uk') order by language, new_key"
        % ",".join("?" for _ in FIELDS_TO_FIX),
        tuple(FIELDS_TO_FIX),
    )
    print("\n--- verification (en, uk) ---")
    for row in cur.fetchall():
        print(row)

    conn.close()
    print(f"\nUpdated {updated} rows across {len(locales) - len(skipped)} locales.")
    if skipped:
        print(f"Skipped (no messages.json / missing homepageUi): {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
