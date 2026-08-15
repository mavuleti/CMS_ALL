#!/usr/bin/env python3
"""
Legal-bundle (about/contact/privacy-policy/terms) legacy -> new schema
mapping audit. Same idea and same `mapping_audit` table shape as
audit_single_puzzle.py / audit_blog.py, but for the standalone pages that
used to live bundled together in one legacy legal.json (top-level keys
"about", "contact", "terms", "privacy"), each converted via the real
migrator (migrate_page_schema.migrate_page, imported — never reimplemented)
into its own {slug, header, body} document.

Read-only against real content: never writes back into any content JSON,
only into the throwaway audit .db.

Usage:
    python audit_legal_bundle.py <legacy_legal_json_path> [--db path.db]
    python audit_legal_bundle.py <legacy_legal_json_path> \
        --content-dir ui-app/content/en [--language en]
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
from migrate_page_schema import PAGE_FILES, description_for, migrate_page  # noqa: E402

_MISSING = object()


def get_path(obj: Any, path: str) -> Any:
    current = obj
    for part in path.split("."):
        if not isinstance(current, dict) or part not in current:
            return _MISSING
        current = current[part]
    return current


def compact_repr(value: Any, limit: int = 500) -> str:
    if value is _MISSING:
        return "<absent>"
    text = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
    text = " ".join(str(text).split())
    return text if len(text) <= limit else text[: limit - 1] + "…"


def _status_for(container_has_key: bool, mapped_value: Any, legacy_value: Any) -> str:
    if not container_has_key:
        return "UNMAPPED"
    if mapped_value is _MISSING:
        return "DROPPED"
    if compact_repr(mapped_value) != compact_repr(legacy_value):
        return "MISMATCH"
    return "OK"


def _row(legacy_key: str, legacy_value: Any, new_key: str, mapped_value: Any, status: str) -> dict:
    return {
        "where_used_in_page": "",
        "legacy_key": legacy_key,
        "legacy_value": compact_repr(legacy_value) if legacy_value is not None else "",
        "new_key": new_key,
        "mapped_value": compact_repr(mapped_value),
        "status": status,
        "relevant": "YES" if status in ("OK", "NEW_FIELD") else "NO",
        "usage_relevant": "UNVERIFIED",
        "notes": "",
    }


def build_rows(raw: dict, converted: dict) -> list[dict]:
    rows: list[dict] = []

    # "title" feeds header.title/og.title/json_ld.name AND is retained
    # verbatim in body (migrate_page does body = {h1: title}; body.update(raw),
    # so the original "title" key survives alongside the derived "h1").
    if "title" in raw:
        title = raw["title"]
        for target in ("header.title", "header.og.title", "header.json_ld.name", "body.title"):
            mapped_value = get_path(converted, target)
            rows.append(_row("title", title, target, mapped_value, _status_for(True, mapped_value, title)))
        # body.h1 has no direct legacy key (migrate_page computes it fresh from
        # title/slug), but its value is the same string — NEW_FIELD, not a
        # dropped/unmapped legacy field.
        h1 = get_path(converted, "body.h1")
        rows.append(_row("<none>:body.h1", h1, "body.h1", h1, "NEW_FIELD"))

    # header.meta_description/og.description/json_ld.description are all
    # derived from description_for(raw) — whichever of description/intro/
    # subtitle/text/body (or first long string) migrate_page actually picked,
    # not a fixed key name, so resolve the same way here.
    description_source_key = next(
        (k for k in ("description", "intro", "subtitle", "text", "body") if raw.get(k)),
        next((k for k, v in raw.items() if isinstance(v, str) and len(v.strip()) >= 40), None),
    )
    if description_source_key:
        source_value = raw[description_source_key]
        for target in ("header.meta_description", "header.og.description", "header.json_ld.description"):
            mapped_value = get_path(converted, target)
            rows.append(_row(description_source_key, source_value, target, mapped_value, _status_for(True, mapped_value, source_value)))

    # header.json_ld.type is hardcoded "WebPage" by migrate_page — no legacy
    # source at all.
    schema_type = get_path(converted, "header.json_ld.type")
    rows.append(_row("<none>:header.json_ld.type", schema_type, "header.json_ld.type", schema_type, "NEW_FIELD"))

    # Every other flat legacy key survives verbatim into body.<key> (migrate_page
    # does body.update(raw)), "title" already handled above.
    for key, legacy_value in raw.items():
        if key == "title":
            continue
        target = f"body.{key}"
        mapped_value = get_path(converted, target)
        rows.append(_row(key, legacy_value, target, mapped_value, _status_for(True, mapped_value, legacy_value)))

    return rows


def load_converted_page(content_dir: Path, filename: str) -> dict | None:
    path = content_dir / filename
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8-sig"))


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute("""
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
        )
    """)
    conn.commit()


def write_rows(conn: sqlite3.Connection, slug: str, rows: list[dict], language: str) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    conn.executemany(
        """INSERT INTO mapping_audit
           (puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, new_key, new_value, status, relevant, usage_relevant, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            (slug, language, r["where_used_in_page"], r["legacy_key"], r["legacy_value"], r["new_key"], r["mapped_value"], r["status"], r["relevant"], r["usage_relevant"], r["notes"], timestamp)
            for r in rows
        ],
    )
    conn.commit()


def print_summary(slug: str, rows: list[dict]) -> None:
    counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
    print(f"{slug}: {len(rows)} rows | OK={counts.get('OK', 0)} DROPPED={counts.get('DROPPED', 0)} MISMATCH={counts.get('MISMATCH', 0)} UNMAPPED={counts.get('UNMAPPED', 0)} NEW_FIELD={counts.get('NEW_FIELD', 0)}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("legacy_legal_json_path", type=Path, help="Path to a legacy legal.json bundle (keys: about, contact, terms, privacy)")
    parser.add_argument("--db", type=Path, default=None, help="SQLite output path (default: mapping_audit_legal.db next to this script)")
    parser.add_argument("--content-dir", type=Path, default=None, help="Directory containing the already-migrated about.json/contact.json/privacy-policy.json/terms.json, e.g. ui-app/content/en. When given, audits the REAL current state of each page instead of re-deriving a fresh conversion every run.")
    parser.add_argument("--language", default="en")
    args = parser.parse_args()

    legal = json.loads(args.legacy_legal_json_path.read_text(encoding="utf-8-sig"))

    db_path = args.db or Path(__file__).resolve().parent / "mapping_audit_legal.db"
    if db_path.exists():
        db_path.unlink()
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)

    any_bad = False
    for legal_key, filename in PAGE_FILES.items():
        raw = legal.get(legal_key)
        if not isinstance(raw, dict):
            print(f"NOTE: legal.json has no '{legal_key}' key; skipping {filename}")
            continue
        slug = filename[:-5]
        converted = None
        if args.content_dir:
            converted = load_converted_page(args.content_dir, filename)
            if converted is None:
                print(f"NOTE: '{filename}' not found in {args.content_dir}; falling back to a fresh conversion.")
        if converted is None:
            converted = migrate_page(slug, raw)

        rows = build_rows(raw, converted)
        write_rows(conn, slug, rows, args.language)
        print_summary(slug, rows)
        if any(r["status"] in ("DROPPED", "MISMATCH") for r in rows):
            any_bad = True

    conn.close()
    print(f"\nWrote {db_path}")
    return 1 if any_bad else 0


if __name__ == "__main__":
    sys.exit(main())
