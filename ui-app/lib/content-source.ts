import fs from 'node:fs';
import path from 'node:path';

export type ExportPuzzleJsonLd = { type: string; name?: string; description?: string; image?: string; educational_use?: string; age_range?: string };
export type ExportCollectionJsonLd = { type: string; name?: string; description?: string; image?: string; main_entity?: { type: string; item_source?: string } };
export type ExportBreadcrumbJsonLd = { type: string; items: { position: number; name: string; path: string }[] };
export type ExportFaq = { q: string; a: string };

export type ExportPuzzleDocument = {
  slug: string;
  header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image?: string; image_alt?: string }; json_ld?: ExportPuzzleJsonLd };
  body?: { h1?: string; name?: string; tagline?: string; description?: string; fun_fact?: string; dot_guide?: unknown; faqs?: ExportFaq[] };
};

export type ExportCollectionDocument = {
  collection?: {
    header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image?: string }; json_ld?: ExportCollectionJsonLd; breadcrumb_json_ld?: ExportBreadcrumbJsonLd };
    body?: { h1?: string; name?: string; tagline?: string; description?: string; hero_image?: string; slug?: string; faqs?: ExportFaq[] };
  };
  puzzles?: ExportPuzzleDocument[];
};

function configuredContentDirectory() {
  const configured = process.env.DOT_TO_DOT_CONTENT_DIR?.trim();
  return configured ? path.resolve(process.cwd(), configured) : undefined;
}

/** Read an optional build-time export in envelope or legacy array format. */
export function loadExternalCollection(category: string): ExportCollectionDocument | undefined {
  const directory = configuredContentDirectory();
  if (!directory) return undefined;
  const filename = path.join(directory, `puzzles-${category}.json`);
  if (!fs.existsSync(filename)) return undefined;
  const parsed: unknown = JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (Array.isArray(parsed)) return { puzzles: parsed as ExportPuzzleDocument[] };
  if (parsed && typeof parsed === 'object') return parsed as ExportCollectionDocument;
  throw new Error(`Invalid content export: ${filename}`);
}
