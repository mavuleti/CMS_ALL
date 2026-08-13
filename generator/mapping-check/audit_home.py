#!/usr/bin/env python3
"""
Home-page content audit — records every messages.json namespace the home
page (dot-to-dot-web/app/[locale]/page.tsx and the components it renders:
HomeDiscovery, sections.tsx's AudienceStrip/CategoryGrid/HomeTopDownloads/
BenefitsSection/HowToSection/TrustSection/FaqSection/BlogPreview/Feedback/
Footer, TopDownloadsLeaderboard, NewsletterForm, FeedbackForm) actually
renders, one row per leaf key, into the same `mapping_audit` table shape as
audit_legal_bundle.py / audit_single_puzzle.py.

Unlike the puzzle/blog/legal audits, home-page content was never migrated
from a legacy schema — it's still flat i18n namespace keys inside
messages.json, so every row here has no legacy source (legacy_key points at
"messages.json:<namespace>.<key>" instead) and status is NEW_FIELD only when
the value is empty/missing; otherwise OK, since prod-source verification
(see migration-mapping-audit-prompt.md discussion) already confirmed every
key these components read is fully populated.

Two kinds of orphaned content, both marked status=ORPHANED rather than OK to
flag them as content nobody reads rather than content that's fine:

1. The whole "hero" namespace — fully populated but UNUSED by the home page;
   HomeDiscovery.tsx renders its hero text from "homepageUi" instead.
2. Seven individual leaf keys inside "nav" — verified against every file in
   dot-to-dot-web/components/ and dot-to-dot-web/app/: nav.blog and
   nav.contact are NOT used by Navbar() (Footer() renders its own separate
   footer.blog/footer.contact instead, with different wording), and
   nav.kids/nav.teachers/nav.parents/nav.freePack/nav.search have zero
   matches anywhere in the codebase. Only nav.scanMe (the floating QR/share
   button) is genuinely read — so "nav" as a namespace is NOT fully orphaned,
   just these 7 specific keys within it.

The home page's SEO/<head> data (title, og:title, meta description) lives in
a separate file entirely — ui-app/content/en/seo/metadata.json's "homepage"
key, not messages.json — so header.* rows are sourced from there, mapped the
same way header.title/header.og.title/header.meta_description/
header.og.description are for puzzles/blog/legal.

Usage:
    python audit_home.py <messages_json_path> [--seo-metadata-path path] [--db path.db] [--language en]
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Namespaces actually rendered by the home page, per audit_other_pages.py's
# OTHER_PAGES table (verified against prod source: components/sections.tsx,
# HomeDiscovery.tsx, TopDownloadsLeaderboard.tsx, NewsletterForm.tsx,
# FeedbackForm.tsx) plus "homepageUi", which HomeDiscovery.tsx reads instead
# of the orphaned "hero" namespace.
HOME_NAMESPACES = [
    "nav", "homepageUi", "audience", "categories", "puzzleSection", "benefits",
    "howTo", "trust", "faq", "newsletter", "blog", "feedback", "footer",
    "common", "puzzleSearch", "newsletterForm", "feedbackForm",
]

# Populated in messages.json but not read anywhere on the home page —
# recorded separately so it's flagged ORPHANED, not OK.
ORPHANED_NAMESPACES = ["hero"]

# Individual leaf keys, within an otherwise-used namespace, that are
# themselves unused — verified by grepping every t('<key>') call across
# dot-to-dot-web/components/ and dot-to-dot-web/app/ and finding zero matches
# (nav.blog/nav.contact do have a same-named sibling call, but it's Footer()
# reading its own separate footer.blog/footer.contact, not these nav.* keys).
ORPHANED_KEYS = {
    "nav.blog", "nav.contact", "nav.kids", "nav.teachers", "nav.parents",
    "nav.freePack", "nav.search",
}


def compact_repr(value: Any, limit: int = 500) -> str:
    text = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
    text = " ".join(str(text).split())
    return text if len(text) <= limit else text[: limit - 1] + "…"


def flatten(prefix: str, value: Any) -> list[tuple[str, Any]]:
    """Flattens nested dicts into dotted leaf keys; leaves lists/scalars as-is
    (namespaces here don't contain arrays worth exploding further)."""
    if isinstance(value, dict):
        rows: list[tuple[str, Any]] = []
        for key, sub_value in value.items():
            rows.extend(flatten(f"{prefix}.{key}" if prefix else key, sub_value))
        return rows
    return [(prefix, value)]


def build_header_rows(seo_metadata: dict | None, source_file: str) -> list[dict]:
    """header.* rows for the home page, sourced from seo/metadata.json's
    "homepage" key — a completely different file than messages.json, which
    is why body.* rows (from messages.json) alone never produced any
    header.* rows before this was added.

    IMPORTANT — verified against prod source (dot-to-dot-web/app/[locale]/
    layout.tsx generateMetadata() + page.tsx JSON-LD blocks): seo/metadata.json's
    "homepage" key is NOT what actually renders for English. layout.tsx only
    uses arabicSeo?.* (from lib/localized-seo.ts, populated for de/ru/es/fi/
    nl/fr/it/ja/pt/ar) and falls back to hardcoded literal strings for EN —
    it never reads seo/metadata.json at all. So every field below is sourced
    from those hardcoded literals (or computed values), with the
    seo/metadata.json comparison kept only as a NOT_READ_BY_PROD cross-check
    so a stale/misleading edit there doesn't look like it does something.
    """
    rows: list[dict] = []

    def add(new_key: str, value: str, legacy_key: str, computed: bool = False) -> None:
        filled = bool(value)
        rows.append({
            "where_used_in_page": "dot-to-dot-web/app/[locale]/layout.tsx generateMetadata() (or page.tsx JSON-LD, see legacy_key)",
            "legacy_key": legacy_key,
            "legacy_value": compact_repr(value),
            "new_key": new_key,
            "new_value": compact_repr(value),
            "status": "OK" if filled else "NEW_FIELD",
            "relevant": "YES" if filled else "NO",
            "usage_relevant": "YES",
            "notes": "computed at render time, not a stored literal" if computed else "",
        })

    # layout.tsx generateMetadata() — hardcoded literals for EN.
    add("header.title", "Free Dot to Dot Printables for Kids | Connect the Dots Worksheets PDF", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata title fallback)")
    add("header.title_template", "%s | DotToDotFreePrintables.com", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (title.template)")
    add("header.meta_description", "hardcoded literal in layout.tsx generateMetadata() — see file for exact wording, distinct from seo/metadata.json's homepage.description", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata description fallback)")
    add("header.canonical", "/{locale}/", "COMPUTED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata canonical)", computed=True)
    add("header.og.title", "Free dot-to-dot worksheets for kids", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata og:title fallback)")
    add("header.og.description", "same var as header.meta_description (shared, not distinct)", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata og:description)")
    add("header.og.url", "/{locale}/", "COMPUTED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata og:url)", computed=True)
    add("header.og.site_name", "DotToDotFreePrintables.com", "HARDCODED:dot-to-dot-web/lib/seo.ts (SITE_NAME)")
    add("header.og.type", "website", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata og:type)")
    add("header.og.image", "/images/trex-61-puzzle.webp (800x679)", "HARDCODED:dot-to-dot-web/lib/seo.ts (DEFAULT_OG_IMAGE)")
    add("header.twitter.card", "summary_large_image", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata twitter:card)")
    add("header.manifest", "/manifest.webmanifest", "HARDCODED:dot-to-dot-web/app/[locale]/layout.tsx (generateMetadata manifest)")

    # page.tsx JSON-LD — 4 separate schema blocks, none read seo/metadata.json.
    add("header.json_ld.website.type", "WebSite", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (WebSite JSON-LD)")
    add("header.json_ld.website.name", "DotToDotFreePrintables.com (SITE_NAME)", "HARDCODED:dot-to-dot-web/lib/seo.ts (SITE_NAME)")
    add("header.json_ld.organization.type", "Organization", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (Organization JSON-LD)")
    add("header.json_ld.organization.logo", "/icon-512.png (absoluteUrl)", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (Organization JSON-LD logo)")
    add("header.json_ld.organization.same_as", "hardcoded array: Pinterest, Facebook, YouTube profile URLs", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (Organization JSON-LD sameAs)")
    add("header.json_ld.collection_page.type", "CollectionPage", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (CollectionPage JSON-LD)")
    add("header.json_ld.collection_page.name", "Free Dot to Dot Printables for Kids (third distinct hardcoded title string in the codebase — differs from header.title and seo/metadata.json's homepage.title)", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (CollectionPage JSON-LD name fallback)")
    add("header.json_ld.item_list.type", "ItemList (featured puzzles)", "HARDCODED:dot-to-dot-web/app/[locale]/page.tsx (ItemList JSON-LD, itemListElement computed from featuredPuzzles)")
    rows.append({
        "where_used_in_page": "N/A",
        "legacy_key": "N/A",
        "legacy_value": "",
        "new_key": "header.json_ld.breadcrumb",
        "new_value": "",
        "status": "DROPPED",
        "relevant": "NO",
        "usage_relevant": "YES",
        "notes": "confirmed: no Breadcrumb JSON-LD is emitted on the home page at all",
    })

    # seo/metadata.json's "homepage" key itself — kept as a cross-check row so
    # its existence doesn't get mistaken for the live source of truth.
    homepage = (seo_metadata or {}).get("homepage")
    if isinstance(homepage, dict):
        for leaf_key, value in homepage.items():
            rows.append({
                "where_used_in_page": "NOT READ by prod for English — dot-to-dot-web/app/[locale]/layout.tsx never reads seo/metadata.json; only non-English locales (de/ru/es/fi/nl/fr/it/ja/pt/ar) get real localized copy, from lib/localized-seo.ts's localizedSiteSeo(), not this file",
                "legacy_key": f"{source_file}:homepage.{leaf_key}",
                "legacy_value": compact_repr(value),
                "new_key": f"UNUSED:seo/metadata.json:homepage.{leaf_key}",
                "new_value": compact_repr(value),
                "status": "UNMAPPED",
                "relevant": "NO",
                "usage_relevant": "NO",
                "notes": "stored but not read by prod for EN — editing this file will not change the live home page",
            })
    return rows


def build_rows(messages: dict, seo_metadata: dict | None, source_file: str, seo_source_file: str) -> list[dict]:
    rows: list[dict] = build_header_rows(seo_metadata, seo_source_file)
    for namespace in HOME_NAMESPACES + ORPHANED_NAMESPACES:
        namespace_value = messages.get(namespace)
        if namespace_value is None:
            rows.append({
                "where_used_in_page": "home page (see audit_other_pages.py OTHER_PAGES for exact call sites)",
                "legacy_key": f"{source_file}:{namespace}",
                "legacy_value": "",
                "new_key": f"body.{namespace}",
                "new_value": "",
                "status": "DROPPED",
                "relevant": "NO",
                "usage_relevant": "UNVERIFIED",
                "notes": "namespace expected on the home page but missing from messages.json entirely",
            })
            continue
        namespace_orphaned = namespace in ORPHANED_NAMESPACES
        for leaf_key, value in flatten(namespace, namespace_value):
            key_orphaned = namespace_orphaned or leaf_key in ORPHANED_KEYS
            filled = value not in (None, "", [], {})
            if key_orphaned:
                status = "ORPHANED"
            elif filled:
                status = "OK"
            else:
                status = "NEW_FIELD"

            if namespace_orphaned:
                where_used = "populated but not read by any home-page component — HomeDiscovery.tsx uses homepageUi instead"
            elif key_orphaned:
                where_used = f"populated but not read anywhere in dot-to-dot-web/components/ or dot-to-dot-web/app/ — {leaf_key} is dead content"
            else:
                where_used = "home page (see audit_other_pages.py OTHER_PAGES for exact call sites)"

            rows.append({
                "where_used_in_page": where_used,
                "legacy_key": f"{source_file}:{leaf_key}",
                "legacy_value": "",
                "new_key": f"body.{leaf_key}",
                "new_value": compact_repr(value),
                "status": status,
                "relevant": "YES" if status == "OK" else "NO",
                "usage_relevant": "NO" if key_orphaned else "YES",
                "notes": "" if filled else "empty — needs manual fill-in",
            })
    return rows


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


def write_rows(conn: sqlite3.Connection, rows: list[dict], language: str) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    conn.executemany(
        """INSERT INTO mapping_audit
           (puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, new_key, new_value, status, relevant, usage_relevant, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            ("home", language, r["where_used_in_page"], r["legacy_key"], r["legacy_value"], r["new_key"], r["new_value"], r["status"], r["relevant"], r["usage_relevant"], r["notes"], timestamp)
            for r in rows
        ],
    )
    conn.commit()


def print_summary(rows: list[dict]) -> None:
    counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
    print(
        f"home: {len(rows)} rows | OK={counts.get('OK', 0)} NEW_FIELD={counts.get('NEW_FIELD', 0)} "
        f"ORPHANED={counts.get('ORPHANED', 0)} DROPPED={counts.get('DROPPED', 0)}"
    )
    orphaned = [r for r in rows if r["status"] == "ORPHANED"]
    if orphaned:
        keys = sorted(r["new_key"].removeprefix("body.") for r in orphaned)
        print(f"  ORPHANED ({len(keys)} keys, populated but unused on home page): {', '.join(keys)}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("messages_json_path", type=Path)
    parser.add_argument("--seo-metadata-path", type=Path, default=None, help="Path to seo/metadata.json (default: <messages_json_path's dir>/seo/metadata.json)")
    parser.add_argument("--db", type=Path, default=None)
    parser.add_argument("--language", default="en")
    args = parser.parse_args()

    messages = json.loads(args.messages_json_path.read_text(encoding="utf-8-sig"))
    seo_metadata_path = args.seo_metadata_path or args.messages_json_path.parent / "seo" / "metadata.json"
    seo_metadata = json.loads(seo_metadata_path.read_text(encoding="utf-8-sig")) if seo_metadata_path.exists() else None
    rows = build_rows(messages, seo_metadata, args.messages_json_path.name, seo_metadata_path.name if seo_metadata else "seo/metadata.json")

    db_path = args.db or Path(__file__).resolve().parent / "mapping_audit_home.db"
    if db_path.exists():
        try:
            db_path.unlink()
        except PermissionError:
            print(f"NOTE: {db_path} is open in another program; clearing old rows instead of recreating the file.")
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)
    conn.execute("DELETE FROM mapping_audit WHERE puzzle_slug = 'home'")
    conn.commit()
    write_rows(conn, rows, args.language)
    conn.close()

    print_summary(rows)
    print(f"\nWrote {db_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
