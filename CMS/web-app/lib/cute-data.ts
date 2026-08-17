import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type CutePuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type CutePuzzleContent = {
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

export type CutePuzzle = CutePuzzleShell & Omit<CutePuzzleContent, 'slug'>;

export const cutePuzzleShells: CutePuzzleShell[] = [
  { slug: 'cute-puppy-dot-to-dot-puzzle', emoji: '🐶', age: 'Ages 5–9', dots: 70, difficulty: 2, image: '/images/cute-puppy-puzzle.webp', pdf: '/cute/cute-puppy-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-little-car-dot-to-dot-puzzle', emoji: '🚗', age: 'Ages 4–8', dots: 55, difficulty: 1, image: '/images/cute-little-car-puzzle.webp', pdf: '/cute/cute-little-car-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-lion-dot-to-dot-puzzle', emoji: '🦁', age: 'Ages 5–9', dots: 74, difficulty: 2, image: '/images/cute-lion-puzzle.webp', pdf: '/cute/cute-lion-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-butterfly-dot-to-dot-puzzle', emoji: '🦋', age: 'Ages 5–9', dots: 67, difficulty: 2, image: '/images/cute-butterfly-puzzle.webp', pdf: '/cute/cute-butterfly-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-rocket-ship-dot-to-dot-puzzle', emoji: '🚀', age: 'Ages 4–8', dots: 66, difficulty: 1, image: '/images/cute-rocket-ship-puzzle.webp', pdf: '/cute/cute-rocket-ship-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-baby-turtle-dot-to-dot-puzzle', emoji: '🐢', age: 'Ages 4–8', dots: 65, difficulty: 1, image: '/images/cute-baby-turtle-puzzle.webp', pdf: '/cute/cute-baby-turtle-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-owl-dot-to-dot-puzzle', emoji: '🦉', age: 'Ages 4–8', dots: 65, difficulty: 1, image: '/images/cute-owl-puzzle.webp', pdf: '/cute/cute-owl-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-crab-dot-to-dot-puzzle', emoji: '🦀', age: 'Ages 5–9', dots: 72, difficulty: 2, image: '/images/cute-crab-puzzle.webp', pdf: '/cute/cute-crab-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-baby-elephant-dot-to-dot-puzzle', emoji: '🐘', age: 'Ages 4–8', dots: 50, difficulty: 1, image: '/images/cute-baby-elephant-puzzle.webp', pdf: '/cute/cute-baby-elephant-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-happy-frog-dot-to-dot-puzzle', emoji: '🐸', age: 'Ages 6–10', dots: 82, difficulty: 2, image: '/images/cute-happy-frog-puzzle.webp', pdf: '/cute/cute-happy-frog-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'cute-princess-dot-to-dot-puzzle', emoji: '👸', age: 'Ages 4–8', dots: 57, difficulty: 1, image: '/images/cute-princess-puzzle.webp', pdf: '/cute/cute-princess-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadCuteContent(locale: string): CutePuzzleContent[] {
  const en = loadConvertedPuzzleContent('cute') as CutePuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-cute.json`) as CutePuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getCutePuzzlesForLocale(locale: string): CutePuzzle[] {
  const content = loadCuteContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return cutePuzzleShells
    .map((shell): CutePuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is CutePuzzle => Boolean(p));
}

export function getCutePuzzleBySlug(slug: string, locale: string): CutePuzzle | undefined {
  return getCutePuzzlesForLocale(locale).find((p) => p.slug === slug);
}
