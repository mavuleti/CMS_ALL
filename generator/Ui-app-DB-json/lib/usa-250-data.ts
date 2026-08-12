import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
import { isSectionAvailable, contentLocaleFor } from './section-locales';
export type { DotGuide };

export type Usa250PuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type Usa250PuzzleContent = {
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

export type Usa250Puzzle = Usa250PuzzleShell & Omit<Usa250PuzzleContent, 'slug'>;

export const usa250PuzzleShells: Usa250PuzzleShell[] = [
  { slug: 'gas-balloon-usa-250-dot-to-dot-puzzle', emoji: '🎈', age: 'Ages 4–7', dots: 48, difficulty: 1, image: '/images/gas-balloon-usa-250-puzzle.webp', pdf: '/usa-250/gas-balloon-usa-250-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'eagle-kite-banner-usa-250-dot-to-dot-puzzle', emoji: '🦅', age: 'Ages 5–9', dots: 80, difficulty: 1, image: '/images/eagle-kite-banner-usa-250-puzzle.webp', pdf: '/usa-250/eagle-kite-banner-usa-250-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'america-250-birthday-fireworks-dot-to-dot-puzzle', emoji: '🎆', age: 'Ages 6–10', dots: 90, difficulty: 1, image: '/images/america-250-birthday-fireworks-puzzle.webp', pdf: '/usa-250/america-250-birthday-fireworks-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'america-250-anniversary-liberty-bell-wings-1776-dot-to-dot-puzzle', emoji: '🔔', age: 'Ages 4–8', dots: 64, difficulty: 1, image: '/images/america-250-anniversary-liberty-bell-wings-1776-puzzle.webp', pdf: '/usa-250/america-250-anniversary-liberty-bell-wings-1776-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'usa-250-birthday-cake-dot-to-dot-puzzle', emoji: '🎂', age: 'Ages 4–8', dots: 56, difficulty: 1, image: '/images/usa-250-birthday-cake-puzzle.webp', pdf: '/usa-250/usa-250-birthday-cake-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'usa-250-astronaut-dot-to-dot-puzzle', emoji: '🚀', age: 'Ages 4–8', dots: 63, difficulty: 1, image: '/images/usa-250-astronaut-puzzle.webp', pdf: '/usa-250/usa-250-astronaut-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'usa-250-anniversary-airplane-banner-dot-to-dot-puzzle', emoji: '✈️', age: 'Ages 4–8', dots: 54, difficulty: 1, image: '/images/usa-250-anniversary-airplane-banner-puzzle.webp', pdf: '/usa-250/usa-250-anniversary-airplane-banner-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'usa-250-space-shuttle-dot-to-dot-puzzle', emoji: '🛸', age: 'Ages 4–8', dots: 50, difficulty: 1, image: '/images/usa-250-space-shuttle-puzzle.webp', pdf: '/usa-250/usa-250-space-shuttle-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'usa-250-anniversary-sports-kids-podium-dot-to-dot-puzzle', emoji: '🏆', age: 'Ages 6–10', dots: 124, difficulty: 2, image: '/images/usa-250-anniversary-sports-kids-podium-puzzle.webp', pdf: '/usa-250/usa-250-anniversary-sports-kids-podium-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'usa-250-birthday-balloons-stars-dot-to-dot-puzzle', emoji: '🎈', age: 'Ages 6-10', dots: 94, difficulty: 1, image: '/images/usa-250-birthday-balloons-stars-puzzle.webp', pdf: '/usa-250/usa-250-birthday-balloons-stars-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'america-250-anniversary-eagle-banner-dot-to-dot-puzzle', emoji: '🦅', age: 'Ages 6–10', dots: 104, difficulty: 2, image: '/images/america-250-anniversary-eagle-banner-puzzle.webp', pdf: '/usa-250/america-250-anniversary-eagle-banner-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadUsa250Content(locale: string): Usa250PuzzleContent[] {
  const en = loadConvertedPuzzleContent('usa-250') as Usa250PuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = contentLocaleFor(locale);
  const localeContent = require(`../content/${contentLocale}/puzzles-usa-250.json`) as Usa250PuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function isUsa250Available(locale: string): boolean {
  return isSectionAvailable(locale, 'usa-250/');
}

export function getUsa250PuzzlesForLocale(locale: string): Usa250Puzzle[] {
  if (!isUsa250Available(locale)) return [];

  const content = loadUsa250Content(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return usa250PuzzleShells
    .map((shell): Usa250Puzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is Usa250Puzzle => Boolean(p));
}

export function getUsa250PuzzleBySlug(slug: string, locale: string): Usa250Puzzle | undefined {
  return getUsa250PuzzlesForLocale(locale).find((p) => p.slug === slug);
}
