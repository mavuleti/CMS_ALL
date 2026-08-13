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
    const match = String(value ?? '').match(/\b(\d{2,3})\s*(?:[ -]?dots?\b|نقطة)/iu);
    if (match) return Number(match[1]);
  }
}

// Some puzzle image assets don't follow the standard `${slug}-puzzle.webp`
// naming convention. Map those slugs to their actual filenames explicitly.
const puzzleImageOverrides: Record<string, string> = {
  'ostriches-dinosaur-dot-to-dot-puzzle': 'ostriches-puzzle.webp',
  spinosaurus: 'spinosaurus-74-puzzle.webp',
  'flax-flower-dot-to-dot-puzzle': 'flower-flax-flower-puzzle.webp',
  'nasturtium-flower-dot-to-dot-puzzle': 'flower-nasturtium-puzzle.webp',
  'snowdrop-flower-dot-to-dot-puzzle': 'flower-snowdrop-puzzle.webp',
  'buttercup-flower-dot-to-dot-puzzle': 'flower-buttercup-puzzle.webp',
  'camellia-flower-dot-to-dot-puzzle': 'flower-camellia-puzzle.webp',
  'forget-me-not-flower-dot-to-dot-puzzle': 'flower-forget-me-not-puzzle.webp',
  'geranium-flower-dot-to-dot-puzzle': 'flower-geranium-puzzle.webp',
  'jasmine-flower-dot-to-dot-puzzle': 'flower-jasmine-puzzle.webp',
  'periwinkle-flower-dot-to-dot-puzzle': 'flower-periwinkle-puzzle.webp',
  'petunia-flower-dot-to-dot-puzzle': 'flower-petunia-puzzle.webp',
  'plumeria-flower-dot-to-dot-puzzle': 'flower-plumeria-puzzle.webp',
  'carnation-flower-dot-to-dot-puzzle': 'flower-carnation-puzzle.webp',
  'six-petal-lily-dot-to-dot-puzzle': 'flower-six-petal-lily-puzzle.webp',
  'peony-flower-dot-to-dot-puzzle': 'flower-peony-puzzle.webp',
  'orchid-flower-dot-to-dot-puzzle': 'flower-orchid-puzzle.webp',
  'lotus-flower-dot-to-dot-puzzle': 'flower-lotus-puzzle.webp',
  'rose-flower-dot-to-dot-puzzle': 'flower-rose-puzzle.webp',
  'tulip-flower-dot-to-dot-puzzle': 'flower-tulip-puzzle.webp',
  'poppy-flower-dot-to-dot-puzzle': 'flower-poppy-puzzle.webp',
  'kawaii-sunflower-dot-to-dot-puzzle': 'flower-kawaii-sunflower-puzzle.webp',
  'crescent-moon-dot-to-dot-puzzle': 'space-crescent-moon-puzzle.webp',
  'ringed-planet-dot-to-dot-puzzle': 'space-ringed-planet-puzzle.webp',
};

function inferredPuzzleImage(slug: string) {
  if (puzzleImageOverrides[slug] && fs.existsSync(path.join(process.cwd(), 'public', 'images', puzzleImageOverrides[slug]))) {
    return `/images/${puzzleImageOverrides[slug]}`;
  }

  const basename = slug.replace(/-dot-to-dot-puzzle$/, '');
  const playgroundCore = basename.replace(/-playgrounds?$/, '');
  const candidates = [
    `${basename}-puzzle.webp`,
    `playgrounds-${playgroundCore}-puzzle.webp`,
    `playground-${playgroundCore}-puzzle.webp`,
  ];

  const filename = candidates.find((candidate) =>
    fs.existsSync(path.join(process.cwd(), 'public', 'images', candidate))
  );
  return filename ? `/images/${filename}` : undefined;
}

function normalizePuzzle(document: any, collectionSlug: string): Puzzle {
  const body = document.body ?? {};
  const header = document.header ?? {};
  const guide = body.dot_guide ?? {};
  const dots = numberFrom(body.h1, header.title, body.description);
  const image = body.assets?.image
    ?? body.image
    ?? header.json_ld?.image
    ?? header.og?.image
    ?? inferredPuzzleImage(document.slug);
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

export function getHomeExport(locale: string = 'en') {
  return JSON.parse(fs.readFileSync(path.join(exportDir(locale), 'home.json'), 'utf8')) as any;
}

export function getFeaturedPuzzleSlugs(locale: string = 'en'): string[] {
  const value = getHomeExport(locale).body?.config?.featured_puzzle_slugs;
  if (typeof value !== 'string') throw new Error(`Missing featured puzzle configuration for ${locale}`);
  const slugs = JSON.parse(value);
  if (!Array.isArray(slugs) || !slugs.every((slug) => typeof slug === 'string')) {
    throw new Error(`Invalid featured puzzle configuration for ${locale}`);
  }
  return slugs;
}

export function assetUrl(value?: string) {
  if (!value) return undefined;
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${value.startsWith('/') ? value : `/${value}`}`;
}
