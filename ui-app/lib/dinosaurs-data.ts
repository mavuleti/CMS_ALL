import { mergeLocalizedPuzzles } from './puzzle-i18n';
import { loadConvertedPuzzleContent } from './converted-content';

export type DotGuideSection = {
  range: string;
  title: string;
  learn: string;
  fact: string;
};

export type ColorMapping = {
  range: string;
  part: string;
  color: string;
  hex?: string;
  why: string;
};

export type ColorScheme = {
  name: string;
  note: string;
  mapping: ColorMapping[];
};

export type DotGuide = {
  intro: string;
  sections: DotGuideSection[];
  outro: string;
  colorSchemes?: ColorScheme[];
};

export type DinosaurShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type DinosaurContent = {
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

export type Dinosaur = DinosaurShell & Omit<DinosaurContent, 'slug'>;

export const dinosaurShells: DinosaurShell[] = [
  { slug: 'trex-61-dot-to-dot-puzzle', emoji: '🦖', age: 'Ages 6-9', dots: 61, difficulty: 2, image: '/images/trex-61-puzzle.webp', pdf: '/dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'ostriches-dinosaur-dot-to-dot-puzzle', emoji: '🦤', age: 'Ages 5–8', dots: 55, difficulty: 1, image: '/images/ostriches-puzzle.webp', pdf: '/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'brontosaurus-dot-to-dot-puzzle', emoji: '🦕', age: 'Ages 4–7', dots: 50, difficulty: 1, image: '/images/brontosaurus-puzzle.webp', pdf: '/dinosaurs/brontosaurus-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'triceratops-dot-to-dot-puzzle', emoji: '🦕', age: 'Ages 6–9', dots: 70, difficulty: 2, image: '/images/triceratops-puzzle.webp', pdf: '/dinosaurs/triceratops-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'velociraptor-dot-to-dot-puzzle', emoji: '🦕', age: 'Ages 6–9', dots: 54, difficulty: 2, image: '/images/velociraptor-puzzle.webp', pdf: '/dinosaurs/velociraptor-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'stegosaurus-dot-to-dot-puzzle', emoji: '🦕', age: 'Ages 4–7', dots: 52, difficulty: 1, image: '/images/stegosaurus-puzzle.webp', pdf: '/dinosaurs/stegosaurus-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'spinosaurus', emoji: '🦖', age: 'Ages 6–10', dots: 74, difficulty: 2, image: '/images/spinosaurus-74-puzzle.webp', pdf: '/dinosaurs/spinosaurus-74-dot-to-dot-printable-horizontal.pdf', isNew: true },
  { slug: 'brachiosaurus', emoji: '🦕', age: 'Ages 5–9', dots: 38, difficulty: 2, image: 'dummy-brachiosaurus', pdf: 'dummy-brachiosaurus.pdf' },
  { slug: 'ankylosaurus', emoji: '🦕', age: 'Ages 5–8', dots: 32, difficulty: 2, image: 'dummy-ankylosaurus', pdf: 'dummy-ankylosaurus.pdf' },
  { slug: 'pterodactyl-dot-to-dot-puzzle', emoji: '🦅', age: 'Ages 6–9', dots: 67, difficulty: 2, image: '/images/pterodactyl-puzzle.webp', pdf: '/dinosaurs/pterodactyl-dot-to-dot-puzzle-printable-horizontal.pdf', isNew: true },
  { slug: 'allosaurus', emoji: '🦖', age: 'Ages 6–10', dots: 42, difficulty: 3, image: 'dummy-allosaurus', pdf: 'dummy-allosaurus.pdf' }
];

function loadDinosaurContent(locale: string): DinosaurContent[] {
  const en = loadConvertedPuzzleContent('dinosaurs') as DinosaurContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/puzzles-dinosaurs.json`) as DinosaurContent[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getDinosaursForLocale(locale: string): Dinosaur[] {
  const content = loadDinosaurContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return dinosaurShells
    .map((shell): Dinosaur | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      const { slug: _slug, ...rest } = c;
      return { ...shell, ...rest };
    })
    .filter((d): d is Dinosaur => Boolean(d));
}

export function getDinosaurBySlug(slug: string, locale: string): Dinosaur | undefined {
  return getDinosaursForLocale(locale).find((d) => d.slug === slug);
}
