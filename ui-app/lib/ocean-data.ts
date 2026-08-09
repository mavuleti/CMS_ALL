import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type OceanPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type OceanPuzzleContent = {
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

export type OceanPuzzle = OceanPuzzleShell & Omit<OceanPuzzleContent, 'slug'>;

export const oceanPuzzleShells: OceanPuzzleShell[] = [
  { slug: 'mermaid-dot-to-dot-puzzle', emoji: '🧜', age: 'Ages 5–8', dots: 54, difficulty: 1, image: '/images/mermaid-puzzle.webp', pdf: '/ocean/mermaid-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'merman-dot-to-dot-puzzle', emoji: '🧜', age: 'Ages 4–7', dots: 44, difficulty: 1, image: '/images/merman-puzzle.webp', pdf: '/ocean/merman-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'seahorse-dot-to-dot-puzzle', emoji: '🐠', age: 'Ages 4–7', dots: 35, difficulty: 1, image: '/images/seahorse-puzzle.webp', pdf: '/ocean/seahorse-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'whale-dot-to-dot-puzzle', emoji: '🐋', age: 'Ages 4–7', dots: 42, difficulty: 1, image: '/images/whale-puzzle.webp', pdf: '/ocean/whale-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'jellyfish-dot-to-dot-puzzle', emoji: '🪼', age: 'Ages 6–9', dots: 88, difficulty: 2, image: '/images/jellyfish-puzzle.webp', pdf: '/ocean/jellyfish-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadOceanContent(locale: string): OceanPuzzleContent[] {
  const en = loadConvertedPuzzleContent('ocean') as OceanPuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-ocean.json`) as OceanPuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getOceanPuzzlesForLocale(locale: string): OceanPuzzle[] {
  const content = loadOceanContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return oceanPuzzleShells
    .map((shell): OceanPuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is OceanPuzzle => Boolean(p));
}

export function getOceanPuzzleBySlug(slug: string, locale: string): OceanPuzzle | undefined {
  return getOceanPuzzlesForLocale(locale).find((p) => p.slug === slug);
}
