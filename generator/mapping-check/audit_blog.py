#!/usr/bin/env python3
"""
Blog-post legacy -> new schema mapping audit.

Same idea and same `mapping_audit` table shape as audit_single_puzzle.py,
but for blog posts. Loads one legacy blog entry (flat shape, as still used
by prod's dot-to-dot-web/content/<locale>/blog.json) by slug, converts it
using the real conversion function (migrate_page_schema.migrate_blog_entry,
imported — never reimplemented, so this can't drift from what the batch
migration actually does), and writes one row per field.

Two important things this audit surfaces that a naive glance wouldn't:

1. Prod splits blog data across TWO sources: content/<locale>/blog.json
   (title, description, category, readTime, author, authorBio, heroImage.alt,
   sections, relatedLinks) and a hardcoded TS "shell" array in
   lib/blog-data.ts (publishedAt, updatedAt, heroImage.src/width/height,
   articleImage). Only the content/blog.json half is in scope for this
   JSON-schema migration — publishedAt/updatedAt/articleImage/heroImage.src
   are NOT legacy JSON keys and are correctly flagged as out of scope, not
   as dropped fields.
2. header.json_ld.type is hardcoded to "BlogPosting" by the migrator (no
   legacy source) but prod's own articleSchema also hardcodes '@type':
   'BlogPosting' in page.tsx rather than reading it from stored data — so
   it's a NEW_FIELD that is consistent with prod, not a gap to fill in.

Usage:
    python audit_blog.py <legacy_blog_json_path> <slug> [--db path.db]
    python audit_blog.py <legacy_blog_json_path> --all [--db path.db]
    python audit_blog.py <legacy_blog_json_path> <slug> \
        --converted-json-path <migrated blog.json> [--language en]
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
from migrate_page_schema import migrate_blog_entry  # noqa: E402


_MISSING = object()


def get_path(obj: Any, path: str) -> Any:
    import re
    current = obj
    for part in path.split("."):
        m = re.match(r"^([^\[]+)\[(\d+)\]$", part)
        key, index = (m.group(1), int(m.group(2))) if m else (part, None)
        if not isinstance(current, dict) or key not in current:
            return _MISSING
        current = current[key]
        if index is not None:
            if not isinstance(current, list) or index >= len(current):
                return _MISSING
            current = current[index]
    return current


def compact_repr(value: Any, limit: int = 500) -> str:
    if value is _MISSING:
        return "<absent>"
    text = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
    text = " ".join(str(text).split())
    return text if len(text) <= limit else text[: limit - 1] + "…"


# legacy_key -> list of new_key paths it feeds, per migrate_page_schema.migrate_blog_entry.
SIMPLE_MAPPING = {
    "slug": ["slug"],
    "title": ["header.title", "header.og.title", "header.json_ld.name", "body.h1"],
    "description": ["header.meta_description", "header.og.description", "header.json_ld.description", "body.description"],
    "category": ["body.category"],
    "readTime": ["body.read_time"],
    "author": ["body.author"],
    "authorBio": ["body.author_bio"],
    "relatedLinks": ["body.related_links"],
}

# Where each new_key is actually consumed on the live blog post page
# (dot-to-dot-web/app/[locale]/blog/[slug]/page.tsx), verified by reading
# that file. "NOT IN CONTENT JSON" marks shell-only fields.
WHERE_USED_IN_PAGE = {
    "slug": "page.tsx: generateStaticParams()/getBlogPostForLocale(slug, locale) route param",
    "header.title": "generateMetadata(): <title>/OG title (post.title)",
    "header.og.title": "generateMetadata(): openGraph.title / twitter.title (post.title)",
    "header.json_ld.name": "NOT READ by prod: articleSchema uses `headline: post.title` directly, not a stored json_ld.name field",
    "body.h1": "page.tsx line 175: <h1>{post.title}</h1>",
    "header.meta_description": "generateMetadata(): description meta tag (post.description)",
    "header.og.description": "generateMetadata(): openGraph.description / twitter.description (post.description)",
    "header.json_ld.description": "NOT READ by prod: articleSchema uses `description: post.description` directly, not a stored json_ld.description field",
    "body.description": "page.tsx line 176: <p className=\"blog-standfirst\">{post.description}</p>",
    "body.category": "page.tsx line 174 (eyebrow) and articleSchema.articleSection (post.category)",
    "body.read_time": "page.tsx line 182-183: byline Clock icon + {post.readTime}",
    "body.author": "page.tsx line 178/236 byline + author bio block, and articleSchema.author.name (post.author)",
    "body.author_bio": "page.tsx line 237: blog-author-desc, and articleSchema.author.description (post.authorBio)",
    "body.sections": "page.tsx lines 202-217: blog-content headings/paragraphs/tips loop over post.sections",
    "body.related_links": "page.tsx lines 241-254: blog-related-grid loop over post.relatedLinks",
    "body.hero_image": "page.tsx line 189-198 ResponsiveImage alt text only (post.heroImage.alt); src/width/height come from the lib/blog-data.ts shell, NOT this content field",
    "header.json_ld.type": "AUTO-DETECTED (unverified rel.): prod's articleSchema hardcodes '@type': 'BlogPosting' itself in page.tsx rather than reading a stored value — consistent value, not read from content",
}


def usage_relevance(new_key: str, where_used: str) -> str:
    if "NOT READ by prod" in where_used or "NOT FOUND" in where_used:
        return "UNVERIFIED"
    import re as _re
    field = _re.sub(r"\[\d+\]", "", new_key).rsplit(".", 1)[-1]
    keywords = {
        "title": ["title"], "h1": ["h1", "title"], "name": ["name", "title"],
        "meta_description": ["description"], "description": ["description"],
        "category": ["category", "eyebrow"], "read_time": ["readtime", "read_time", "clock"],
        "author": ["author"], "author_bio": ["author", "bio"], "sections": ["section"],
        "heading": ["heading", "section"], "paragraphs": ["paragraph", "section"],
        "tips": ["tip", "section"],
        "related_links": ["related"], "href": ["related"], "hero_image": ["image", "hero"],
        "type": ["type", "blogposting"],
    }.get(field, [field.lower()])
    hay = where_used.lower()
    return "YES" if any(k in hay for k in keywords) else "NO"


def build_rows(raw: dict, converted: dict, source_file: str = "") -> list[dict]:
    rows: list[dict] = []

    def add(legacy_key: str, legacy_value: Any, new_key: str, notes: str = "") -> None:
        mapped = get_path(converted, new_key)
        if legacy_value is _MISSING and mapped is _MISSING:
            status, relevant = "OK", "YES"
            notes = (notes + " (field absent in legacy source for this post; correctly absent in converted output too)").strip()
        elif legacy_value is _MISSING:
            status = "NEW_FIELD"
            relevant = "YES" if compact_repr(mapped) else "NO"
        elif mapped is _MISSING:
            status, relevant = "DROPPED", "NO"
        else:
            lv, nv = compact_repr(legacy_value), compact_repr(mapped)
            if json.dumps(legacy_value, ensure_ascii=False, sort_keys=True) == json.dumps(mapped, ensure_ascii=False, sort_keys=True):
                status, relevant = "OK", "YES"
            elif lv and lv in nv:
                status, relevant = "OK", "YES"
            elif nv.endswith("…") and lv.startswith(nv[:-1]):
                status, relevant, notes = "OK", "YES", (notes + " (truncated to SEO length limit, same convention as puzzles)").strip()
            else:
                status, relevant = "MISMATCH", "NO"
        import re as _re
        # Truncate at the first array index so 'body.sections[0].heading' and
        # 'body.related_links[2]' both fall back to the array-level entry
        # ('body.sections' / 'body.related_links') that documents the whole loop.
        match = _re.search(r"\[\d+\]", new_key)
        base_key = new_key[: match.start()] if match else new_key
        where_used = WHERE_USED_IN_PAGE.get(new_key) or WHERE_USED_IN_PAGE.get(base_key)
        if where_used is None:
            where_used = f"NOT FOUND: no manual entry for '{new_key}' (base '{base_key}') — spot-check page.tsx"
        rows.append({
            "legacy_key": legacy_key if legacy_value is not _MISSING else (source_file or "<none>"),
            "legacy_value": compact_repr(legacy_value),
            "new_key": new_key,
            "mapped_value": compact_repr(mapped),
            "status": status,
            "relevant": relevant,
            "where_used_in_page": where_used,
            "usage_relevant": usage_relevance(new_key, where_used),
            "notes": notes,
        })

    for legacy_key, new_keys in SIMPLE_MAPPING.items():
        lv = raw.get(legacy_key, _MISSING)
        for nk in new_keys:
            add(legacy_key, lv, nk)

    # heroImage: optional, structural passthrough (only { alt } lives in content JSON).
    hero = raw.get("heroImage", _MISSING)
    add("heroImage", hero, "body.hero_image")

    # NEW_FIELD with no legacy source at all.
    add("<none>", _MISSING, "header.json_ld.type")

    # sections: flatten one row per paragraph/tip block for silent-mismatch visibility.
    for si, section in enumerate(raw.get("sections", []) or []):
        add(f"sections[{si}].heading", section.get("heading", ""), f"body.sections[{si}].heading")
        for pi, para in enumerate(section.get("paragraphs", []) or []):
            add(f"sections[{si}].paragraphs[{pi}]", para, f"body.sections[{si}].paragraphs[{pi}]")
        if section.get("tips"):
            for ti, tip in enumerate(section["tips"]):
                add(f"sections[{si}].tips[{ti}]", tip, f"body.sections[{si}].tips[{ti}]")

    # relatedLinks: flatten one row per link.
    for li, link in enumerate(raw.get("relatedLinks", []) or []):
        add(f"relatedLinks[{li}]", link, f"body.related_links[{li}]")

    # Shell-only fields (prod, NOT this content JSON) — flagged so they're not
    # mistaken for a silent drop when they're simply out of scope.
    for shell_key, hint in (
        ("publishedAt", "lib/blog-data.ts shell array; byline date + articleSchema.datePublished"),
        ("updatedAt", "lib/blog-data.ts shell array (optional); articleSchema.dateModified"),
        ("articleImage", "lib/blog-data.ts shell array; inline image after first section"),
    ):
        if shell_key not in raw:
            rows.append({
                "legacy_key": "<out of scope>",
                "legacy_value": "",
                "new_key": f"(prod-only) {shell_key}",
                "mapped_value": "",
                "status": "NEW_FIELD",
                "relevant": "YES",
                "where_used_in_page": f"OUT OF SCOPE for content JSON migration: sourced from {hint}",
                "usage_relevant": "UNVERIFIED",
                "notes": "Not a legacy JSON key — lives in prod's TS shell array, not blog.json. Nothing to migrate here.",
            })

    return rows


def audit_entry(raw: dict, converted: dict | None = None, source_file: str = "") -> tuple[dict, list[dict]]:
    if converted is None:
        converted = migrate_blog_entry(raw)
    rows = build_rows(raw, converted, source_file=source_file)
    return converted, rows


def load_converted_entry(converted_json_path: Path, slug: str) -> dict | None:
    data = json.loads(converted_json_path.read_text(encoding="utf-8-sig"))
    entries = data["blog"] if isinstance(data, dict) and isinstance(data.get("blog"), list) else data
    return next((e for e in entries if e.get("slug") == slug), None)


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


def write_rows(conn: sqlite3.Connection, slug: str, rows: list[dict], language: str = "en") -> None:
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
    print(
        f"{slug}: {len(rows)} rows | OK={counts.get('OK', 0)} "
        f"DROPPED={counts.get('DROPPED', 0)} MISMATCH={counts.get('MISMATCH', 0)} "
        f"UNMAPPED={counts.get('UNMAPPED', 0)} NEW_FIELD={counts.get('NEW_FIELD', 0)}"
    )
    bad = [r for r in rows if r["status"] in ("DROPPED", "MISMATCH", "UNMAPPED")]
    if bad:
        print(f"  ISSUES ({len(bad)}):")
        for r in bad:
            print(f"    - [{r['status']}] {r['legacy_key']} -> {r['new_key']}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("legacy_json_path", type=Path, help="Path to a legacy blog.json file (array of entries)")
    parser.add_argument("slug", nargs="?", help="Slug of the single blog post to audit (omit with --all)")
    parser.add_argument("--all", action="store_true", help="Audit every post in the file")
    parser.add_argument("--db", type=Path, default=None)
    parser.add_argument("--converted-json-path", type=Path, default=None, help="Path to already-migrated content/en/blog.json (generator repo)")
    parser.add_argument("--language", default="en")
    args = parser.parse_args()

    if not args.all and not args.slug:
        parser.error("either provide a slug or pass --all")

    data = json.loads(args.legacy_json_path.read_text(encoding="utf-8-sig"))
    entries = data["blog"] if isinstance(data, dict) and isinstance(data.get("blog"), list) else data

    if args.all:
        targets = entries
    else:
        match = next((e for e in entries if e.get("slug") == args.slug), None)
        if match is None:
            print(f"Slug '{args.slug}' not found in {args.legacy_json_path}", file=sys.stderr)
            return 1
        targets = [match]

    db_path = args.db or Path(__file__).resolve().parent / f"mapping_audit_blog_{args.slug if args.slug else 'all'}.db"
    if db_path.exists():
        try:
            db_path.unlink()
        except PermissionError:
            print(f"NOTE: {db_path} is open in another program; clearing old rows for these slugs instead of recreating the file.")
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)
    conn.executemany("DELETE FROM mapping_audit WHERE puzzle_slug = ?", [(r.get("slug", "<no-slug>"),) for r in targets])
    conn.commit()

    source_file = args.converted_json_path.name if args.converted_json_path else ""

    any_bad = False
    for raw in targets:
        slug = raw.get("slug", "<no-slug>")
        converted_override = None
        if args.converted_json_path:
            converted_override = load_converted_entry(args.converted_json_path, slug)
            if converted_override is None:
                print(f"NOTE: '{slug}' not found in {args.converted_json_path}; falling back to a fresh conversion for this entry.")
        converted, rows = audit_entry(raw, converted=converted_override, source_file=source_file)
        write_rows(conn, slug, rows, language=args.language)
        print_summary(slug, rows)
        if any(r["status"] in ("DROPPED", "MISMATCH", "UNMAPPED") for r in rows):
            any_bad = True

    conn.close()
    print(f"\nWrote {db_path}")
    return 1 if any_bad else 0


if __name__ == "__main__":
    sys.exit(main())
