// Single source of truth for "does locale X really have a translated page at
// path Y, or would a visitor land on English content instead?" Consumed
// directly by scripts/generate-sitemap.mjs to decide which URLs/hreflang
// alternates to emit. Section-level gating (is this whole section built for
// this locale at all) is delegated to lib/section-locales.ts, which the app
// (generateStaticParams, CategoryGrid) also reads, so there is exactly one
// place that decides "does locale X get section Y."

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { routing } from '../../i18n/routing.ts';
import {
  DEFAULT_LOCALE,
  ARABIC_REGIONAL_ALIASES,
  sectionFiles,
  contentLocaleFor,
  isSectionAvailable
} from '../../lib/section-locales.ts';

export { DEFAULT_LOCALE, ARABIC_REGIONAL_ALIASES, sectionFiles };
export const sectionFilesList = Object.values(sectionFiles);

export const staticPaths = ['', 'search/', 'dinosaurs/', 'ocean/', 'playgrounds/', 'garden/', 'flowers/', 'cute/', 'usa-250/', 'uae/', 'canada/', 'blog/', 'about/', 'contact/', 'privacy-policy/', 'terms/'];

// A section file is either a bare array of items, or (for sections mid-
// migration to the {collection, puzzles} envelope shape, e.g. circus/cute/
// flowers) an object with a `puzzles` array — normalize both to a plain
// array so callers never need to know which shape is on disk.
export function sectionItemsArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.puzzles)) return data.puzzles;
  return [];
}

function readSectionItems(locale, file) {
  const p = path.join('content', locale, file);
  if (!existsSync(p)) return [];
  return sectionItemsArray(JSON.parse(readFileSync(p, 'utf8')));
}

function sectionExcludedReason(locale, prefix) {
  return isSectionAvailable(locale, prefix) ? null : 'section-excluded';
}

// Builds the full catalog of localizable paths (from English content, which
// is always the canonical/complete set) plus, for every routed locale, the
// availability status of each one.
//
// Returns:
//   locales: every locale in i18n/routing.ts
//   pages: [{ path, category }] — category is 'static', 'blog', or a section prefix
//   statusFor(locale, path) -> { status: 'available' | 'missing', reason?, fallback? }
export function computeAvailability() {
  const locales = [...routing.locales];

  const enBySection = {};
  for (const [prefix, file] of Object.entries(sectionFiles)) {
    enBySection[prefix] = readSectionItems(DEFAULT_LOCALE, file);
  }

  const pages = [
    ...staticPaths.map((p) => ({ path: p, category: p === '' ? 'home' : 'static' })),
    ...Object.entries(sectionFiles).flatMap(([prefix, file]) =>
      prefix === 'blog/'
        ? enBySection[prefix].map((item) => ({ path: `blog/${item.slug}/`, category: 'blog' }))
        : enBySection[prefix].map((item) => ({ path: `${prefix}${item.slug}/`, category: prefix }))
    )
  ];

  // Cache per-(locale,section) slug -> item lookups instead of re-reading/
  // re-parsing JSON for every page.
  const localeSectionCache = new Map();
  function localeSectionItems(locale, file) {
    const contentLocale = contentLocaleFor(locale);
    const key = `${contentLocale}::${file}`;
    if (!localeSectionCache.has(key)) {
      const items = readSectionItems(contentLocale, file);
      localeSectionCache.set(key, new Map(items.map((item) => [item.slug, item])));
    }
    return localeSectionCache.get(key);
  }

  function statusFor(locale, pagePath) {
    if (locale === DEFAULT_LOCALE) return { status: 'available' };

    // Which section prefix (if any) this path belongs to.
    const prefix = Object.keys(sectionFiles).find((p) => p !== 'blog/' && pagePath.startsWith(p));
    const isBlog = pagePath.startsWith('blog/') && pagePath !== 'blog/';

    // Section-level exclusion applies to both the category listing page
    // itself (pagePath === prefix) and every puzzle under it.
    if (prefix) {
      const reason = sectionExcludedReason(locale, prefix);
      if (reason) return { status: 'missing', reason };
    }

    if (isBlog) {
      const slug = pagePath.slice('blog/'.length, -1);
      const items = localeSectionItems(locale, sectionFiles['blog/']);
      const own = items.get(slug);
      if (!own) return { status: 'missing', reason: 'entry-missing', fallback: DEFAULT_LOCALE };
      return { status: 'available' };
    }

    if (prefix) {
      const slug = pagePath.slice(prefix.length, -1);
      if (slug === '') return { status: 'available' }; // category listing page itself
      const enItem = enBySection[prefix].find((item) => item.slug === slug);
      const items = localeSectionItems(locale, sectionFiles[prefix]);
      const own = items.get(slug);
      if (!own) return { status: 'missing', reason: 'entry-missing', fallback: DEFAULT_LOCALE };
      if (enItem?.dotGuide && !own.dotGuide) {
        return { status: 'missing', reason: 'guide-untranslated', fallback: DEFAULT_LOCALE };
      }
      return { status: 'available' };
    }

    // Plain static page (home, about, search, ...): available as long as the
    // locale isn't a placeholder (checked above).
    return { status: 'available' };
  }

  return { locales, pages, statusFor };
}

// Slugs present in a locale's content file but absent from the English
// (canonical) file — usually a typo or a stale entry left over from a
// rename. Not fatal, but worth surfacing so it can be fixed or removed.
export function findOrphanSlugs() {
  const orphans = [];
  const contentDirs = readdirSync('content').filter((d) => d !== DEFAULT_LOCALE);
  for (const locale of contentDirs) {
    for (const [prefix, file] of Object.entries(sectionFiles)) {
      const enSlugs = new Set(readSectionItems(DEFAULT_LOCALE, file).map((item) => item.slug));
      for (const item of readSectionItems(locale, file)) {
        if (!enSlugs.has(item.slug)) orphans.push({ locale, file, slug: item.slug });
      }
    }
  }
  return orphans;
}
