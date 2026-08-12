import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
import { isSectionAvailable } from './section-locales';
export type { DotGuide };

export type CanadaPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type CanadaPuzzleContent = {
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

export type CanadaPuzzle = CanadaPuzzleShell & Omit<CanadaPuzzleContent, 'slug'>;

// Whether `locale` gets a Canada section at all — derived from
// content/{locale}/puzzles-canada.json, not a hand-maintained list (see
// lib/section-locales.ts). Every locale that fails this gets no Canada
// section rather than a silent English-fallback page.
export function isCanadaAvailable(locale: string): boolean {
  return isSectionAvailable(locale, 'canada/');
}

export const canadaPuzzleShells: CanadaPuzzleShell[] = [
  { slug: 'canada-canoe-dot-to-dot-puzzle', emoji: '🛶', age: 'Ages 5-9', dots: 69, difficulty: 2, image: '/images/canada-canoe-puzzle.webp', pdf: '/canada/canada-canoe-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'canada-maple-leaf-dot-to-dot-puzzle', emoji: '🍁', age: 'Ages 5-9', dots: 70, difficulty: 2, image: '/images/canada-maple-leaf-puzzle.webp', pdf: '/canada/canada-maple-leaf-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'canada-polar-bear-dot-to-dot-puzzle', emoji: '🐻‍❄️', age: 'Ages 6-10', dots: 74, difficulty: 2, image: '/images/canada-polar-bear-puzzle.webp', pdf: '/canada/canada-polar-bear-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'canada-moose-dot-to-dot-puzzle', emoji: '🫎', age: 'Ages 6-10', dots: 89, difficulty: 2, image: '/images/canada-moose-puzzle.webp', pdf: '/canada/canada-moose-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'canada-raccoon-dot-to-dot-puzzle', emoji: '🦝', age: 'Ages 6-10', dots: 90, difficulty: 2, image: '/images/canada-raccoon-puzzle.webp', pdf: '/canada/canada-raccoon-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadCanadaContent(locale: string): CanadaPuzzleContent[] {
  const en = loadConvertedPuzzleContent('canada') as CanadaPuzzleContent[];
  if (locale === 'en') return en;
  if (!isCanadaAvailable(locale)) return [];
  const localized = require(`../content/${locale}/puzzles-canada.json`) as CanadaPuzzleContent[];
  return mergeLocalizedPuzzles(en, localized, { allowMissingDotGuide: true });
}

export function getCanadaPuzzlesForLocale(locale: string): CanadaPuzzle[] {
  const bySlug = new Map(loadCanadaContent(locale).map((item) => [item.slug, item]));
  return canadaPuzzleShells.map((shell) => {
    const content = bySlug.get(shell.slug);
    return content ? { ...shell, ...content } : undefined;
  }).filter((p): p is CanadaPuzzle => Boolean(p));
}

export function getCanadaPuzzleBySlug(slug: string, locale: string): CanadaPuzzle | undefined {
  return getCanadaPuzzlesForLocale(locale).find((p) => p.slug === slug);
}
