import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';

export type SpacePuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type SpacePuzzleContent = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  funFact: string;
  dotGuide?: DotGuide;
};

export type SpacePuzzle = SpacePuzzleShell & Omit<SpacePuzzleContent, 'slug'>;

export const spacePuzzleShells: SpacePuzzleShell[] = [
  {
    slug: 'crescent-moon-dot-to-dot-puzzle',
    emoji: '🌙',
    age: 'Ages 4–8',
    dots: 60,
    difficulty: 1,
    image: '/images/space-crescent-moon-puzzle.webp',
    pdf: '/space/space-crescent-moon-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'ringed-planet-dot-to-dot-puzzle',
    emoji: '🪐',
    age: 'Ages 4–7',
    dots: 43,
    difficulty: 1,
    image: '/images/space-ringed-planet-puzzle.webp',
    pdf: '/space/space-ringed-planet-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'saturn-dot-to-dot-puzzle',
    emoji: '🪐',
    age: 'Ages 4–7',
    dots: 43,
    difficulty: 1,
    image: '/images/space-saturn-puzzle.webp',
    pdf: '/space/space-saturn-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'astronaut-boots-dot-to-dot-puzzle',
    emoji: '🥾',
    age: 'Ages 4–8',
    dots: 51,
    difficulty: 1,
    image: '/images/space-astronaut-boots-puzzle.webp',
    pdf: '/space/space-astronaut-boots-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'space-rover-dot-to-dot-puzzle',
    emoji: '🚀',
    age: 'Ages 4–8',
    dots: 59,
    difficulty: 1,
    image: '/images/space-rover-puzzle.webp',
    pdf: '/space/space-rover-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  }
];

function loadSpaceContent(locale: string): SpacePuzzleContent[] {
  const en = loadConvertedPuzzleContent('space') as SpacePuzzleContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  let localized: SpacePuzzleContent[] = [];
  try {
    localized = require(`../content/${contentLocale}/puzzles-space.json`) as SpacePuzzleContent[];
  } catch {
    // Space is new; locales not yet translated fall back to the complete English record.
  }
  return mergeLocalizedPuzzles(en, localized);
}

export function getSpacePuzzlesForLocale(locale: string): SpacePuzzle[] {
  const contentBySlug = new Map(loadSpaceContent(locale).map((content) => [content.slug, content]));
  return spacePuzzleShells
    .map((shell): SpacePuzzle | undefined => {
      const content = contentBySlug.get(shell.slug);
      return content ? { ...shell, ...content } : undefined;
    })
    .filter((puzzle): puzzle is SpacePuzzle => Boolean(puzzle));
}

export function getSpacePuzzleBySlug(slug: string, locale: string): SpacePuzzle | undefined {
  return getSpacePuzzlesForLocale(locale).find((puzzle) => puzzle.slug === slug);
}
