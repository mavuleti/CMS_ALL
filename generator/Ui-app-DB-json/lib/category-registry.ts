import { getCollections, type Puzzle as ExportPuzzle } from './export-content';

export type CommonPuzzle = {
  slug: string; name: string; tagline: string; description: string; funFact: string;
  age: string; dots: number; difficulty: 1 | 2 | 3; image: string; pdf: string;
  isNew?: boolean; seoTitle?: string; seoH1?: string; seoDescription?: string; seoOgTitle?: string; seoOgDescription?: string; seoImageAlt?: string;
  dotGuide?: any; faqs?: any[]; header?: any;
};

export type CategoryConfig = {
  slug: string; name: string; h1: string; description: string; whyH2: string; whyP: string;
  header: any; body: any; faqs: any[];
  getPuzzles(locale: string): CommonPuzzle[];
  getPuzzle(slug: string, locale: string): CommonPuzzle | undefined;
  isAvailable(locale: string): boolean;
};

function toCommonPuzzle(puzzle: ExportPuzzle): CommonPuzzle {
  return {
    slug: puzzle.slug,
    name: puzzle.name,
    tagline: puzzle.tagline,
    description: puzzle.description,
    funFact: puzzle.funFact,
    age: puzzle.age ?? '',
    dots: puzzle.dots ?? 0,
    difficulty: puzzle.difficulty,
    image: puzzle.image ?? '',
    pdf: puzzle.pdf ?? '',
    seoTitle: puzzle.header?.title,
    seoH1: puzzle.body?.h1,
    seoDescription: puzzle.header?.meta_description,
    seoOgTitle: puzzle.header?.og?.title,
    seoOgDescription: puzzle.header?.og?.description,
    seoImageAlt: puzzle.header?.og?.image_alt,
    dotGuide: { ...(puzzle.body?.dot_guide ?? {}), sections: puzzle.sections, colorSchemes: puzzle.colorSchemes },
    faqs: Array.isArray(puzzle.body?.faqs) ? puzzle.body.faqs : [],
    header: puzzle.header
  };
}

export const categories: Record<string, CategoryConfig> = Object.fromEntries(getCollections().map((collection) => {
  const puzzles = collection.puzzles.map(toCommonPuzzle);
  const config: CategoryConfig = {
    slug: collection.slug,
    name: collection.body.name ?? collection.slug,
    h1: collection.body.h1 ?? collection.body.name ?? collection.slug,
    description: collection.body.description ?? '',
    whyH2: collection.body.tagline ?? collection.body.name ?? collection.slug,
    whyP: collection.body.description ?? '',
    header: collection.header,
    body: collection.body,
    faqs: Array.isArray(collection.body.faqs) ? collection.body.faqs : [],
    getPuzzles: (locale) => locale === 'en' ? puzzles : [],
    getPuzzle: (slug, locale) => locale === 'en' ? puzzles.find((puzzle) => puzzle.slug === slug) : undefined,
    isAvailable: (locale) => locale === 'en'
  };
  return [collection.slug, config];
}));

export function getCategory(category: string) { return categories[category]; }
