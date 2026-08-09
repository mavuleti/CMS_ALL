// Single source of truth for "does this locale get a page for this section
// at all?" — used by generateStaticParams (so sections without content never
// get an English-fallback duplicate page), the CategoryGrid tile filter, and
// the sitemap generator. No hand-maintained per-locale lists and no
// editorial-exclusion branches: a locale gets a section if and only if
// content/<locale>/<section-file>.json exists and is non-empty. To hide a
// section for a locale (translated or not), remove/empty its content file —
// there is no other way to opt a locale out.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const DEFAULT_LOCALE = 'en';
export const ARABIC_REGIONAL_ALIASES = ['ar-AE', 'ar-SA', 'ar-QA'];

export const sectionFiles: Record<string, string> = {
  'dinosaurs/': 'puzzles-dinosaurs.json',
  'ocean/': 'puzzles-ocean.json',
  'playgrounds/': 'puzzles-playgrounds.json',
  'circus/': 'puzzles-circus.json',
  'garden/': 'puzzles-garden.json',
  'flowers/': 'puzzles-flowers.json',
  'cute/': 'puzzles-cute.json',
  'space/': 'puzzles-space.json',
  'usa-250/': 'puzzles-usa-250.json',
  'uae/': 'puzzles-uae.json',
  'canada/': 'puzzles-canada.json',
  'blog/': 'blog.json'
};

// ar-AE/ar-SA/ar-QA read content/ar/* until they have their own override
// files.
export function contentLocaleFor(locale: string): string {
  return ARABIC_REGIONAL_ALIASES.includes(locale) ? 'ar' : locale;
}

export function readSectionItems(locale: string, prefix: string): Array<{ slug: string; [key: string]: unknown }> {
  const file = sectionFiles[prefix];
  if (!file) return [];
  const p = path.join('content', locale, file);
  if (!existsSync(p)) return [];
  try {
    const data = JSON.parse(readFileSync(p, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// True only if `locale` has real, non-empty content for section `prefix`.
// No file, or an empty array, means no section — the content file is the
// only signal, for every reason a section might not apply to a locale
// (untranslated, or intentionally not written for that locale at all).
export function isSectionAvailable(locale: string, prefix: string): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return readSectionItems(contentLocaleFor(locale), prefix).length > 0;
}

/**
 * Mirrors the detail-page generation rule for one puzzle.
 *
 * Most puzzle sections require a localized dotGuide whenever the English
 * source has one. Canada intentionally permits its older flat content schema.
 */
export function isPuzzlePageAvailable(locale: string, prefix: string, slug: string): boolean {
  if (!isSectionAvailable(locale, prefix)) return false;

  const localizedItem = readSectionItems(contentLocaleFor(locale), prefix).find((item) => item.slug === slug);
  if (!localizedItem) return false;
  if (locale === DEFAULT_LOCALE || prefix === 'canada/') return true;

  const englishItem = readSectionItems(DEFAULT_LOCALE, prefix).find((item) => item.slug === slug);
  return !englishItem?.dotGuide || Boolean(localizedItem.dotGuide);
}

export function sectionLocales(prefix: string, allLocales: readonly string[]): string[] {
  return allLocales.filter((locale) => isSectionAvailable(locale, prefix));
}
