// Generic rule for all locale puzzle content: never show an English-language
// puzzle page under a non-English locale path. A puzzle whose entry is
// entirely missing from a locale's content file is dropped for that locale —
// no static page, no sitemap entry, no listing — rather than silently mixing
// in English text. A partial translation (entry present but missing only
// some fields) is left to the strict i18n validator to catch as a real
// error, not skipped.
//
// dotGuide is additionally treated as required-when-present-in-English by
// default: an entry that exists but has its whole dotGuide block untranslated
// is also dropped, unless `allowMissingDotGuide` is set — needed for content
// types (e.g. Canada) that intentionally ship an older flat schema without
// dotGuide for some locales; see canada-data.ts.
export function mergeLocalizedPuzzles<T extends { slug: string; dotGuide?: unknown }>(
  en: T[],
  localeContent: Array<Partial<T> & { slug: string }>,
  options?: { allowMissingDotGuide?: boolean }
): T[] {
  const bySlug = new Map(localeContent.map((item) => [item.slug, item]));
  return en
    .map((base) => {
      const own = bySlug.get(base.slug);
      if (!own) return null;
      if (base.dotGuide && !own.dotGuide) {
        if (!options?.allowMissingDotGuide) return null;
        return { ...base, ...own, dotGuide: undefined };
      }
      return { ...base, ...own };
    })
    .filter((item): item is T => item !== null);
}
