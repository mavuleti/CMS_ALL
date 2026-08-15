"""Add locale-specific SEO phrases to non-English mapping-audit content.

The phrase bank is Ui-app-DB-json/keyword-list/<locale>.json.  This script is
deliberately idempotent: a field is changed only when its selected exact phrase
is not already present.  It does not regenerate mapping-check/export snapshots.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


HERE = Path(__file__).resolve().parent
KEYWORD_DIR = HERE.parent / "Ui-app-DB-json" / "keyword-list"
REPORT_PATH = HERE / "keyword-enhancement-report.json"

SEO_KEYS = {
    "header.title": "primary",
    "header.meta_description": "print",
    "body.description": "children",
}


def load_phrases() -> dict[str, dict[str, str]]:
    result = {}
    for path in sorted(KEYWORD_DIR.glob("*.json")):
        if path.name in {"en.json", "manifest.json"}:
            continue
        payload = json.loads(path.read_text(encoding="utf-8"))
        summary = payload["opportunity_summary"]
        primary = (
            summary.get("recommended_local_phrase")
            or summary.get("primary_term")
        ).strip()
        result[payload["locale"]] = {
            "primary": primary,
            "print": (summary.get("print_modifier") or primary).strip(),
            "children": (summary.get("children_modifier") or primary).strip(),
            "adult": (summary.get("adult_modifier") or primary).strip(),
        }
    return result


def select_phrase(phrases: dict[str, str], kind: str, slug: str) -> str:
    # The 250-dot collection is explicitly adult/extreme content. Other
    # collections are children's/general printables according to their copy.
    if "usa-250" in slug and phrases["adult"]:
        return phrases["adult"]
    return phrases[kind]


def enhanced(value: str, phrase: str, key: str) -> str:
    if phrase.casefold() in value.casefold():
        return value
    value = value.rstrip()
    # A dash keeps the exact search phrase intact and avoids inventing a claim
    # or rewriting translated factual prose. Description punctuation remains
    # valid across Latin, RTL, and CJK content.
    suffix = f" — {phrase}"
    if "description" in key or key == "body.tagline":
        return value.rstrip(" .。!！?？") + suffix + "."
    return value + suffix


def run(dry_run: bool) -> dict:
    phrase_map = load_phrases()
    changed = Counter()
    scanned_locales = set()
    changes = []

    for db_path in sorted(HERE.glob("mapping_audit_*.db")):
        connection = sqlite3.connect(db_path)
        columns = {row[1] for row in connection.execute("PRAGMA table_info(mapping_audit)")}
        if "language" not in columns:
            connection.close()
            continue
        placeholders = ",".join("?" for _ in SEO_KEYS)
        rows = connection.execute(
            f"SELECT id,puzzle_slug,language,new_key,new_value FROM mapping_audit "
            f"WHERE language <> 'en' AND new_key IN ({placeholders}) "
            "AND COALESCE(new_value,'') <> ''",
            tuple(SEO_KEYS),
        ).fetchall()
        for row_id, slug, locale, key, old_value in rows:
            if locale not in phrase_map:
                continue
            scanned_locales.add(locale)
            phrase = select_phrase(phrase_map[locale], SEO_KEYS[key], slug)
            new_value = enhanced(old_value, phrase, key)
            if new_value == old_value:
                continue
            changed[locale] += 1
            changes.append({
                "database": db_path.name,
                "id": row_id,
                "locale": locale,
                "slug": slug,
                "key": key,
                "phrase": phrase,
            })
            if not dry_run:
                connection.execute(
                    "UPDATE mapping_audit SET new_value=? WHERE id=?",
                    (new_value, row_id),
                )
        if dry_run:
            connection.rollback()
        else:
            connection.commit()
        connection.close()

    missing = sorted(set(phrase_map) - scanned_locales)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "dry_run": dry_run,
        "changed_total": sum(changed.values()),
        "changed_by_locale": dict(sorted(changed.items())),
        "locales_with_no_database_content": missing,
        "changes": changes,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    report = run(args.dry_run)
    print(json.dumps({k: v for k, v in report.items() if k != "changes"}, ensure_ascii=False, indent=2))
    if not args.dry_run:
        REPORT_PATH.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
