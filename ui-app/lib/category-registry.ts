import { getCanadaPuzzleBySlug, getCanadaPuzzlesForLocale, isCanadaAvailable } from './canada-data';
import { getCircusPuzzleBySlug, getCircusPuzzlesForLocale } from './circus-data';
import { getCutePuzzleBySlug, getCutePuzzlesForLocale } from './cute-data';
import { getDinosaurBySlug, getDinosaursForLocale } from './dinosaurs-data';
import { getFlowerPuzzleBySlug, getFlowerPuzzlesForLocale, isFlowersAvailable } from './flowers-data';
import { getGardenPuzzleBySlug, getGardenPuzzlesForLocale } from './garden-data';
import { getOceanPuzzleBySlug, getOceanPuzzlesForLocale } from './ocean-data';
import { getPlaygroundPuzzleBySlug, getPlaygroundPuzzlesForLocale } from './playgrounds-data';
import { getSpacePuzzleBySlug, getSpacePuzzlesForLocale } from './space-data';
import { getUaePuzzleBySlug, getUaePuzzlesForLocale } from './uae-data';
import { getUsa250PuzzleBySlug, getUsa250PuzzlesForLocale, isUsa250Available } from './usa-250-data';
import { isSectionAvailable } from './section-locales';

export type CommonPuzzle = {
  slug: string; name: string; tagline: string; description: string; funFact: string;
  age: string; dots: number; difficulty: 1 | 2 | 3; image: string; pdf: string;
  isNew?: boolean; seoTitle?: string; seoH1?: string; seoDescription?: string; seoImageAlt?: string;
  dotGuide?: any;
};

export type CategoryConfig = {
  slug: string; name: string; h1: string; description: string; whyH2: string; whyP: string;
  getPuzzles(locale: string): CommonPuzzle[];
  getPuzzle(slug: string, locale: string): CommonPuzzle | undefined;
  isAvailable(locale: string): boolean;
};

const available = (slug: string) => (locale: string) => isSectionAvailable(locale, `${slug}/`);

export const categories: Record<string, CategoryConfig> = {
  canada: { slug: 'canada', name: 'Canada', h1: 'Free Canada Dot-to-Dot Printables for Kids', description: 'Paddle a Canadian canoe, trace the maple leaf, then meet Canadian wildlife in this free printable collection.', whyH2: 'Discover Canada One Dot at a Time', whyP: 'These activities help children practise number order, pencil control, and concentration.', getPuzzles: getCanadaPuzzlesForLocale, getPuzzle: getCanadaPuzzleBySlug, isAvailable: isCanadaAvailable },
  circus: { slug: 'circus', name: 'Circus', h1: 'Circus Dot-to-Dot Printables for Kids', description: 'Step into the big top with free circus-themed connect-the-dots worksheets.', whyH2: 'Big-Top Fun, One Dot at a Time', whyP: 'Circus puzzles combine playful characters with number sequencing and pencil practice.', getPuzzles: getCircusPuzzlesForLocale, getPuzzle: getCircusPuzzleBySlug, isAvailable: available('circus') },
  cute: { slug: 'cute', name: 'Cute Puzzles', h1: 'Cute Dot-to-Dot Printables for Kids', description: 'Discover adorable animals, vehicles, and characters in these free printable puzzles.', whyH2: 'Cute Pictures Make Practice Fun', whyP: 'Friendly pictures reward careful counting, focus, and fine-motor control.', getPuzzles: getCutePuzzlesForLocale, getPuzzle: getCutePuzzleBySlug, isAvailable: available('cute') },
  dinosaurs: { slug: 'dinosaurs', name: 'Dinosaurs', h1: 'Dinosaur Dot-to-Dot Printables for Kids', description: 'Connect prehistoric giants from the first dot to the final reveal.', whyH2: 'Roar Through Number Practice', whyP: 'Dinosaur puzzles build number confidence, concentration, and pencil control.', getPuzzles: getDinosaursForLocale, getPuzzle: getDinosaurBySlug, isAvailable: available('dinosaurs') },
  flowers: { slug: 'flowers', name: 'Flowers', h1: 'Flower Dot-to-Dot Printables for Kids', description: 'Slow down with petals, patterns, and number paths in these free flower printables.', whyH2: 'Why Kids Love Flower Dot-to-Dot Puzzles', whyP: 'Calming nature themes combine with number sequencing, fine-motor skills, and pencil control.', getPuzzles: getFlowerPuzzlesForLocale, getPuzzle: getFlowerPuzzleBySlug, isAvailable: isFlowersAvailable },
  garden: { slug: 'garden', name: 'Garden', h1: 'Garden Dot-to-Dot Printables for Kids', description: 'Grow counting confidence with free garden-themed printable puzzles.', whyH2: 'Learning Grows in the Garden', whyP: 'Garden activities encourage patient tracing, counting, and observation.', getPuzzles: getGardenPuzzlesForLocale, getPuzzle: getGardenPuzzleBySlug, isAvailable: available('garden') },
  ocean: { slug: 'ocean', name: 'Ocean', h1: 'Ocean Dot-to-Dot Printables for Kids', description: 'Dive into free ocean puzzles featuring sea life and underwater adventures.', whyH2: 'Explore the Ocean Dot by Dot', whyP: 'Ocean puzzles make number order and pencil practice feel like an adventure.', getPuzzles: getOceanPuzzlesForLocale, getPuzzle: getOceanPuzzleBySlug, isAvailable: available('ocean') },
  playgrounds: { slug: 'playgrounds', name: 'Playgrounds', h1: 'Playground Dot-to-Dot Printables for Kids', description: 'Connect slides, swings, and playful scenes with free printable worksheets.', whyH2: 'Playground Fun on Every Page', whyP: 'Familiar play equipment keeps children engaged while they practise sequencing.', getPuzzles: getPlaygroundPuzzlesForLocale, getPuzzle: getPlaygroundPuzzleBySlug, isAvailable: available('playgrounds') },
  space: { slug: 'space', name: 'Space', h1: 'Space Dot-to-Dot Printables for Kids', description: 'Launch into free space-themed dot-to-dot puzzles.', whyH2: 'Count Down to a Space Adventure', whyP: 'Space puzzles reward focus and number confidence with an exciting reveal.', getPuzzles: getSpacePuzzlesForLocale, getPuzzle: getSpacePuzzleBySlug, isAvailable: available('space') },
  uae: { slug: 'uae', name: 'United Arab Emirates', h1: 'UAE Dot-to-Dot Printables for Kids', description: 'Explore UAE landmarks and cultural icons through free printable puzzles.', whyH2: 'Discover the UAE Dot by Dot', whyP: 'These puzzles combine cultural discovery with counting and pencil control.', getPuzzles: getUaePuzzlesForLocale, getPuzzle: getUaePuzzleBySlug, isAvailable: available('uae') },
  'usa-250': { slug: 'usa-250', name: 'America 250', h1: 'America 250 Dot-to-Dot Printables', description: 'Celebrate America’s 250th anniversary with free printable puzzles.', whyH2: 'Celebrate America Dot by Dot', whyP: 'Patriotic puzzles combine history, number sequencing, and creative fun.', getPuzzles: getUsa250PuzzlesForLocale, getPuzzle: getUsa250PuzzleBySlug, isAvailable: isUsa250Available }
};

export function getCategory(category: string) {
  return categories[category];
}
