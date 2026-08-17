import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type GardenPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type GardenPuzzleContent = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /**
   * Hand-written, unique per-puzzle SEO title (varied structure/tail across puzzles,
   * not one fixed template with just the name swapped in). Optional — falls back to
   * the templated localizedPuzzleTitle() when absent.
   */
  seoTitle?: string;
  seoH1?: string;
  /**
   * Hand-written, keyword-rich meta description for this specific puzzle (used for
   * <meta name="description"> and og:description). Optional — falls back to the
   * templated localizedPuzzleDescription() when absent. Deliberately NOT
   * template-generated: one shared sentence for every puzzle in a category reads as
   * thin/duplicate content to search engines, so this should be worded differently
   * per puzzle, not just {name}/{dots}/{age} swapped into one fixed sentence.
   */
  seoDescription?: string;
  /**
   * Hand-written alt text describing what's actually pictured (not just "{name} +
   * fixed phrase"). Optional — falls back to localizedPuzzlePreviewAlt/
   * localizedPuzzleCardAlt via puzzleImageAlt() when absent.
   */
  seoImageAlt?: string;
  /**
   * If this puzzle ever gets a second/third/etc. image (extra color-scheme preview,
   * gallery shot), add seoImageAlt2, seoImageAlt3, ... here — each its own unique,
   * keyword-rich sentence describing that specific image, never the same text reused
   * with a number tacked on. Looked up automatically by puzzleImageAlt(locale, puzzle,
   * context, imageIndex) in lib/localized-seo.ts.
   */
  [seoImageAltN: `seoImageAlt${number}`]: string | undefined;
  funFact: string;
  dotGuide?: DotGuide;
};

export type GardenPuzzle = GardenPuzzleShell & Omit<GardenPuzzleContent, 'slug'>;

export const gardenPuzzleShells: GardenPuzzleShell[] = [
  { slug: 'garden-gloves-dot-to-dot-puzzle', emoji: '🧤', age: 'Ages 4–8', dots: 54, difficulty: 1, image: '/images/garden-gloves-puzzle.webp', pdf: '/garden/garden-gloves-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'garden-trowel-dot-to-dot-puzzle', emoji: '🛠️', age: 'Ages 4–7', dots: 39, difficulty: 1, image: '/images/garden-trowel-puzzle.webp', pdf: '/garden/garden-trowel-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'wheelbarrow-playground-dot-to-dot-puzzle', emoji: '🛒', age: 'Ages 5–9', dots: 85, difficulty: 2, image: '/images/wheelbarrow-playground-puzzle.webp', pdf: '/garden/wheelbarrow-playground-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadGardenContent(locale: string): GardenPuzzleContent[] {
  const en = loadConvertedPuzzleContent('garden') as GardenPuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-garden.json`) as GardenPuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getGardenPuzzlesForLocale(locale: string): GardenPuzzle[] {
  const content = loadGardenContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return gardenPuzzleShells
    .map((shell): GardenPuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is GardenPuzzle => Boolean(p));
}

export function getGardenPuzzleBySlug(slug: string, locale: string): GardenPuzzle | undefined {
  return getGardenPuzzlesForLocale(locale).find((p) => p.slug === slug);
}
