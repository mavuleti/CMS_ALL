import fs from 'node:fs';
import path from 'node:path';

function exportDir(locale: string) {
  return path.resolve(process.cwd(), `../mapping-check/export/${locale}`);
}

export type ColorMapping = { range: string; part: string; color: string; hex?: string; why: string };
export type ColorScheme = { name: string; note?: string; mapping: ColorMapping[] };
export type GuideSection = { range: string; title: string; learn: string; fact: string };
export type Puzzle = {
  slug: string;
  header: any;
  body: any;
  name: string;
  h1: string;
  description: string;
  tagline: string;
  funFact: string;
  image?: string;
  pdf?: string;
  dots?: number;
  age?: string;
  difficulty: 1 | 2 | 3;
  sections: GuideSection[];
  colorSchemes: ColorScheme[];
};
export type Collection = { slug: string; header: any; body: any; puzzles: Puzzle[] };

function validObjectArray(value: unknown): any[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === 'object') ? value : [];
}

function numberFrom(...values: unknown[]) {
  for (const value of values) {
    const match = String(value ?? '').match(/\b(\d{2,3})[ -]dot/i);
    if (match) return Number(match[1]);
  }
}

function normalizePuzzle(document: any, collectionSlug: string): Puzzle {
  const body = document.body ?? {};
  const header = document.header ?? {};
  const guide = body.dot_guide ?? {};
  const dots = numberFrom(body.h1, header.title, body.description);
  const image = body.assets?.image ?? body.image ?? header.json_ld?.image ?? header.og?.image;
  const inferredPdf = typeof image === 'string'
    ? `/${collectionSlug}/${path.basename(image).replace(/-puzzle\.webp$/i, '-dot-to-dot-printable-horizontal.pdf')}`
    : undefined;
  return {
    slug: document.slug,
    header,
    body,
    name: body.name ?? document.slug,
    h1: body.h1 ?? body.name ?? document.slug,
    description: body.description ?? header.meta_description ?? '',
    tagline: body.tagline ?? '',
    funFact: body.fun_fact ?? '',
    image,
    pdf: body.assets?.pdf ?? body.pdf ?? inferredPdf,
    dots,
    age: body.age ?? header.json_ld?.age_range,
    difficulty: dots && dots > 120 ? 3 : dots && dots > 60 ? 2 : 1,
    sections: validObjectArray(guide.sections) as GuideSection[],
    colorSchemes: validObjectArray(guide.color_schemes ?? guide.colorSchemes) as ColorScheme[]
  };
}

function readCollection(filename: string, locale: string): Collection {
  const source = JSON.parse(fs.readFileSync(path.join(exportDir(locale), filename), 'utf8'));
  if (!source?.collection || !Array.isArray(source.puzzles)) throw new Error(`${filename} must contain collection and puzzles`);
  const body = source.collection.body ?? {};
  const fallbackSlug = filename.replace(/^puzzles-/, '').replace(/\.json$/, '');
  return {
    slug: body.slug ?? fallbackSlug,
    header: source.collection.header ?? {},
    body,
    puzzles: source.puzzles.map((puzzle: any) => normalizePuzzle(puzzle, body.slug ?? fallbackSlug))
  };
}

export function getCollections(locale: string = 'en'): Collection[] {
  const dir = exportDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((filename) => /^puzzles-.+\.json$/.test(filename))
    .sort()
    .map((filename) => readCollection(filename, locale));
}

export function getCollection(slug: string, locale: string = 'en') {
  return getCollections(locale).find((collection) => collection.slug === slug);
}

export function getPuzzle(category: string, slug: string, locale: string = 'en') {
  const collection = getCollection(category, locale);
  const puzzle = collection?.puzzles.find((item) => item.slug === slug);
  return collection && puzzle ? { collection, puzzle } : undefined;
}

export function getExportDocument(name: 'about' | 'contact' | 'privacy-policy' | 'terms' | 'blog', locale: string = 'en') {
  return JSON.parse(fs.readFileSync(path.join(exportDir(locale), `${name}.json`), 'utf8')) as any;
}

export function assetUrl(value?: string) {
  if (!value) return undefined;
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${value.startsWith('/') ? value : `/${value}`}`;
}
