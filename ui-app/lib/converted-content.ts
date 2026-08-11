import { loadExternalCollection, type ExportPuzzleDocument } from './content-source';

type ConvertedPuzzle = ExportPuzzleDocument;

export function loadConvertedPuzzleContent(category: string) {
  const bundled = require(`../content/en/converted/puzzles-${category}.json`) as ConvertedPuzzle[];
  const exported = loadExternalCollection(category)?.puzzles;
  const exportedBySlug = new Map(exported?.map((document) => [document.slug, document]));
  const documents = bundled.map((document) => mergeExportValue(document, exportedBySlug.get(document.slug)) as ConvertedPuzzle);
  return documents.map((document) => ({
    slug: document.slug,
    name: document.body?.name ?? document.slug,
    tagline: document.body?.tagline ?? '',
    description: document.body?.description ?? '',
    funFact: document.body?.fun_fact ?? '',
    dotGuide: normalizeDotGuide(document.body?.dot_guide),
    faqs: document.body?.faqs,
    jsonLd: document.header?.json_ld,
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

function mergeExportValue(base: unknown, exported: unknown): unknown {
  if (exported == null || (typeof exported === 'string' && !exported.trim())) return base;
  if (Array.isArray(exported)) {
    // Auditing exports can contain PowerShell display strings such as
    // "@{q=...}". Keep the valid bundled structure in that case.
    return exported.every((item) => item && typeof item === 'object') ? exported : base;
  }
  if (typeof exported === 'object') {
    const baseObject = base && typeof base === 'object' && !Array.isArray(base) ? base as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(exported as Record<string, unknown>).map(([key, value]) => [
      key,
      mergeExportValue(baseObject[key], value)
    ]).concat(Object.entries(baseObject).filter(([key]) => !(key in (exported as Record<string, unknown>)))));
  }
  return exported;
}
