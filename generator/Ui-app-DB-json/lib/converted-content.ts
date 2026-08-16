import { loadExternalCollection, type ExportPuzzleDocument } from './content-source';

type ConvertedPuzzle = ExportPuzzleDocument & {
  slug: string;
  header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image_alt?: string } };
  body?: { h1?: string; name?: string; tagline?: string; description?: string; fun_fact?: string; dot_guide?: unknown; faq?: unknown };
};

export function loadConvertedPuzzleContent(category: string) {
  const documents = (loadExternalCollection(category)?.puzzles ?? []) as ConvertedPuzzle[];
  return documents.map((document) => ({
    slug: document.slug,
    name: document.body?.name ?? document.slug,
    tagline: document.body?.tagline ?? '',
    description: document.body?.description ?? '',
    funFact: document.body?.fun_fact ?? '',
    dotGuide: normalizeDotGuide(document.body?.dot_guide),
    faq: document.body?.faq,
    seoTitle: document.header?.title,
    seoH1: document.body?.h1,
    seoDescription: document.header?.meta_description,
    seoOgTitle: document.header?.og?.title,
    seoOgDescription: document.header?.og?.description,
    seoImageAlt: document.header?.og?.image_alt,
  }));
}

function normalizeDotGuide(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const guide = value as Record<string, unknown>;
  return { ...guide, colorSchemes: guide.colorSchemes ?? guide.color_schemes };
}
