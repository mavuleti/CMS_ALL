import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type CircusPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type CircusPuzzleContent = {
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

export type CircusPuzzle = CircusPuzzleShell & Omit<CircusPuzzleContent, 'slug'>;

export const circusPuzzleShells: CircusPuzzleShell[] = [
  { slug: 'circus-ringmaster-bear-dot-to-dot-puzzle', emoji: '🐻', age: 'Ages 5–9', dots: 74, difficulty: 2, image: '/images/circus-ringmaster-bear-puzzle.webp', pdf: '/playgrounds/circus-ringmaster-bear-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'circus-tent-dot-to-dot-puzzle', emoji: '🎪', age: 'Ages 4–8', dots: 59, difficulty: 1, image: '/images/circus-tent-puzzle.webp', pdf: '/playgrounds/circus-tent-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadCircusContent(locale: string): CircusPuzzleContent[] {
  const en = loadConvertedPuzzleContent('circus') as CircusPuzzleContent[];
  if (locale === 'en') return en;

  let localeContent: CircusPuzzleContent[] = [];
  try {
    localeContent = require(`../content/${locale}/puzzles-circus.json`) as CircusPuzzleContent[];
  } catch {
    // Circus is new; locales not yet translated fall back to the complete English record.
  }
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getCircusPuzzlesForLocale(locale: string): CircusPuzzle[] {
  const content = loadCircusContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return circusPuzzleShells
    .map((shell): CircusPuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is CircusPuzzle => Boolean(p));
}

export function getCircusPuzzleBySlug(slug: string, locale: string): CircusPuzzle | undefined {
  return getCircusPuzzlesForLocale(locale).find((p) => p.slug === slug);
}
