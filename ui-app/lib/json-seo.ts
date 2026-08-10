type JsonSeo = {
  homepage: { title: string; ogTitle: string; description: string };
  staticPages: Record<string, { title: string; description: string }>;
  collections: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string } | null>;
  imageAlt: { social: string; card: string; preview: string };
  puzzleFallback: { title: string; description: string };
};

function contentLocale(locale: string) {
  return ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
}

function load(locale: string): JsonSeo {
  return require(`../content/${contentLocale(locale)}/seo/metadata.json`) as JsonSeo;
}

function replace(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((value, [key, replacement]) => value.replaceAll(`{{${key}}}`, String(replacement)), template);
}

export const isArabic = (locale: string) => locale === 'ar' || locale.startsWith('ar-');
export const isSpanish = (locale: string) => locale === 'es' || locale.startsWith('es-');
export const isGerman = (locale: string) => locale === 'de' || locale.startsWith('de-');
export const isRussian = (locale: string) => locale === 'ru' || locale.startsWith('ru-');

export function localizedSiteSeo(locale: string) { return load(locale).homepage; }
export function localizedStaticSeo(locale: string, page: 'about' | 'contact' | 'search' | 'terms' | 'privacy' | 'blog') {
  const filenames = { about: 'about', contact: 'contact', terms: 'terms', privacy: 'privacy-policy' } as const;
  if (page === 'search' || page === 'blog') {
    const metadata = load(locale).staticPages[page];
    if (!metadata) throw new Error(`Missing required JSON SEO metadata for ${locale}/${page}`);
    return metadata;
  }
  const document = require(`../content/${contentLocale(locale)}/${filenames[page]}.json`) as { header?: { title?: string; meta_description?: string } };
  if (!document.header?.title || !document.header.meta_description) throw new Error(`Missing required JSON SEO metadata for ${locale}/${page}`);
  return { title: document.header.title, description: document.header.meta_description };
}
export function localizedCollectionSeo(locale: string, collection: string) { return load(locale).collections[collection] ?? null; }
export function collectionHeaderSeo(locale: string, collection: string) {
  const document = require(`../content/${contentLocale(locale)}/puzzles-${collection}.json`) as { collection?: { header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image?: string } } } };
  const header = document.collection?.header;
  if (!header?.title || !header.meta_description) throw new Error(`Missing required JSON collection SEO metadata for ${locale}/${collection}`);
  return { title: header.title, description: header.meta_description, ogTitle: header.og?.title ?? header.title, ogDescription: header.og?.description ?? header.meta_description, image: header.og?.image };
}
export function localizedSocialImageAlt(locale: string, fallback: string) { return replace(load(locale).imageAlt.social, { fallback }); }
export function localizedPuzzleCardAlt(locale: string, name: string) { return replace(load(locale).imageAlt.card, { name }); }
export function localizedPuzzlePreviewAlt(locale: string, name: string, dots?: number) { return replace(load(locale).imageAlt.preview, { name, dots: dots ?? '' }); }
export function puzzleImageAlt(locale: string, puzzle: { name: string; dots?: number; seoImageAlt?: string }, context: 'preview' | 'card') {
  return puzzle.seoImageAlt ?? (context === 'preview' ? localizedPuzzlePreviewAlt(locale, puzzle.name, puzzle.dots) : localizedPuzzleCardAlt(locale, puzzle.name));
}
export function localizedPuzzleTitle(locale: string, name: string) { return replace(load(locale).puzzleFallback.title, { name }); }
export function localizedPuzzleDescription(locale: string, puzzle: { name: string; age?: string; dots?: number }) {
  const [, min = '', max = ''] = puzzle.age?.match(/(\d+)\D+(\d+)/) ?? [];
  return replace(load(locale).puzzleFallback.description, { name: puzzle.name, min, max, dots: puzzle.dots ?? '' }).replaceAll('91', min).replaceAll('92', max).replaceAll('999', String(puzzle.dots ?? ''));
}
