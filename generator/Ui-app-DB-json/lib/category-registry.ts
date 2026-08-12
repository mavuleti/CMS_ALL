import { routing } from '@/i18n/routing';
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
  _puzzles: CommonPuzzle[];
};

// The mapping_audit DBs never captured collection-level (category page)
// copy — only per-puzzle fields — so collection.body/header from the export
// is consistently empty across every locale, including en. This turns a
// bare slug like "cute" into "Cute" as a last-resort readable name/h1; it is
// not translated copy, just a fallback so pages aren't blank/raw-slugged
// until real collection copy exists in the DB.
function titleCaseSlug(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

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

// Built once per known locale at module load, keyed by [locale][categorySlug]
// — each locale reads its own export/<locale> directory, so a locale that's
// missing a category (or the whole export dir) just yields no puzzles for
// it, handled by isAvailable() below.
const categoriesByLocale: Record<string, Record<string, CategoryConfig>> = {};
for (const locale of routing.locales) {
  categoriesByLocale[locale] = Object.fromEntries(getCollections(locale).map((collection) => {
    const puzzles = collection.puzzles.map(toCommonPuzzle);
    const fallbackName = titleCaseSlug(collection.slug);
    const config: CategoryConfig = {
      slug: collection.slug,
      name: collection.body.name ?? fallbackName,
      h1: collection.body.h1 ?? collection.body.name ?? fallbackName,
      description: collection.body.description ?? '',
      whyH2: collection.body.tagline ?? collection.body.name ?? fallbackName,
      whyP: collection.body.description ?? '',
      header: collection.header,
      body: collection.body,
      faqs: Array.isArray(collection.body.faqs) ? collection.body.faqs : [],
      getPuzzles: (loc) => categoriesByLocale[loc]?.[collection.slug]?._puzzles ?? [],
      getPuzzle: (slug, loc) => categoriesByLocale[loc]?.[collection.slug]?._puzzles.find((puzzle) => puzzle.slug === slug),
      isAvailable: (loc) => Boolean(categoriesByLocale[loc]?.[collection.slug]?._puzzles.length),
      _puzzles: puzzles
    };
    return [collection.slug, config];
  }));
}

// English defines which categories exist at all; other locales expose the
// same slug set (via `en`'s config as the shared shape/fallback body/header)
// but resolve their own puzzles/availability from their own export data.
export const categories: Record<string, CategoryConfig> = categoriesByLocale.en ?? {};

export function getCategory(category: string) { return categories[category]; }
