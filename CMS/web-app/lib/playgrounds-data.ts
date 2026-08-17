import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
export type { DotGuide };

export type PlaygroundPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type PlaygroundPuzzleContent = {
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

export type PlaygroundPuzzle = PlaygroundPuzzleShell & Omit<PlaygroundPuzzleContent, 'slug'>;

export const playgroundPuzzleShells: PlaygroundPuzzleShell[] = [
  { slug: 'spring-horse-playground-dot-to-dot-puzzle', emoji: '🐴', age: 'Ages 4–8', dots: 53, difficulty: 1, image: '/images/playgrounds-spring-horse-puzzle.webp', pdf: '/playgrounds/playgrounds-spring-horse-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'playhouse-slide-playground-dot-to-dot-puzzle', emoji: '🛝', age: 'Ages 5–9', dots: 68, difficulty: 1, image: '/images/playgrounds-playhouse-slide-puzzle.webp', pdf: '/playgrounds/playgrounds-playhouse-slide-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'carousel-horse-playground-dot-to-dot-puzzle', emoji: '🎠', age: 'Ages 5–9', dots: 88, difficulty: 2, image: '/images/playground-carousel-horse-puzzle.webp', pdf: '/playgrounds/playground-carousel-horse-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'dashing-car-playground-dot-to-dot-puzzle', emoji: '🚗', age: 'Ages 4–8', dots: 48, difficulty: 1, image: '/images/playgrounds-dashing-car-puzzle.webp', pdf: '/playgrounds/playgrounds-dashing-car-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'swing-playgrounds-dot-to-dot-puzzle', emoji: '🛝', age: 'Ages 4–7', dots: 42, difficulty: 1, image: '/images/swing-playgrounds-puzzle.webp', pdf: '/playgrounds/swing-playgrounds-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'slide-playgrounds-dot-to-dot-puzzle', emoji: '🛝', age: 'Ages 6–10', dots: 102, difficulty: 2, image: '/images/slide-playgrounds-puzzle.webp', pdf: '/playgrounds/slide-playgrounds-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'seesaw-playground-dot-to-dot-puzzle', emoji: '🛝', age: 'Ages 5–9', dots: 68, difficulty: 1, image: '/images/seesaw-playground-puzzle.webp', pdf: '/playgrounds/seesaw-playground-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'monkey-bar-playground-dot-to-dot-puzzle', emoji: '🛝', age: 'Ages 5–9', dots: 94, difficulty: 2, image: '/images/monkey-bar-playground-puzzle.webp', pdf: '/playgrounds/monkey-bar-playground-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'roller-coaster-playground-dot-to-dot-puzzle', emoji: '🎢', age: 'Ages 8–12', dots: 133, difficulty: 3, image: '/images/roller-coaster-playground-puzzle.webp', pdf: '/playgrounds/roller-coaster-playground-dot-to-dot-printable-horizontal.pdf', isNew: true }
];

function loadPlaygroundContent(locale: string): PlaygroundPuzzleContent[] {
  const en = loadConvertedPuzzleContent('playgrounds') as PlaygroundPuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-playgrounds.json`) as PlaygroundPuzzleContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getPlaygroundPuzzlesForLocale(locale: string): PlaygroundPuzzle[] {
  const content = loadPlaygroundContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return playgroundPuzzleShells
    .map((shell): PlaygroundPuzzle | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((p): p is PlaygroundPuzzle => Boolean(p));
}

export function getPlaygroundPuzzleBySlug(slug: string, locale: string): PlaygroundPuzzle | undefined {
  return getPlaygroundPuzzlesForLocale(locale).find((p) => p.slug === slug);
}
