#!/usr/bin/env python3
"""
messages.json namespace usage audit — "OTHER_PAGES" table.

Unlike puzzles/blog, the home page and most category-listing/static pages
(dot-to-dot-web/app/[locale]/page.tsx, layout.tsx, contact, etc.) are not a
legacy-JSON migration case: their copy lives directly in
content/en/messages.json as next-intl translation namespaces, consumed via
getTranslations()/useTranslations() calls in prod source. There is nothing
to "migrate" here — this audit instead verifies, namespace by namespace,
that every top-level key in messages.json is actually read somewhere in
dot-to-dot-web's real source (app/**/*.tsx, components/**/*.tsx), by
grepping that source directly (not by comparing JSON files to each other,
per the earlier blog-hero-image mistake — see HOW-WE-DID-THIS.md §5).

OTHER_PAGES maps each messages.json top-level namespace to every prod
route + component that actually calls getTranslations()/useTranslations()
with that namespace, verified by reading the source files listed below.

Usage:
    python audit_other_pages.py <messages.json path> [--db path.db]
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path


# namespace -> list of (route, component:line) usage sites.
# Built by grepping getTranslations(...)/useTranslations(...) calls across
# dot-to-dot-web/app/**/*.tsx and dot-to-dot-web/components/**/*.tsx and
# reading each call site to confirm the namespace and the page it renders on.
OTHER_PAGES: dict[str, list[str]] = {
    "nav": [
        "components/sections.tsx:56 (Navbar, in layout.tsx on every page)",
        "components/HomeDiscovery.tsx:26 (home page hero/search)",
    ],
    "audience": [
        "components/sections.tsx:220 (AudienceStrip) — used on home page (app/[locale]/page.tsx)",
    ],
    "categories": [
        "components/sections.tsx:241 (CategoryGrid) — home page",
    ],
    "puzzleSection": [
        "components/sections.tsx:191 (HomeTopDownloads) — home page",
        "components/sections.tsx:343 (puzzle-listing section) — home page",
        "components/TopDownloadsLeaderboard.tsx:18 — home page + layout.tsx (every page, via TopDownloadsLeaderboard)",
    ],
    "benefits": [
        "components/sections.tsx:418 (BenefitsSection) — home page",
    ],
    "howTo": [
        "components/sections.tsx:449 (HowToSection) — home page",
    ],
    "trust": [
        "components/sections.tsx:478 (TrustSection) — home page",
    ],
    "faq": [
        "components/sections.tsx:547,558,569,581 (FaqSection / BlogFaqSection) — home page + blog post pages",
    ],
    "newsletter": [
        "components/sections.tsx:589 (Newsletter section) — home page",
    ],
    "blog": [
        "components/sections.tsx:242,603 (BlogPreview) — home page (preview cards, not the blog list/post pages themselves)",
    ],
    "feedback": [
        "components/sections.tsx:641 (Feedback) — home page",
    ],
    "footer": [
        "components/sections.tsx:657 (Footer) — layout.tsx, every page",
        "components/CategoryMenu.tsx:76 — nav menu, every page",
    ],
    "contactPage": [
        "app/[locale]/contact/page.tsx:35 — /contact route",
    ],
    "common": [
        "Used on nearly every route: home, all category listing + detail pages, blog, contact, TopDownloadsLeaderboard, TrustBadge, GlobalSkipLink, HeroSlider, CategoryMenu — see components/sections.tsx:57 for the representative call.",
    ],
    "puzzleDetail": [
        "All category [slug] detail pages: canada, circus, cute, dinosaurs, flowers, garden, ocean, playgrounds, space, uae, usa-250 — each app/[locale]/<category>/[slug]/page.tsx",
    ],
    "dinosaursPage": [
        "app/[locale]/dinosaurs/page.tsx:65 and dinosaurs/[slug]/page.tsx:79 — /dinosaurs routes",
    ],
    "oceanPage": [
        "app/[locale]/ocean/page.tsx:63 and ocean/[slug]/page.tsx:79 — /ocean routes",
    ],
    "uaePage": [
        "app/[locale]/uae/page.tsx:63 and uae/[slug]/page.tsx:79 — /uae routes",
    ],
    "playgroundsPage": [
        "app/[locale]/playgrounds/page.tsx:63 and playgrounds/[slug]/page.tsx:79 — /playgrounds routes",
    ],
    "gardenPage": [
        "app/[locale]/garden/page.tsx:63 and garden/[slug]/page.tsx:79 — /garden routes",
    ],
    "cutePage": [
        "app/[locale]/cute/page.tsx:63 and cute/[slug]/page.tsx:80 — /cute routes",
    ],
    "usa250Page": [
        "app/[locale]/usa-250/page.tsx:81 and usa-250/[slug]/page.tsx:163 — /usa-250 routes",
    ],
    "blogPage": [
        "app/[locale]/blog/page.tsx:49 (list) and blog/[slug]/page.tsx:116 (post) — /blog routes",
    ],
    "puzzleSearch": [
        "components/HomeDiscovery.tsx:25 — home page search widget",
    ],
    "newsletterForm": [
        "components/NewsletterForm.tsx:7 — used inside the home page newsletter section",
    ],
    "feedbackForm": [
        "components/FeedbackForm.tsx:20 — used inside the home page feedback section",
    ],
    "downloadButton": [
        "components/DownloadButton.tsx:24 — every puzzle detail page (download CTA)",
    ],
    "downloadBadge": [
        "components/DownloadBadge.tsx:8 — puzzle cards across listing pages + home page",
    ],
    "bookmarkButton": [
        "components/BookmarkButton.tsx:12 — puzzle cards + detail pages",
    ],
    "languageSwitcher": [
        "components/LanguageSwitcher.tsx:74 — header, every page",
    ],
    "shareButtons": [
        "components/ShareButtons.tsx:35, FloatingShare.tsx:30, HeaderSharePopover.tsx:29 — blog post pages + puzzle detail pages",
    ],
    "bookmark": [
        "components/FloatingBookmark.tsx:23 — puzzle detail pages",
    ],
    "purchase": [
        "app/[locale]/premium/page.tsx:17,24, purchase/cancelled/page.tsx:16,23, purchase/success/page.tsx:18,25 — /premium and /purchase routes",
        "components/BuyButton.tsx:16, PurchaseDownloadLink.tsx:13, BestOf2026BookAd.tsx:6, FloatingShare.tsx:31, HomeDiscovery.tsx:28 ('purchase.ad'), sections.tsx:658 (Footer) — purchase CTAs across many pages",
    ],
    "homepageUi": [
        "components/sections.tsx:59 (home hero copy), CategoryMenu.tsx:74 (nav dropdown), HomeDiscovery.tsx:29, TopDownloadsLeaderboard.tsx:20 — home page + global nav",
    ],
    "circusPage": [
        "app/[locale]/circus/page.tsx:77 and circus/[slug]/page.tsx:79 — /circus routes",
    ],
    "spacePage": [
        "app/[locale]/space/page.tsx:43 and space/[slug]/page.tsx:54 — /space routes",
    ],
}


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS other_pages_audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            namespace TEXT NOT NULL,
            status TEXT NOT NULL,
            where_used_in_page TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("messages_json_path", type=Path)
    parser.add_argument("--db", type=Path, default=None)
    args = parser.parse_args()

    data = json.loads(args.messages_json_path.read_text(encoding="utf-8-sig"))
    keys = list(data.keys())

    db_path = args.db or Path(__file__).resolve().parent / "mapping_audit_other_pages.db"
    if db_path.exists():
        try:
            db_path.unlink()
        except PermissionError:
            print(f"NOTE: {db_path} is open elsewhere; clearing rows instead of recreating.")
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)
    conn.execute("DELETE FROM other_pages_audit")

    timestamp = datetime.now(timezone.utc).isoformat()
    missing_from_table = [k for k in keys if k not in OTHER_PAGES]
    extra_in_table = [k for k in OTHER_PAGES if k not in keys]

    rows = []
    for key in keys:
        usages = OTHER_PAGES.get(key)
        if usages is None:
            rows.append((key, "NOT FOUND", "No manual entry in OTHER_PAGES — spot-check app/ and components/ for this namespace.", timestamp))
            continue
        for usage in usages:
            status = "UNUSED" if usage.startswith("UNUSED:") else "USED"
            rows.append((key, status, usage, timestamp))

    conn.executemany(
        "INSERT INTO other_pages_audit (namespace, status, where_used_in_page, created_at) VALUES (?, ?, ?, ?)",
        rows,
    )
    conn.commit()
    conn.close()

    used = sum(1 for r in rows if r[1] == "USED")
    unused = sum(1 for r in rows if r[1] == "UNUSED")
    not_found = sum(1 for r in rows if r[1] == "NOT FOUND")
    print(f"{len(keys)} namespaces in {args.messages_json_path.name} | {len(rows)} usage rows: USED={used} UNUSED={unused} NOT_FOUND={not_found}")
    if unused:
        print(f"  UNUSED namespaces (dead in messages.json, safe to remove after confirming no locale-specific override needs them): {[k for k in keys if k in OTHER_PAGES and any(u.startswith('UNUSED:') for u in OTHER_PAGES[k])]}")
    if missing_from_table:
        print(f"  MISSING FROM OTHER_PAGES table (namespace exists in messages.json but no manual entry yet): {missing_from_table}")
    if extra_in_table:
        print(f"  EXTRA IN OTHER_PAGES table (no longer in messages.json — stale entry): {extra_in_table}")
    print(f"\nWrote {db_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
