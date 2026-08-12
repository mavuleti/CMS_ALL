import fs from 'node:fs';
import path from 'node:path';

export type ExportPuzzleDocument = {
  slug: string;
  header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image?: string; image_alt?: string } };
  body?: { h1?: string; name?: string; tagline?: string; description?: string; fun_fact?: string; dot_guide?: unknown; faq?: unknown; faqs?: unknown };
};

export type ExportCollectionDocument = {
  collection?: {
    header?: { title?: string; meta_description?: string; og?: { title?: string; description?: string; image?: string } };
    body?: { h1?: string; name?: string; tagline?: string; description?: string; hero_image?: string; slug?: string; faq?: unknown; faqs?: unknown };
  };
  puzzles?: ExportPuzzleDocument[];
};

function configuredContentDirectory() {
  const configured = process.env.DOT_TO_DOT_CONTENT_DIR?.trim();
  return path.resolve(process.cwd(), configured || '../mapping-check/export/en');
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
