#!/usr/bin/env python3
"""
Single source of truth for which mapping_audit new_key paths are technical
identifiers (URLs, hex colors, schema.org constants, file paths, numeric
ranges, brand names) rather than translatable prose.

This list is the direct implementation of
TRANSLATE-MISSING-CONTENT-RULES.md §2 "Technical / non-translatable fields"
— every entry there was verified by diffing content/en/** against an
already-translated locale (content/ar/**, mostly) and confirming the field
is byte-identical across locales in real prod content today. Do not add to
this list without doing the same verification and updating §2 to match.

Used by:
  - migrate_add_i18n_required.py (one-time backfill of the i18nRequired
    column + value across every existing mapping_audit_*.db)
  - clone_en_to_language.py (every new language population run)
"""
import re

_INDEX_RE = re.compile(r"\[\d+\]")

# Normalized (index-stripped) new_key paths that are technical, not prose.
# i18nRequired = False for these; True for everything else.
TECHNICAL_NEW_KEYS = frozenset({
    # Routing identifiers — identical across every locale, verified by
    # diffing content/en vs content/ar puzzle/blog slugs.
    "slug",
    "body.slug",

    # Design tokens inside dot-guide color schemes / step ranges — numeric
    # or hex, not language content.
    "body.dot_guide.color_schemes[].mapping[].hex",
    "body.dot_guide.color_schemes[].mapping[].range",
    "body.dot_guide.sections[].range",

    # Numeric / file-path fields.
    "header.json_ld.age_range",
    "header.json_ld.image",
    "body.hero_image",
    "header.og.image",
    "header.json_ld.organization.logo",

    # schema.org vocabulary constants — part of the JSON-LD spec, changing
    # them breaks structured data rather than localizing it.
    "header.json_ld.type",
    "header.json_ld.website.type",
    "header.json_ld.organization.type",
    "header.json_ld.collection_page.type",
    "header.json_ld.item_list.type",
    "header.breadcrumb_json_ld.type",
    "header.json_ld.main_entity.type",
    "header.json_ld.main_entity.item_source",  # verified value: "puzzles" — a data-source key, not prose

    # Literal URLs / paths, not prose.
    "header.json_ld.organization.same_as",
    "header.canonical",
    "header.og.url",
    "header.manifest",
    "header.breadcrumb_json_ld.items[].path",
    "header.breadcrumb_json_ld.items[].position",  # numeric ("1", "2", ...)
    "body.related_links[].href",  # internal site path, identical across locales

    # Constants / brand name, identical in every locale by design.
    "header.twitter.card",
    "header.og.site_name",
    "header.json_ld.website.name",

    # home.json's body.downloadButton block — verified 2026-08-16: this is an
    # orphaned duplicate of common.json's (English-only, un-translated by
    # design) downloadButton namespace. i18n/request.ts always merges
    # localizedHome.body on TOP of the correct English common.json base, so
    # any translated copy here silently overrides the working English
    # fallback. Found broken in prod for 15 locales: translators translated
    # the ICU variable NAME itself (e.g. Thai "{ขนาด}", German "{Größe}")
    # instead of leaving it as the "{size}" the code actually passes
    # (components/DownloadButton.tsx: t("alternateLink", { size: ... })),
    # crashing next-intl's formatter on every render. Forced to English
    # verbatim, not translated, until this duplicate block is removed
    # entirely from home.json in favor of common.json's copy.
    "body.downloadButton.label",
    "body.downloadButton.usage",
    "body.downloadButton.paperNote",
    "body.downloadButton.paperLetter",
    "body.downloadButton.paperA4",
    "body.downloadButton.alternateLink",
    "body.downloadButton.downloadSize",

    # Out-of-scope shell fields (blog) — informational rows, never real
    # per-language content to begin with.
    "(prod-only) articleImage",
    "(prod-only) publishedAt",
    "(prod-only) updatedAt",

    # Dead schema — verified 2026-08-14 that dot-to-dot-web's actual
    # homepage (components/HomeDiscovery.tsx) reads useTranslations('homepageUi')
    # and useTranslations('puzzleSearch') from content/<locale>/messages.json,
    # not these body.hero.* keys. Grepped app/ and lib/ for "hero." and found
    # no reference outside an unrelated rtl-preview page. Not translatable
    # prose in any live path — excluded rather than left as a false "gap".
    "body.hero.badge",
    "body.hero.browsePuzzles",
    "body.hero.description",
    "body.hero.h1",
    "body.hero.starterPack",
    "body.hero.stat1Label",
    "body.hero.stat1Value",
    "body.hero.stat2Label",
    "body.hero.stat2Value",
    "body.hero.stat3Label",
    "body.hero.stat3Value",
})


def normalize_new_key(new_key: str) -> str:
    return _INDEX_RE.sub("[]", new_key)


def is_i18n_required(new_key: str) -> bool:
    """True = must be genuinely translated per language (the default).
    False = technical field; correct value is the English value, verbatim,
    in every language."""
    return normalize_new_key(new_key) not in TECHNICAL_NEW_KEYS
