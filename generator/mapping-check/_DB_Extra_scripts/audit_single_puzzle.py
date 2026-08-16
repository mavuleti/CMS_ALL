#!/usr/bin/env python3
"""
Single-puzzle legacy -> new schema mapping audit.

Verification tool (see migration-mapping-audit-prompt.md): loads one legacy
puzzle entry by slug, converts it using the exact same conversion logic as
the real migrator (migrate_legacy_schema.convert_entry, imported — not
reimplemented, so the audit can never silently drift from what the batch
migration actually does), and writes a field-by-field audit into a SQLite
`mapping_audit` table: legacy key/value -> intended new key -> actual mapped
value, with an automatic OK / DROPPED / MISMATCH / UNMAPPED / NEW_FIELD flag
per row.

Read-only against real content: never writes back into any puzzle JSON file,
only into the throwaway audit .db.

Reusable: import `audit_entry()` / `build_rows()` for other puzzles/slugs, or
just re-run this script with a different slug — the mapping logic lives in
one place (migrate_legacy_schema.convert_entry) plus the ROW_SPEC below.

Usage:
    python audit_single_puzzle.py <legacy_json_path> <slug> [--db path.db]
    python audit_single_puzzle.py <legacy_json_path> --all [--db path.db]
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "tools"))
from migrate_legacy_schema import convert_entry  # noqa: E402
sys.path.insert(0, str(Path(__file__).resolve().parent))
from value_repr import full_repr  # noqa: E402


_MISSING = object()


def get_path(obj: Any, path: str) -> Any:
    """Dotted-path lookup, e.g. 'header.og.title'. Returns _MISSING if absent."""
    current = obj
    for part in path.split("."):
        if not isinstance(current, dict) or part not in current:
            return _MISSING
        current = current[part]
    return current


def compact_repr(value: Any) -> str:
    return full_repr(value, missing=_MISSING)


# Legacy key -> new key(s), per puzzle-json-schema.md §2.
SIMPLE_MAPPING = {
    "slug": ["slug"],
    "seoTitle": ["header.title", "header.og.title"],
    "seoDescription": ["header.meta_description", "header.og.description", "header.json_ld.description"],
    # Single source field, dual purpose at render time: verified against prod
    # (dot-to-dot-web/lib/localized-seo.ts puzzleImageAlt()) that seoImageAlt
    # drives BOTH the og:image alt tag AND the visible <img alt> on the page,
    # not just Open Graph. The new schema only stores it once, at
    # header.og.image_alt — ui-app/lib/converted-content.ts reads it back out
    # into the same `seoImageAlt` shape and ui-app's CommonPuzzleTemplate.tsx
    # feeds it into the same puzzleImageAlt() helper for the visible image,
    # so one stored value correctly serves both uses end-to-end. There is no
    # separate "visible image alt" field to map to — that would be a false
    # DROPPED/UNMAPPED finding if added as a second target here.
    "seoImageAlt": ["header.og.image_alt"],
    "name": ["header.json_ld.name", "body.name"],
    "seoH1": ["body.h1"],
    "tagline": ["body.tagline"],
    "description": ["body.description"],
    "funFact": ["body.fun_fact"],
}

DOT_GUIDE_SIMPLE = {"intro": "intro", "outro": "outro"}
SECTION_FIELDS = ("range", "title", "learn", "fact")
SCHEME_FIELDS = ("name", "note")
SCHEME_MAPPING_FIELDS = ("range", "part", "color", "hex", "why")

# New-schema-only fields with no legacy source (puzzle-json-schema.md §2/§3).
NEW_FIELD_ONLY = [
    "header.json_ld.type",
    "header.json_ld.image",
    "header.json_ld.educational_use",
    "header.json_ld.age_range",
]

# The collection-level header/body object (e.g. content/en/puzzles-cute.json's
# top-level "collection" key) has NO legacy equivalent at all — the legacy
# dot-to-dot-web content files are flat arrays with no collection wrapper, so
# this is content authored directly in the new schema, not migrated from
# anything. Verified against dot-to-dot-web/app/[locale]/cute/page.tsx: the
# EN category page does not read this "collection" object at all — it
# hardcodes its own title/description, pulls h1/hero text from next-intl
# translations, builds its own breadcrumb JSON-LD inline, and renders FAQs
# from the locale's faqs.json pack via CategoryFaqSection, not from
# collection.body.faqs. A grep across dot-to-dot-web/app + lib + ui-app for
# any ".collection" / "collection.header" / "collection.body" access found
# no references anywhere, so every field below is genuinely unused today —
# not a bug, just informational, same as the puzzle-level header.json_ld.*
# gaps.
COLLECTION_FIELDS = [
    "header.title",
    "header.meta_description",
    "header.og.title",
    "header.og.description",
    "header.og.image",
    "header.json_ld.type",
    "header.json_ld.name",
    "header.json_ld.description",
    "header.json_ld.image",
    "header.json_ld.main_entity.type",
    "header.json_ld.main_entity.item_source",
    "header.breadcrumb_json_ld.type",
    "body.h1",
    "body.name",
    "body.tagline",
    "body.description",
    "body.hero_image",
    "body.slug",
]

# Where each new-schema key path is actually consumed at render time, verified
# by reading the prod "Cute" category pages directly:
#   dot-to-dot-web/app/[locale]/cute/page.tsx          (category listing)
#   dot-to-dot-web/app/[locale]/cute/[slug]/page.tsx   (puzzle detail)
#   dot-to-dot-web/components/GuideListen.tsx          (dot-guide renderer)
#   dot-to-dot-web/lib/seo.ts                          (puzzleJsonLd / howToJsonLd)
# A handful of fields the schema stores are demonstrably NOT read by prod at
# all — prod recomputes that value fresh at build/render time instead. Those
# are called out explicitly rather than left to look like a normal usage, so
# a reviewer doesn't assume editing the stored field will change the page.
_WHERE_USED_IN_PAGE = {
    "slug": "URL routing only — /cute/{slug}/ links + generateStaticParams (cute/page.tsx, cute/[slug]/page.tsx)",
    "header.title": "<title> tag + og:title/twitter:title (cute/[slug]/page.tsx generateMetadata, lines ~40,44,55)",
    "header.og.title": "og:title/twitter:title, same as header.title (cute/[slug]/page.tsx:44,55)",
    "header.meta_description": "<meta name=description> tag (cute/[slug]/page.tsx:41)",
    "header.og.description": "og:description/twitter:description (cute/[slug]/page.tsx:45,56)",
    "header.json_ld.description": "NOT READ by prod — puzzleJsonLd() builds its `description` fresh from body.description (puzzle.description) at render time, ignoring this stored field (lib/seo.ts:152; cute/[slug]/page.tsx:102)",
    "header.og.image_alt": "og:image alt AND the visible <img alt> on both the listing card and detail preview image (cute/[slug]/page.tsx:38,143,229; cute/page.tsx:103)",
    "header.json_ld.name": "NOT READ by prod — puzzleJsonLd() is given a name built inline as `${puzzle.name} Dot-to-Dot Printable` (cute/[slug]/page.tsx:101), ignoring this stored field",
    "header.json_ld.type": "NOT READ by prod — puzzleJsonLd() hardcodes @type: ['CreativeWork', 'LearningResource'] (lib/seo.ts:150)",
    "header.json_ld.image": "NOT READ by prod — puzzleJsonLd() builds its own ImageObject from body's image URL at render time (lib/seo.ts:166-185)",
    "header.json_ld.educational_use": "NOT READ by prod — puzzleJsonLd() hardcodes educationalUse: 'practice' (lib/seo.ts:157)",
    "header.json_ld.age_range": "NOT READ by prod — puzzleJsonLd() derives typicalAgeRange by regex-parsing the age field at render time (lib/seo.ts:146,165), not from this stored field",
    "body.name": "puzzle name shown in listing card <h2>/related-card <h3>, breadcrumb current-page name, alt-text fallback template, download/share button name (cute/page.tsx:108; cute/[slug]/page.tsx:94,131,233)",
    "body.h1": "<h1> on the detail page, EN locale ONLY — other locales render a translated '{name} {suffix}' string instead and ignore this field (cute/[slug]/page.tsx:156)",
    "body.tagline": "listing-page card blurb ONLY (cute/page.tsx:109) — not rendered anywhere on the puzzle detail page",
    "body.description": "detail-page intro paragraph, and also feeds prod's JSON-LD `description` (cute/[slug]/page.tsx:157,102; lib/seo.ts:152)",
    "body.fun_fact": "detail-page 'fun fact' callout box (cute/[slug]/page.tsx:172)",
    "body.faqs": "NOT READ by prod — FAQs shown on the page come from the locale's faqs.json pack via PuzzleFaqSection, this stored field is ignored entirely (components/sections.tsx:568-575)",
    "body.faqs[].q": "NOT READ by prod — FAQs shown on the page come from the locale's faqs.json pack via PuzzleFaqSection, this stored field is ignored entirely (components/sections.tsx:568-575)",
    "body.faqs[].a": "NOT READ by prod — FAQs shown on the page come from the locale's faqs.json pack via PuzzleFaqSection, this stored field is ignored entirely (components/sections.tsx:568-575)",
    "body.dot_guide.intro": "GuideListen intro text + feeds HowTo JSON-LD (cute/[slug]/page.tsx:115,198; lib/seo.ts howToJsonLd)",
    "body.dot_guide.outro": "GuideListen outro text (cute/[slug]/page.tsx:199)",
    "body.dot_guide.sections[].range": "GuideListen step heading ('{range} — {title}') + HowTo JSON-LD step (GuideListen.tsx:274-276)",
    "body.dot_guide.sections[].title": "GuideListen step heading, combined with range (GuideListen.tsx:275)",
    "body.dot_guide.sections[].learn": "GuideListen step instructions text + HowTo JSON-LD step text (GuideListen.tsx:276)",
    "body.dot_guide.sections[].fact": "GuideListen per-step 'fun fact' callout (GuideListen.tsx:277-282)",
    "body.dot_guide.color_schemes[].name": "GuideListen color-scheme section heading (GuideListen.tsx:289-292)",
    "body.dot_guide.color_schemes[].note": "GuideListen color-scheme note paragraph (GuideListen.tsx:292)",
    "body.dot_guide.color_schemes[].mapping[].range": "GuideListen color-mapping list item: '{range} ({part}):' label — dot range (GuideListen.tsx:294-297)",
    "body.dot_guide.color_schemes[].mapping[].part": "GuideListen color-mapping list item: '{range} ({part}):' label — puzzle part name (GuideListen.tsx:296)",
    "body.dot_guide.color_schemes[].mapping[].color": "GuideListen color-mapping list item text (GuideListen.tsx:312)",
    "body.dot_guide.color_schemes[].mapping[].hex": "GuideListen color swatch background + shown only if present (GuideListen.tsx:297-312)",
    "body.dot_guide.color_schemes[].mapping[].why": "GuideListen color-mapping list item: '{color} — {why}' text — why this color was chosen (GuideListen.tsx:312)",

    # Collection-level (category listing page) fields — verified against
    # dot-to-dot-web/app/[locale]/cute/page.tsx. None of these are read by
    # prod's EN category page today; see the COLLECTION_FIELDS comment above.
    "collection.header.title": "NOT READ by prod — the category page's <title> is hardcoded inline in generateMetadata(), not sourced from this field (cute/page.tsx:24)",
    "collection.header.meta_description": "NOT READ by prod — the <meta description> is hardcoded inline in generateMetadata(), not sourced from this field (cute/page.tsx:26)",
    "collection.header.og.title": "NOT READ by prod — og:title/twitter:title fall back to a hardcoded string unless localizedCollectionSeo() supplies one; this stored field is never consulted (cute/page.tsx:20)",
    "collection.header.og.description": "NOT READ by prod — og:description/twitter:description fall back to a hardcoded string unless localizedCollectionSeo() supplies one; this stored field is never consulted (cute/page.tsx:21)",
    "collection.header.og.image": "NOT READ by prod — the OG image is hardcoded inline (absoluteUrl('/images/cute-puppy-puzzle.webp')), not sourced from this field (cute/page.tsx:22)",
    "collection.header.json_ld.type": "NOT READ by prod — no CollectionPage JSON-LD is emitted by the category page at all; only a hand-built BreadcrumbList schema is rendered (cute/page.tsx:73-80)",
    "collection.header.json_ld.name": "NOT READ by prod — no CollectionPage JSON-LD is emitted by the category page at all (cute/page.tsx:73-80)",
    "collection.header.json_ld.description": "NOT READ by prod — no CollectionPage JSON-LD is emitted by the category page at all (cute/page.tsx:73-80)",
    "collection.header.json_ld.image": "NOT READ by prod — no CollectionPage JSON-LD is emitted by the category page at all (cute/page.tsx:73-80)",
    "collection.header.json_ld.main_entity.type": "NOT READ by prod — no CollectionPage/ItemList JSON-LD is emitted by the category page at all (cute/page.tsx:73-80)",
    "collection.header.json_ld.main_entity.item_source": "NOT READ by prod — no CollectionPage/ItemList JSON-LD is emitted by the category page at all (cute/page.tsx:73-80)",
    "collection.header.breadcrumb_json_ld.type": "NOT READ by prod — prod builds its own inline BreadcrumbList object (breadcrumbSchema) instead of reading this stored field (cute/page.tsx:73-80)",
    "collection.body.h1": "NOT READ by prod — the visible <h1> comes from the next-intl translation t('h1'), not this stored field (cute/page.tsx:93)",
    "collection.body.name": "NOT READ by prod anywhere on the category page itself (per-puzzle body.name is used on puzzle cards instead, a different field)",
    "collection.body.tagline": "NOT READ by prod on the category page (per-puzzle body.tagline is shown on each card instead, a different field)",
    "collection.body.description": "NOT READ by prod — the hero paragraph comes from the next-intl translation t('description'), not this stored field (cute/page.tsx:96)",
    "collection.body.hero_image": "NOT READ by prod — the category page has no single hero image; each puzzle card renders its own per-puzzle image instead (cute/page.tsx:110)",
    "collection.body.slug": "NOT READ by prod — the category URL segment ('/cute/') is hardcoded throughout the page/routing, not sourced from this field",
    "collection.body.faqs[].q": "NOT READ by prod — category-page FAQs come from the locale's faqs.json pack via CategoryFaqSection(categoryKey), not from this stored field (cute/page.tsx:135)",
    "collection.body.faqs[].a": "NOT READ by prod — category-page FAQs come from the locale's faqs.json pack via CategoryFaqSection(categoryKey), not from this stored field (cute/page.tsx:135)",
    "collection.header.breadcrumb_json_ld.items[].position": "NOT READ by prod — prod builds its own inline BreadcrumbList object (breadcrumbSchema) instead of reading this stored field (cute/page.tsx:73-80)",
    "collection.header.breadcrumb_json_ld.items[].name": "NOT READ by prod — prod builds its own inline BreadcrumbList object (breadcrumbSchema) instead of reading this stored field (cute/page.tsx:73-80)",
    "collection.header.breadcrumb_json_ld.items[].path": "NOT READ by prod — prod builds its own inline BreadcrumbList object (breadcrumbSchema) instead of reading this stored field (cute/page.tsx:73-80)",
}

import re as _re

_INDEX_RE = _re.compile(r"\[\d+\]")


def where_used_for(new_key: str) -> str:
    """Looks up render-site usage for a new-schema key path, ignoring array
    indices (e.g. body.dot_guide.sections[3].range normalizes to
    body.dot_guide.sections[].range) so one entry covers every row/index."""
    normalized = _INDEX_RE.sub("[]", new_key)
    return _WHERE_USED_IN_PAGE.get(normalized, "")


# Keywords a legitimate "where used in page" description should contain for a
# given new-schema key — used to cross-check column 1 (where_used_in_page)
# against column 3 (new_key), e.g. an "image_alt" key's usage description
# should mention "alt" (as in <img alt=...>), not just "image".
_LEAF_KEYWORDS: list[tuple[str, list[str]]] = [
    ("image_alt", ["alt"]),
    ("og.title", ["title"]),
    ("json_ld.title", ["title"]),
    ("title", ["title"]),
    ("meta_description", ["description", "meta"]),
    ("og.description", ["description"]),
    ("json_ld.description", ["description"]),
    ("description", ["description"]),
    ("json_ld.name", ["name"]),
    ("body.name", ["name"]),
    ("json_ld.type", ["type"]),
    ("json_ld.image", ["image"]),
    ("json_ld.educational_use", ["educational"]),
    ("json_ld.age_range", ["age"]),
    ("h1", ["h1", "heading", "title"]),
    ("tagline", ["tagline", "blurb", "card"]),
    ("fun_fact", ["fact"]),
    ("faqs", ["faq"]),
    ("dot_guide.intro", ["intro"]),
    ("dot_guide.outro", ["outro"]),
    ("sections[].range", ["range", "step"]),
    ("sections[].title", ["title", "heading", "step"]),
    ("sections[].learn", ["learn", "instruction", "step", "text"]),
    ("sections[].fact", ["fact"]),
    ("color_schemes[].name", ["color", "scheme", "heading"]),
    ("color_schemes[].note", ["note"]),
    ("mapping[].range", ["range"]),
    ("mapping[].part", ["part"]),
    ("mapping[].color", ["color"]),
    ("mapping[].hex", ["hex", "swatch"]),
    ("mapping[].why", ["why"]),
    ("slug", ["url", "routing", "route", "link"]),
]


def compute_usage_relevance(new_key: str, where_used_text: str) -> tuple[str, str]:
    """Cross-checks the 'where used in page' description against the new_key
    it's supposedly describing — e.g. an `header.og.image_alt` row whose
    description doesn't mention "alt" anywhere is suspicious, even if a
    description string exists. Returns (relevant, reason).

    - explicit "NOT READ by prod" text is itself a verified, relevant answer
      (it correctly describes non-usage of that exact key) -> YES
    - empty/unresearched text -> UNVERIFIED
    - text present but shares no expected keyword with the key -> NO
    - otherwise -> YES
    """
    if not where_used_text:
        return "UNVERIFIED", "no usage description found for this key yet — needs manual research or a best-effort code search"
    if "NOT READ by prod" in where_used_text:
        return "YES", "explicitly documents non-usage, which is itself the correct answer for this key"

    text_lower = where_used_text.lower()
    normalized_key = _INDEX_RE.sub("[]", new_key)
    # Longest suffix first, so a specific rule like "sections[].title" wins
    # over the generic "title" rule for the same key.
    for suffix, keywords in sorted(_LEAF_KEYWORDS, key=lambda pair: -len(pair[0])):
        if normalized_key.endswith(suffix):
            if any(keyword in text_lower for keyword in keywords):
                return "YES", f"usage text mentions expected keyword(s) for '{suffix}'"
            return "NO", f"usage text doesn't mention any of {keywords}, expected for a '{suffix}' field — description may be for the wrong key"
    return "UNVERIFIED", "no keyword rule defined for this key path yet"


def best_effort_prod_search(prod_root: Path | None, category: str, legacy_key: str, new_key: str) -> str:
    """When no manually-verified usage entry exists, grep the prod category's
    page files for a plausible reference to this field, rather than leaving
    it silently blank. Returns a best-guess "FILE:LINE: <text>" description,
    or an explicit "no usage found" message if nothing turned up."""
    if prod_root is None:
        return ""
    search_dirs = [
        prod_root / "app" / "[locale]" / category,
        prod_root / "components",
        prod_root / "lib",
    ]
    leaf = new_key.rsplit(".", 1)[-1]
    leaf = _INDEX_RE.sub("", leaf)
    candidates = {legacy_key, leaf, leaf.replace("_", "")}
    for directory in search_dirs:
        if not directory.is_dir():
            continue
        for path in directory.rglob("*.ts*"):
            try:
                lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
            except OSError:
                continue
            for i, line in enumerate(lines, start=1):
                if any(candidate and candidate.lower() in line.lower() for candidate in candidates):
                    rel = path.relative_to(prod_root)
                    return f"AUTO-DETECTED (unverified, re-check manually): {rel}:{i}: {line.strip()[:140]}"
    return f"NOT FOUND in prod code under {category}/ — likely unused there, or needs a manual check before mapping it anywhere"


def _status_for(container_has_key: bool, mapped_value: Any, legacy_value: Any) -> str:
    if not container_has_key:
        return "UNMAPPED"
    if mapped_value is _MISSING:
        return "DROPPED"
    if compact_repr(mapped_value) != compact_repr(legacy_value):
        return "MISMATCH"
    return "OK"


def compute_relevance(status: str, legacy_value: Any, mapped_value: Any) -> tuple[str, str]:
    """Independently cross-checks column 3 (mapped_value) against columns 1+2
    (legacy_key/value, new_key) — i.e. does the *actual* converted value still
    relate to the value it supposedly came from? Returns (relevant, reason).

    This is deliberately separate from `status`: status says whether the
    conversion followed the mapping table; relevance says whether the value
    that landed at the target key still looks like it came from the source
    value, which catches a value that's technically "at the right key" but
    was clearly swapped/garbled in transit.
    """
    legacy_text = compact_repr(legacy_value).strip().lower()
    mapped_text = compact_repr(mapped_value).strip().lower()

    if status == "OK":
        return "YES", "exact match"
    if status == "NEW_FIELD":
        return "YES", "schema-only field, no legacy source expected"
    if status == "DROPPED":
        return "NO", "target key path is absent in converted output"
    if status == "UNMAPPED":
        return "NO", "no defined target key for this legacy key"
    if status == "MISMATCH":
        if legacy_text and mapped_text and legacy_text != "<absent>" and mapped_text != "<absent>":
            if legacy_text in mapped_text or mapped_text in legacy_text:
                return "PARTIAL", "mapped value overlaps legacy value but is not an exact match"
        return "NO", "mapped value shares no discernible content with legacy value"
    return "NO", f"unrecognized status '{status}'"


def _row(
    legacy_key: str, legacy_value: Any, new_key: str, mapped_value: Any, status: str, notes: str = "",
    prod_root: Path | None = None, category: str = "cute", lookup_key: str | None = None,
) -> dict:
    """`lookup_key` disambiguates the internal where_used_in_page lookup from
    the stored `new_key` — needed for collection-level rows, whose stored
    new_key (e.g. "header.title") intentionally matches the puzzle-level key
    shape, but whose real page-usage answer is different from the
    puzzle-level "header.title" entry, so the lookup must use a distinct key
    ("collection.header.title") internally without that prefix leaking into
    the displayed new_key column."""
    if lookup_key is None:
        lookup_key = new_key
    relevant, relevance_reason = compute_relevance(status, legacy_value, mapped_value)
    combined_notes = notes
    if relevant != "YES":
        combined_notes = f"{notes}; {relevance_reason}" if notes else relevance_reason

    where_used = where_used_for(lookup_key)
    if not where_used:
        where_used = best_effort_prod_search(prod_root, category, legacy_key, new_key)
    usage_relevant, usage_reason = compute_usage_relevance(new_key, where_used)
    if usage_relevant != "YES":
        combined_notes = f"{combined_notes}; usage-check: {usage_reason}" if combined_notes else f"usage-check: {usage_reason}"

    return {
        "where_used_in_page": where_used or "not verified against prod page code yet",
        "legacy_key": legacy_key,
        "legacy_value": compact_repr(legacy_value) if legacy_value is not None else "",
        "new_key": new_key,
        "mapped_value": compact_repr(mapped_value),
        "status": status,
        "relevant": relevant,
        "usage_relevant": usage_relevant,
        "notes": combined_notes,
    }


def build_rows(
    raw: dict, converted: dict, prod_root: Path | None = None, category: str = "cute", source_file: str = "",
) -> list[dict]:
    rows: list[dict] = []

    def _r(legacy_key: str, legacy_value: Any, new_key: str, mapped_value: Any, status: str, notes: str = "") -> dict:
        return _row(legacy_key, legacy_value, new_key, mapped_value, status, notes, prod_root=prod_root, category=category)

    def _source_key(new_key: str) -> str:
        """For fields with no legacy key (authored directly in the new
        schema, e.g. puzzle/collection FAQs, header.json_ld.*): instead of an
        opaque '<none>', record which file the value actually lives in, so
        the legacy_key column always points somewhere real."""
        return f"{source_file}:{new_key}" if source_file else "<none>"

    for legacy_key, targets in SIMPLE_MAPPING.items():
        legacy_value = raw.get(legacy_key, _MISSING)
        for target in targets:
            mapped_value = get_path(converted, target)
            status = _status_for(legacy_key in raw, mapped_value, legacy_value)
            rows.append(_r(legacy_key, legacy_value, target, mapped_value, status))

    if "faqs" in raw:
        # Legacy source actually had a faqs array — flatten per q/a, same
        # treatment as sections/mapping below, so a mismatch in one FAQ
        # doesn't hide inside a single collapsed row.
        legacy_faqs = raw["faqs"]
        new_faqs = get_path(converted, "body.faqs")
        new_faqs = new_faqs if isinstance(new_faqs, list) else []
        for i, faq in enumerate(legacy_faqs):
            new_faq = new_faqs[i] if i < len(new_faqs) else _MISSING
            for sub in ("q", "a"):
                legacy_value = faq.get(sub, _MISSING)
                mapped_value = new_faq.get(sub, _MISSING) if isinstance(new_faq, dict) else _MISSING
                status = _status_for(sub in faq, mapped_value, legacy_value)
                rows.append(_r(f"faqs[{i}].{sub}", legacy_value, f"body.faqs[{i}].{sub}", mapped_value, status))
    else:
        # No legacy faqs field at all (the common case today) — but the
        # converted/real content file may still have body.faqs authored
        # directly in the new schema (same situation as collection.body.faqs:
        # not migrated, hand-written). Audit those as NEW_FIELD rows instead
        # of silently producing zero rows for real content that exists.
        new_faqs = get_path(converted, "body.faqs")
        new_faqs = new_faqs if isinstance(new_faqs, list) else []
        for i, faq in enumerate(new_faqs):
            for sub in ("q", "a"):
                mapped_value = faq.get(sub, _MISSING) if isinstance(faq, dict) else _MISSING
                filled = mapped_value is not _MISSING and compact_repr(mapped_value) != ""
                new_key = f"body.faqs[{i}].{sub}"
                rows.append(_r(
                    _source_key(new_key), mapped_value, new_key, mapped_value, "NEW_FIELD",
                    notes="" if filled else "empty — needs manual fill-in",
                ))

    dot_guide = raw.get("dotGuide", {})
    for legacy_sub, new_sub in DOT_GUIDE_SIMPLE.items():
        legacy_value = dot_guide.get(legacy_sub, _MISSING)
        target = f"body.dot_guide.{new_sub}"
        mapped_value = get_path(converted, target)
        status = _status_for(legacy_sub in dot_guide, mapped_value, legacy_value)
        rows.append(_r(f"dotGuide.{legacy_sub}", legacy_value, target, mapped_value, status))

    # dot_guide.heading: NEW_FIELD, no legacy source at all — synthesized as
    # "How to Solve the {name} Dot-to-Dot Puzzle" (verified 2026-08-16 against
    # every already-migrated category's real content, e.g. dinosaurs/garden).
    # CommonPuzzleTemplate.tsx's requireField() throws a hard build error if
    # dotGuide is present but heading is missing/empty, so this must always be
    # generated whenever a dot_guide block exists — it was missing from this
    # script entirely until 2026-08-16, which silently broke canada/uae/
    # usa-250/ocean once a stale build-cache fallback stopped covering for it
    # (see POPULATE-NEW-LANGUAGE-RULES.md 3c). Non-English locales do NOT get
    # this from cloning — clone_en_to_language.py re-derives it per locale
    # from that locale's own translated name via HEADING_TEMPLATES.
    if get_path(converted, "body.dot_guide") not in (_MISSING, None):
        name = get_path(converted, "body.name")
        heading = f"How to Solve the {name} Dot-to-Dot Puzzle" if isinstance(name, str) and name else _MISSING
        target = "body.dot_guide.heading"
        rows.append(_r(_source_key(target), heading, target, heading, "NEW_FIELD"))

    legacy_sections = dot_guide.get("sections", [])
    new_sections = get_path(converted, "body.dot_guide.sections")
    new_sections = new_sections if isinstance(new_sections, list) else []
    for i, section in enumerate(legacy_sections):
        new_section = new_sections[i] if i < len(new_sections) else _MISSING
        for field in SECTION_FIELDS:
            legacy_value = section.get(field, _MISSING)
            mapped_value = new_section.get(field, _MISSING) if isinstance(new_section, dict) else _MISSING
            status = _status_for(field in section, mapped_value, legacy_value)
            rows.append(_r(
                f"dotGuide.sections[{i}].{field}", legacy_value,
                f"body.dot_guide.sections[{i}].{field}", mapped_value, status,
                notes="" if i < len(new_sections) else "no matching converted section at this index",
            ))

    legacy_schemes = dot_guide.get("colorSchemes", [])
    new_schemes = get_path(converted, "body.dot_guide.color_schemes")
    new_schemes = new_schemes if isinstance(new_schemes, list) else []
    for i, scheme in enumerate(legacy_schemes):
        new_scheme = new_schemes[i] if i < len(new_schemes) else _MISSING
        for field in SCHEME_FIELDS:
            legacy_value = scheme.get(field, _MISSING)
            mapped_value = new_scheme.get(field, _MISSING) if isinstance(new_scheme, dict) else _MISSING
            status = _status_for(field in scheme, mapped_value, legacy_value)
            rows.append(_r(
                f"dotGuide.colorSchemes[{i}].{field}", legacy_value,
                f"body.dot_guide.color_schemes[{i}].{field}", mapped_value, status,
            ))

        legacy_mappings = scheme.get("mapping", [])
        new_mappings = new_scheme.get("mapping", []) if isinstance(new_scheme, dict) else []
        new_mappings = new_mappings if isinstance(new_mappings, list) else []
        for j, mapping in enumerate(legacy_mappings):
            new_mapping = new_mappings[j] if j < len(new_mappings) else _MISSING
            for field in SCHEME_MAPPING_FIELDS:
                legacy_value = mapping.get(field, _MISSING)
                mapped_value = new_mapping.get(field, _MISSING) if isinstance(new_mapping, dict) else _MISSING
                status = _status_for(field in mapping, mapped_value, legacy_value)
                rows.append(_r(
                    f"dotGuide.colorSchemes[{i}].mapping[{j}].{field}", legacy_value,
                    f"body.dot_guide.color_schemes[{i}].mapping[{j}].{field}", mapped_value, status,
                ))

    for target in NEW_FIELD_ONLY:
        mapped_value = get_path(converted, target)
        filled = mapped_value is not _MISSING and compact_repr(mapped_value) != ""
        rows.append(_r(
            _source_key(target), mapped_value, target, mapped_value,
            "NEW_FIELD", notes="" if filled else "empty — needs manual fill-in",
        ))

    # Any legacy top-level key not covered by SIMPLE_MAPPING/faqs/dotGuide at all.
    known_top_level = set(SIMPLE_MAPPING) | {"faqs", "dotGuide"}
    for key in raw:
        if key not in known_top_level:
            rows.append(_r(key, raw[key], "<no mapping defined>", _MISSING, "UNMAPPED"))

    return rows


def build_collection_rows(
    collection: dict, prod_root: Path | None = None, category: str = "cute", source_file: str = "",
) -> list[dict]:
    """Audit rows for the collection-level header/body object (e.g. the
    top-level "collection" key in content/en/puzzles-<category>.json). There
    is no legacy source for any of this — it's authored directly in the new
    schema — so every row is status=NEW_FIELD, same treatment as
    NEW_FIELD_ONLY for individual puzzles."""
    rows: list[dict] = []

    def _r(new_key: str, mapped_value: Any) -> dict:
        filled = mapped_value is not _MISSING and compact_repr(mapped_value) != ""
        legacy_key = f"{source_file}:collection.{new_key}" if source_file else "<none>"
        return _row(
            legacy_key, mapped_value, new_key, mapped_value, "NEW_FIELD",
            notes="" if filled else "empty — needs manual fill-in",
            prod_root=prod_root, category=category, lookup_key=f"collection.{new_key}",
        )

    for field in COLLECTION_FIELDS:
        mapped_value = get_path(collection, field)
        rows.append(_r(field, mapped_value))

    faqs = collection.get("body", {}).get("faqs", [])
    for i, faq in enumerate(faqs):
        for sub in ("q", "a"):
            rows.append(_r(f"body.faqs[{i}].{sub}", faq.get(sub, _MISSING)))

    breadcrumb_items = get_path(collection, "header.breadcrumb_json_ld.items")
    breadcrumb_items = breadcrumb_items if isinstance(breadcrumb_items, list) else []
    for i, item in enumerate(breadcrumb_items):
        for sub in ("position", "name", "path"):
            rows.append(_r(f"header.breadcrumb_json_ld.items[{i}].{sub}", item.get(sub, _MISSING)))

    return rows


def validate_legacy_key_coverage(raw: dict, rows: list[dict]) -> list[str]:
    """Assert every legacy key present in `raw` (recursively, including list-item
    keys) produced at least one audit row. Returns a list of problems (empty if clean)."""
    audited_keys: set[str] = set()
    for row in rows:
        key = row["legacy_key"]
        if key != "<none>":
            audited_keys.add(key.split("[")[0].split(".")[0])

    problems: list[str] = []
    top_level_expected = set(SIMPLE_MAPPING) | {"faqs", "dotGuide"}
    for key in raw:
        if key not in top_level_expected and key not in audited_keys:
            problems.append(f"legacy top-level key '{key}' has no audit row at all")

    dot_guide = raw.get("dotGuide", {})
    expected_dot_guide_keys = set(DOT_GUIDE_SIMPLE) | {"sections", "colorSchemes"}
    for key in dot_guide:
        if key not in expected_dot_guide_keys:
            problems.append(f"legacy dotGuide.{key} has no audit coverage (unknown sub-key)")

    return problems


def audit_entry(
    raw: dict, prod_root: Path | None = None, category: str = "cute", converted: dict | None = None,
    source_file: str = "",
) -> tuple[dict, list[dict], list[str]]:
    """Build audit rows + coverage-validation problems for one legacy entry.

    By default converts fresh via convert_entry() — this tests whether the
    MIGRATOR is correct. Pass `converted` (the entry as it actually exists in
    an already-migrated content file) to instead audit the REAL, possibly
    hand-edited, current state — e.g. after a manual fill-in for a
    NEW_FIELD like header.json_ld.image, so the audit table reflects reality
    instead of re-deriving a fresh blank value every run.

    `source_file` (e.g. "puzzles-cute.json") is recorded as the legacy_key
    for fields that have no true legacy source (NEW_FIELD rows like
    header.json_ld.* or body.faqs[]) so that column always points at where
    the value actually lives instead of an opaque "<none>".
    """
    if converted is None:
        converted = convert_entry(raw)
    rows = build_rows(raw, converted, prod_root=prod_root, category=category, source_file=source_file)
    problems = validate_legacy_key_coverage(raw, rows)
    return converted, rows, problems


def load_converted_entry(converted_json_path: Path, slug: str) -> dict | None:
    """Look up one entry by slug in an already-migrated (header/body schema)
    content file, e.g. generator/content/en/puzzles-cute.json."""
    data = json.loads(converted_json_path.read_text(encoding="utf-8-sig"))
    entries = data["puzzles"] if isinstance(data, dict) and isinstance(data.get("puzzles"), list) else data
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
    existing_columns = {row[1] for row in conn.execute("PRAGMA table_info(mapping_audit)")}
    if "where_used_in_page" not in existing_columns:
        conn.execute("ALTER TABLE mapping_audit ADD COLUMN where_used_in_page TEXT NOT NULL DEFAULT ''")
    if "usage_relevant" not in existing_columns:
        conn.execute("ALTER TABLE mapping_audit ADD COLUMN usage_relevant TEXT NOT NULL DEFAULT 'UNVERIFIED'")
    if "language" not in existing_columns:
        conn.execute("ALTER TABLE mapping_audit ADD COLUMN language TEXT NOT NULL DEFAULT 'en'")
    if "Legacy_value_by_key" not in existing_columns:
        if "legacy_value" in existing_columns:
            conn.execute("ALTER TABLE mapping_audit RENAME COLUMN legacy_value TO Legacy_value_by_key")
        else:
            conn.execute("ALTER TABLE mapping_audit ADD COLUMN Legacy_value_by_key TEXT")
    existing_columns = {row[1] for row in conn.execute("PRAGMA table_info(mapping_audit)")}
    if "new_value" not in existing_columns:
        if "mapped_value" in existing_columns:
            conn.execute("ALTER TABLE mapping_audit RENAME COLUMN mapped_value TO new_value")
        else:
            conn.execute("ALTER TABLE mapping_audit ADD COLUMN new_value TEXT")
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


def print_summary(slug: str, rows: list[dict], problems: list[str]) -> None:
    counts: dict[str, int] = {}
    relevance_counts: dict[str, int] = {}
    usage_relevance_counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
        relevance_counts[row["relevant"]] = relevance_counts.get(row["relevant"], 0) + 1
        usage_relevance_counts[row["usage_relevant"]] = usage_relevance_counts.get(row["usage_relevant"], 0) + 1
    print(
        f"{slug}: {len(rows)} rows | OK={counts.get('OK', 0)} "
        f"DROPPED={counts.get('DROPPED', 0)} MISMATCH={counts.get('MISMATCH', 0)} "
        f"UNMAPPED={counts.get('UNMAPPED', 0)} NEW_FIELD={counts.get('NEW_FIELD', 0)}"
    )
    print(
        f"  Column-3-vs-1&2 relevance: YES={relevance_counts.get('YES', 0)} "
        f"PARTIAL={relevance_counts.get('PARTIAL', 0)} NO={relevance_counts.get('NO', 0)}"
    )
    print(
        f"  where_used_in_page-vs-new_key relevance: YES={usage_relevance_counts.get('YES', 0)} "
        f"NO={usage_relevance_counts.get('NO', 0)} UNVERIFIED={usage_relevance_counts.get('UNVERIFIED', 0)}"
    )
    not_relevant = [r for r in rows if r["relevant"] != "YES"]
    if not_relevant:
        print(f"  ROWS WHERE MAPPED VALUE (col 3) DOES NOT LOOK RELEVANT TO COLS 1&2 ({len(not_relevant)}):")
        for r in not_relevant:
            print(f"    - [{r['relevant']}] {r['legacy_key']} -> {r['new_key']}: {r['notes']}")
    usage_not_relevant = [r for r in rows if r["usage_relevant"] != "YES"]
    if usage_not_relevant:
        print(f"  ROWS WHERE 'WHERE USED IN PAGE' DOESN'T LOOK RELEVANT TO new_key ({len(usage_not_relevant)}):")
        for r in usage_not_relevant:
            print(f"    - [{r['usage_relevant']}] {r['new_key']}: {r['where_used_in_page'][:120]}")
    not_read_in_prod = [r for r in rows if "NOT READ by prod" in r["where_used_in_page"]]
    if not_read_in_prod:
        print(f"  STORED BUT NOT READ AT RENDER TIME IN PROD ({len(not_read_in_prod)}) — safe to leave, but editing these won't change the live page:")
        for r in not_read_in_prod:
            print(f"    - {r['new_key']}")
    if problems:
        print(f"  COVERAGE PROBLEMS ({len(problems)}):")
        for problem in problems:
            print(f"    - {problem}")
    else:
        print("  Coverage OK: every legacy key produced an audit row.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("legacy_json_path", type=Path, help="Path to a legacy puzzles-*.json file (array of entries)")
    parser.add_argument("slug", nargs="?", help="Slug of the single puzzle entry to audit (omit with --all)")
    parser.add_argument("--all", action="store_true", help="Audit every entry in the file, not just one slug")
    parser.add_argument("--db", type=Path, default=None, help="SQLite output path (default: mapping_audit_<slug-or-all>.db next to this script)")
    parser.add_argument("--category", default="cute", help="prod category folder name under app/[locale]/, used for the where-used lookup and best-effort fallback search (default: cute)")
    parser.add_argument("--prod-root", type=Path, default=None, help="Path to the dot-to-dot-web repo, used for best-effort usage search when no manually-verified entry exists for a key")
    parser.add_argument("--converted-json-path", type=Path, default=None, help="Path to an already-migrated (header/body schema) content file, e.g. generator/content/en/puzzles-cute.json. When given, audits the REAL current state of each entry (including manual fixes) instead of re-deriving a fresh conversion from the legacy source every run. Also required to audit the collection-level header/body block, since it has no legacy source.")
    parser.add_argument("--language", default="en", help="Language/locale tag stored in the language column (default: en)")
    parser.add_argument("--no-collection", action="store_true", help="Skip auditing the collection-level header/body block even when --converted-json-path is given")
    args = parser.parse_args()

    if not args.all and not args.slug:
        parser.error("either provide a slug or pass --all")

    data = json.loads(args.legacy_json_path.read_text(encoding="utf-8-sig"))
    entries = data["puzzles"] if isinstance(data, dict) and isinstance(data.get("puzzles"), list) else data

    if args.all:
        targets = entries
    else:
        match = next((e for e in entries if e.get("slug") == args.slug), None)
        if match is None:
            print(f"Slug '{args.slug}' not found in {args.legacy_json_path}", file=sys.stderr)
            return 1
        targets = [match]

    db_path = args.db or Path(__file__).resolve().parent / f"mapping_audit_{args.slug if args.slug else 'all'}.db"
    # Reuse an existing db rather than recreating it from scratch — this file
    # may already hold audit rows for OTHER languages (e.g. 'en'), and a
    # blind unlink()/recreate would silently destroy them when re-running
    # this script for a different --language against the same category.
    conn = sqlite3.connect(db_path)
    ensure_schema(conn)
    slugs_to_clear = [raw.get("slug", "<no-slug>") for raw in targets]
    collection_slug = f"{args.category}-collection"
    if args.converted_json_path and not args.no_collection:
        slugs_to_clear.append(collection_slug)
    conn.executemany(
        "DELETE FROM mapping_audit WHERE puzzle_slug = ? AND language = ?",
        [(slug, args.language) for slug in slugs_to_clear],
    )
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
        converted, rows, problems = audit_entry(
            raw, prod_root=args.prod_root, category=args.category, converted=converted_override,
            source_file=source_file,
        )
        write_rows(conn, slug, rows, language=args.language)
        print_summary(slug, rows, problems)
        if problems or any(r["status"] in ("DROPPED", "MISMATCH") for r in rows):
            any_bad = True

    if args.converted_json_path and not args.no_collection:
        converted_data = json.loads(args.converted_json_path.read_text(encoding="utf-8-sig"))
        collection = converted_data.get("collection") if isinstance(converted_data, dict) else None
        if collection is None:
            print(f"NOTE: no top-level 'collection' key found in {args.converted_json_path}; skipping collection-level audit.")
        else:
            collection_rows = build_collection_rows(
                collection, prod_root=args.prod_root, category=args.category, source_file=source_file,
            )
            write_rows(conn, collection_slug, collection_rows, language=args.language)
            print_summary(collection_slug, collection_rows, [])

    conn.close()
    print(f"\nWrote {db_path}")
    return 1 if any_bad else 0


if __name__ == "__main__":
    sys.exit(main())
