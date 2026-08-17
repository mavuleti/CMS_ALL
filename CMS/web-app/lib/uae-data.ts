import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type UaePuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type UaePuzzleContent = {
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

export type UaePuzzle = UaePuzzleShell & Omit<UaePuzzleContent, 'slug'>;

export const uaePuzzleShells: UaePuzzleShell[] = [
  { slug: 'burj-al-arab-dot-to-dot-puzzle', emoji: '🏙️', age: 'Ages 6–10', dots: 66, difficulty: 1, image: '/images/burj-al-arab-puzzle.webp', pdf: '/uae/burj-al-arab-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'burj-khalifa-dot-to-dot-puzzle', emoji: '🏙️', age: 'Ages 5–9', dots: 60, difficulty: 1, image: '/images/burj-khalifa-puzzle.webp', pdf: '/uae/burj-khalifa-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'uae-falcon-dot-to-dot-puzzle', emoji: '🦅', age: 'Ages 5–9', dots: 60, difficulty: 1, image: '/images/uae-falcon-puzzle.webp', pdf: '/uae/uae-falcon-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'dallah-coffee-pot-dot-to-dot-puzzle', emoji: '☕', age: 'Ages 6–10', dots: 63, difficulty: 1, image: '/images/dallah-coffee-pot-puzzle.webp', pdf: '/uae/dallah-coffee-pot-dot-to-dot-printable.pdf', isNew: true },
  { slug: 'uae-camel-dot-to-dot-puzzle', emoji: '🐪', age: 'Ages 6–10', dots: 105, difficulty: 2, image: '/images/uae-camel-puzzle.webp', pdf: '/uae/uae-camel-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadUaeContent(locale: string): UaePuzzleContent[] {
  const en = loadConvertedPuzzleContent('uae') as UaePuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-uae.json`) as UaePuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getUaePuzzlesForLocale(locale: string): UaePuzzle[] {
  const content = loadUaeContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return uaePuzzleShells
    .map((shell): UaePuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is UaePuzzle => Boolean(p));
}

export function getUaePuzzleBySlug(slug: string, locale: string): UaePuzzle | undefined {
  return getUaePuzzlesForLocale(locale).find((p) => p.slug === slug);
}
