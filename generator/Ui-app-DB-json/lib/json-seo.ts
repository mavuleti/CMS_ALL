import { getCollection, getCollections, getExportDocument } from './export-content';

function replace(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((value, [key, replacement]) => value.replaceAll(`{{${key}}}`, String(replacement)), template);
}

export const isArabic = (locale: string) => locale === 'ar' || locale.startsWith('ar-');
export const isSpanish = (locale: string) => locale === 'es' || locale.startsWith('es-');
export const isGerman = (locale: string) => locale === 'de' || locale.startsWith('de-');
export const isRussian = (locale: string) => locale === 'ru' || locale.startsWith('ru-');

export function localizedSiteSeo(_locale: string) {
  const collections = getCollections();
  const description = collections.map((item) => item.body.description).filter(Boolean).slice(0, 2).join(' ');
  return { title: 'Free Dot-to-Dot Printables for Kids', ogTitle: 'Free Dot-to-Dot Printables for Kids', description };
}
export function localizedStaticSeo(locale: string, page: 'about' | 'contact' | 'search' | 'terms' | 'privacy' | 'blog') {
  if (page === 'search') return { title: 'Search Dot-to-Dot Puzzles', description: 'Search free printable dot-to-dot puzzles.' };
  const filenames = { about: 'about', contact: 'contact', terms: 'terms', privacy: 'privacy-policy', blog: 'blog' } as const;
  const document = getExportDocument(filenames[page]);
  if (!document.header?.title || !document.header.meta_description) throw new Error(`Missing required JSON SEO metadata for ${locale}/${page}`);
  return { title: document.header.title, description: document.header.meta_description };
}
export function localizedCollectionSeo(_locale: string, collection: string) {
  const header = getCollection(collection)?.header;
  return header ? { title: header.title, description: header.meta_description, ogTitle: header.og?.title ?? header.title, ogDescription: header.og?.description ?? header.meta_description } : null;
}
export function collectionHeaderSeo(locale: string, collection: string) {
  const header = getCollection(collection)?.header;
  if (!header?.title || !header.meta_description) throw new Error(`Missing required JSON collection SEO metadata for ${locale}/${collection}`);
  return { title: header.title, description: header.meta_description, ogTitle: header.og?.title ?? header.title, ogDescription: header.og?.description ?? header.meta_description, image: header.og?.image };
}
export function collectionBodyContent(locale: string, collection: string) {
  return getCollection(collection)?.body as { h1?: string; name?: string; tagline?: string; description?: string; hero_image?: string } | undefined;
}
export function localizedSocialImageAlt(_locale: string, fallback: string) { return fallback; }
export function localizedPuzzleCardAlt(_locale: string, name: string) { return `${name} dot-to-dot printable`; }
export function localizedPuzzlePreviewAlt(_locale: string, name: string, dots?: number) { return `${name}${dots ? ` ${dots}-dot` : ''} printable puzzle`; }
export function puzzleImageAlt(locale: string, puzzle: { name: string; dots?: number; seoImageAlt?: string }, context: 'preview' | 'card') {
  return puzzle.seoImageAlt ?? (context === 'preview' ? localizedPuzzlePreviewAlt(locale, puzzle.name, puzzle.dots) : localizedPuzzleCardAlt(locale, puzzle.name));
}
export function localizedPuzzleTitle(_locale: string, name: string) { return `${name} Dot-to-Dot Printable`; }
export function localizedPuzzleDescription(locale: string, puzzle: { name: string; age?: string; dots?: number }) {
  const [, min = '', max = ''] = puzzle.age?.match(/(\d+)\D+(\d+)/) ?? [];
  return `Free printable ${puzzle.name} dot-to-dot puzzle${puzzle.dots ? ` with ${puzzle.dots} dots` : ''}${min ? ` for ages ${min}-${max}` : ''}.`;
}
