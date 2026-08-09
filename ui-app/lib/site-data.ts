import {
  BookOpen,
  Car,
  Castle,
  Flag,
  GraduationCap,
  Heart,
  Landmark,
  Leaf,
  Rocket,
  Shell,
  Sparkles,
  Footprints,
  Sprout,
  Flower2,
  TentTree,
  type LucideIcon
} from 'lucide-react';
import { dinosaurShells } from './dinosaurs-data';
import { oceanPuzzleShells } from './ocean-data';
import { playgroundPuzzleShells } from './playgrounds-data';
import { gardenPuzzleShells } from './garden-data';
import { flowerPuzzleShells } from './flowers-data';
import { cutePuzzleShells } from './cute-data';
import { usa250PuzzleShells } from './usa-250-data';
import { uaePuzzleShells } from './uae-data';
import { canadaPuzzleShells } from './canada-data';
import { spacePuzzleShells } from './space-data';
import { circusPuzzleShells } from './circus-data';
import { puzzleIdFromHref } from './puzzle-id';

export type Puzzle = {
  /** Stable analytics identifier; unlike href, this must not change when URLs are renamed. */
  id: string;
  name: string;
  category: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  href: string;
  isNew?: boolean;
};

export type Category = {
  id: string;
  name: string;
  count: number;
  description: string;
  color: string;
  Icon: LucideIcon;
  href?: string;
  badge?: string;
};

// Excludes dummy/placeholder entries (no real image or PDF yet) so this count
// matches what's actually shown in the dinosaurs grid.
const dinosaurCount = dinosaurShells.filter((d) => !d.image.startsWith('dummy-')).length;
const oceanCount = oceanPuzzleShells.length;
const playgroundCount = playgroundPuzzleShells.length;
const gardenCount = gardenPuzzleShells.length;
const flowersCount = flowerPuzzleShells.length;
const cuteCount = cutePuzzleShells.length;
const usa250Count = usa250PuzzleShells.length;
const uaeCount = uaePuzzleShells.length;
const canadaCount = canadaPuzzleShells.length;
const spaceCount = spacePuzzleShells.length;
const circusCount = circusPuzzleShells.length;

const puzzleCatalog: Omit<Puzzle, 'id'>[] = [
  {
    name: 'Circus Ringmaster Bear',
    category: 'Circus',
    age: 'Ages 5-9',
    dots: 74,
    difficulty: 2,
    image: '/images/circus-ringmaster-bear-puzzle.webp',
    href: '/circus/circus-ringmaster-bear-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Circus Tent',
    category: 'Circus',
    age: 'Ages 4-8',
    dots: 59,
    difficulty: 1,
    image: '/images/circus-tent-puzzle.webp',
    href: '/circus/circus-tent-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Space Rover',
    category: 'Space',
    age: 'Ages 4-8',
    dots: 59,
    difficulty: 1,
    image: '/images/space-rover-puzzle.webp',
    href: '/space/space-rover-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Ringed Planet',
    category: 'Space',
    age: 'Ages 4-7',
    dots: 43,
    difficulty: 1,
    image: '/images/space-ringed-planet-puzzle.webp',
    href: '/space/ringed-planet-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Crescent Moon',
    category: 'Space',
    age: 'Ages 4-8',
    dots: 60,
    difficulty: 1,
    image: '/images/space-crescent-moon-puzzle.webp',
    href: '/space/crescent-moon-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Spring Horse',
    category: 'Playgrounds',
    age: 'Ages 4-8',
    dots: 53,
    difficulty: 1,
    image: '/images/playgrounds-spring-horse-puzzle.webp',
    href: '/playgrounds/spring-horse-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Playhouse Slide',
    category: 'Playgrounds',
    age: 'Ages 5-9',
    dots: 68,
    difficulty: 1,
    image: '/images/playgrounds-playhouse-slide-puzzle.webp',
    href: '/playgrounds/playhouse-slide-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Flax Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 90,
    difficulty: 2,
    image: '/images/flower-flax-flower-puzzle.webp',
    href: '/flowers/flax-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Nasturtium Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 96,
    difficulty: 2,
    image: '/images/flower-nasturtium-puzzle.webp',
    href: '/flowers/nasturtium-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Snowdrop Flower',
    category: 'Flowers',
    age: 'Ages 8-12',
    dots: 145,
    difficulty: 3,
    image: '/images/flower-snowdrop-puzzle.webp',
    href: '/flowers/snowdrop-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Buttercup Flower',
    category: 'Flowers',
    age: 'Ages 5-9',
    dots: 62,
    difficulty: 2,
    image: '/images/flower-buttercup-puzzle.webp',
    href: '/flowers/buttercup-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Camellia Flower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 45,
    difficulty: 1,
    image: '/images/flower-camellia-puzzle.webp',
    href: '/flowers/camellia-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'T-Rex 61-Dot Challenge',
    category: 'Dinosaurs',
    age: 'Ages 6-9',
    dots: 61,
    difficulty: 2,
    image: '/images/trex-61-puzzle.webp',
    href: '/dinosaurs/trex-61-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Brontosaurus',
    category: 'Dinosaurs',
    age: 'Ages 4-7',
    dots: 50,
    difficulty: 1,
    image: '/images/brontosaurus-puzzle.webp',
    href: '/dinosaurs/brontosaurus-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Spinosaurus',
    category: 'Dinosaurs',
    age: 'Ages 6-10',
    dots: 74,
    difficulty: 2,
    image: '/images/spinosaurus-74-puzzle.webp',
    href: '/dinosaurs/spinosaurus/',
    isNew: true
  },
  {
    name: 'Mermaid',
    category: 'Ocean',
    age: 'Ages 5-8',
    dots: 54,
    difficulty: 1,
    image: '/images/mermaid-puzzle.webp',
    href: '/ocean/mermaid-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Merman',
    category: 'Ocean',
    age: 'Ages 4-7',
    dots: 44,
    difficulty: 1,
    image: '/images/merman-puzzle.webp',
    href: '/ocean/merman-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Seahorse',
    category: 'Ocean',
    age: 'Ages 4-7',
    dots: 35,
    difficulty: 1,
    image: '/images/seahorse-puzzle.webp',
    href: '/ocean/seahorse-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Whale',
    category: 'Ocean',
    age: 'Ages 4-7',
    dots: 42,
    difficulty: 1,
    image: '/images/whale-puzzle.webp',
    href: '/ocean/whale-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Jellyfish',
    category: 'Ocean',
    age: 'Ages 6-9',
    dots: 88,
    difficulty: 2,
    image: '/images/jellyfish-puzzle.webp',
    href: '/ocean/jellyfish-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Swing Playground',
    category: 'Playgrounds',
    age: 'Ages 4-7',
    dots: 42,
    difficulty: 1,
    image: '/images/swing-playgrounds-puzzle.webp',
    href: '/playgrounds/swing-playgrounds-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Slide Playground',
    category: 'Playgrounds',
    age: 'Ages 6-10',
    dots: 102,
    difficulty: 2,
    image: '/images/slide-playgrounds-puzzle.webp',
    href: '/playgrounds/slide-playgrounds-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Seesaw Playground',
    category: 'Playgrounds',
    age: 'Ages 5-9',
    dots: 68,
    difficulty: 1,
    image: '/images/seesaw-playground-puzzle.webp',
    href: '/playgrounds/seesaw-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Monkey Bars Playground',
    category: 'Playgrounds',
    age: 'Ages 5-9',
    dots: 94,
    difficulty: 2,
    image: '/images/monkey-bar-playground-puzzle.webp',
    href: '/playgrounds/monkey-bar-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Roller Coaster Playground',
    category: 'Playgrounds',
    age: 'Ages 8-12',
    dots: 133,
    difficulty: 3,
    image: '/images/roller-coaster-playground-puzzle.webp',
    href: '/playgrounds/roller-coaster-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Carousel Horse Playground',
    category: 'Playgrounds',
    age: 'Ages 5-9',
    dots: 88,
    difficulty: 2,
    image: '/images/playground-carousel-horse-puzzle.webp',
    href: '/playgrounds/carousel-horse-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Dashing Car Playground',
    category: 'Playgrounds',
    age: 'Ages 4-8',
    dots: 48,
    difficulty: 1,
    image: '/images/playgrounds-dashing-car-puzzle.webp',
    href: '/playgrounds/dashing-car-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Garden Gloves',
    category: 'Garden',
    age: 'Ages 4-8',
    dots: 54,
    difficulty: 1,
    image: '/images/garden-gloves-puzzle.webp',
    href: '/garden/garden-gloves-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Garden Trowel',
    category: 'Garden',
    age: 'Ages 4-7',
    dots: 39,
    difficulty: 1,
    image: '/images/garden-trowel-puzzle.webp',
    href: '/garden/garden-trowel-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Lotus Flower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 46,
    difficulty: 1,
    image: '/images/flower-lotus-puzzle.webp',
    href: '/flowers/lotus-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Orchid Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 76,
    difficulty: 2,
    image: '/images/flower-orchid-puzzle.webp',
    href: '/flowers/orchid-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Peony Flower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 46,
    difficulty: 1,
    image: '/images/flower-peony-puzzle.webp',
    href: '/flowers/peony-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Six-Petal Lily',
    category: 'Flowers',
    age: 'Ages 5-9',
    dots: 62,
    difficulty: 2,
    image: '/images/flower-six-petal-lily-puzzle.webp',
    href: '/flowers/six-petal-lily-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Carnation Flower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 53,
    difficulty: 1,
    image: '/images/flower-carnation-puzzle.webp',
    href: '/flowers/carnation-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Plumeria Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 95,
    difficulty: 2,
    image: '/images/flower-plumeria-puzzle.webp',
    href: '/flowers/plumeria-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Petunia Flower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 53,
    difficulty: 1,
    image: '/images/flower-petunia-puzzle.webp',
    href: '/flowers/petunia-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Periwinkle Flower',
    category: 'Flowers',
    age: 'Ages 5-9',
    dots: 72,
    difficulty: 2,
    image: '/images/flower-periwinkle-puzzle.webp',
    href: '/flowers/periwinkle-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Jasmine Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 97,
    difficulty: 2,
    image: '/images/flower-jasmine-puzzle.webp',
    href: '/flowers/jasmine-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Geranium Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 92,
    difficulty: 2,
    image: '/images/flower-geranium-puzzle.webp',
    href: '/flowers/geranium-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Forget-Me-Not Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 107,
    difficulty: 2,
    image: '/images/flower-forget-me-not-puzzle.webp',
    href: '/flowers/forget-me-not-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Rose Flower',
    category: 'Flowers',
    age: 'Ages 5-9',
    dots: 66,
    difficulty: 2,
    image: '/images/flower-rose-puzzle.webp',
    href: '/flowers/rose-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Tulip Flower',
    category: 'Flowers',
    age: 'Ages 5-9',
    dots: 88,
    difficulty: 2,
    image: '/images/flower-tulip-puzzle.webp',
    href: '/flowers/tulip-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Poppy Flower',
    category: 'Flowers',
    age: 'Ages 6-10',
    dots: 106,
    difficulty: 2,
    image: '/images/flower-poppy-puzzle.webp',
    href: '/flowers/poppy-flower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Kawaii Sunflower',
    category: 'Flowers',
    age: 'Ages 4-8',
    dots: 58,
    difficulty: 1,
    image: '/images/flower-kawaii-sunflower-puzzle.webp',
    href: '/flowers/kawaii-sunflower-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Wheelbarrow Playground',
    category: 'Garden',
    age: 'Ages 5-9',
    dots: 85,
    difficulty: 2,
    image: '/images/wheelbarrow-playground-puzzle.webp',
    href: '/garden/wheelbarrow-playground-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Gas Balloon America 250',
    category: 'USA 250 Years',
    age: 'Ages 4-7',
    dots: 48,
    difficulty: 1,
    image: '/images/gas-balloon-usa-250-puzzle.webp',
    href: '/usa-250/gas-balloon-usa-250-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Birthday Fireworks',
    category: 'USA 250 Years',
    age: 'Ages 6-10',
    dots: 90,
    difficulty: 1,
    image: '/images/america-250-birthday-fireworks-puzzle.webp',
    href: '/usa-250/america-250-birthday-fireworks-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Liberty Bell Wings',
    category: 'USA 250 Years',
    age: 'Ages 4-8',
    dots: 64,
    difficulty: 1,
    image: '/images/america-250-anniversary-liberty-bell-wings-1776-puzzle.webp',
    href: '/usa-250/america-250-anniversary-liberty-bell-wings-1776-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Astronaut',
    category: 'USA 250 Years',
    age: 'Ages 4-8',
    dots: 63,
    difficulty: 1,
    image: '/images/usa-250-astronaut-puzzle.webp',
    href: '/usa-250/usa-250-astronaut-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Anniversary Sports Kids Podium',
    category: 'USA 250 Years',
    age: 'Ages 6-10',
    dots: 124,
    difficulty: 2,
    image: '/images/usa-250-anniversary-sports-kids-podium-puzzle.webp',
    href: '/usa-250/usa-250-anniversary-sports-kids-podium-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Anniversary Airplane Banner',
    category: 'USA 250 Years',
    age: 'Ages 4-8',
    dots: 54,
    difficulty: 1,
    image: '/images/usa-250-anniversary-airplane-banner-puzzle.webp',
    href: '/usa-250/usa-250-anniversary-airplane-banner-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Space Shuttle',
    category: 'USA 250 Years',
    age: 'Ages 4-8',
    dots: 50,
    difficulty: 1,
    image: '/images/usa-250-space-shuttle-puzzle.webp',
    href: '/usa-250/usa-250-space-shuttle-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Birthday Balloons and Stars',
    category: 'USA 250 Years',
    age: 'Ages 6-10',
    dots: 94,
    difficulty: 1,
    image: '/images/usa-250-birthday-balloons-stars-puzzle.webp',
    href: '/usa-250/usa-250-birthday-balloons-stars-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Birthday Cake',
    category: 'USA 250 Years',
    age: 'Ages 4-8',
    dots: 56,
    difficulty: 1,
    image: '/images/usa-250-birthday-cake-puzzle.webp',
    href: '/usa-250/usa-250-birthday-cake-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'America 250 Eagle Banner',
    category: 'USA 250 Years',
    age: 'Ages 6-10',
    dots: 104,
    difficulty: 2,
    image: '/images/america-250-anniversary-eagle-banner-puzzle.webp',
    href: '/usa-250/america-250-anniversary-eagle-banner-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Burj Al Arab',
    category: 'UAE',
    age: 'Ages 6-10',
    dots: 66,
    difficulty: 1,
    image: '/images/burj-al-arab-puzzle.webp',
    href: '/uae/burj-al-arab-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Burj Khalifa',
    category: 'UAE',
    age: 'Ages 5-9',
    dots: 60,
    difficulty: 1,
    image: '/images/burj-khalifa-puzzle.webp',
    href: '/uae/burj-khalifa-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'UAE Falcon',
    category: 'UAE',
    age: 'Ages 5-9',
    dots: 60,
    difficulty: 1,
    image: '/images/uae-falcon-puzzle.webp',
    href: '/uae/uae-falcon-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Dallah Coffee Pot',
    category: 'UAE',
    age: 'Ages 6-10',
    dots: 63,
    difficulty: 1,
    image: '/images/dallah-coffee-pot-puzzle.webp',
    href: '/uae/dallah-coffee-pot-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'UAE Camel',
    category: 'UAE',
    age: 'Ages 6-10',
    dots: 105,
    difficulty: 2,
    image: '/images/uae-camel-puzzle.webp',
    href: '/uae/uae-camel-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Cute Puppy',
    category: 'Cute',
    age: 'Ages 5-9',
    dots: 70,
    difficulty: 2,
    image: '/images/cute-puppy-puzzle.webp',
    href: '/cute/cute-puppy-dot-to-dot-puzzle/',
    isNew: true
  },
  {
    name: 'Cute Little Car',
    category: 'Cute',
    age: 'Ages 4-8',
    dots: 55,
    difficulty: 1,
    image: '/images/cute-little-car-puzzle.webp',
    href: '/cute/cute-little-car-dot-to-dot-puzzle/',
    isNew: true
  },
  { name: 'Canadian Canoe', category: 'Canada', age: 'Ages 5-9', dots: 69, difficulty: 2, image: '/images/canada-canoe-puzzle.webp', href: '/canada/canada-canoe-dot-to-dot-puzzle/', isNew: true },
  { name: 'Maple Leaf', category: 'Canada', age: 'Ages 5-9', dots: 70, difficulty: 2, image: '/images/canada-maple-leaf-puzzle.webp', href: '/canada/canada-maple-leaf-dot-to-dot-puzzle/', isNew: true },
  { name: 'Polar Bear', category: 'Canada', age: 'Ages 6-10', dots: 74, difficulty: 2, image: '/images/canada-polar-bear-puzzle.webp', href: '/canada/canada-polar-bear-dot-to-dot-puzzle/', isNew: true },
  { name: 'Moose', category: 'Canada', age: 'Ages 6-10', dots: 89, difficulty: 2, image: '/images/canada-moose-puzzle.webp', href: '/canada/canada-moose-dot-to-dot-puzzle/', isNew: true },
  { name: 'Raccoon', category: 'Canada', age: 'Ages 6-10', dots: 90, difficulty: 2, image: '/images/canada-raccoon-puzzle.webp', href: '/canada/canada-raccoon-dot-to-dot-puzzle/', isNew: true },
];

export const puzzles: Puzzle[] = puzzleCatalog.map((puzzle) => ({
  ...puzzle,
  id: puzzleIdFromHref(puzzle.href)
}));

export const categories: Category[] = [
  {
    id: 'dinosaurs',
    name: 'Dinosaurs',
    count: dinosaurCount,
    description: `Roar into prehistoric fun! T-Rex, Triceratops, Velociraptor and ${Math.max(dinosaurCount - 3, 0)} more. ${dinosaurCount} free dot-to-dot puzzles your kids will love.`,
    color: '#c83f3a',
    Icon: Sparkles,
    href: '/dinosaurs/',
    badge: 'Available now!'
  },
  {
    id: 'cute',
    name: 'Cute',
    count: cuteCount,
    description: 'Adorable puppies, little cars, and more charming friends.',
    color: '#ed64a6',
    Icon: Heart,
    href: '/cute/',
    badge: 'New!'
  },
  {
    id: 'animals',
    name: 'Animals',
    count: 0,
    description: 'Friendly creatures for early number practice.',
    color: '#f56565',
    Icon: Leaf
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    count: 0,
    description: 'Cars, trucks, rockets, and machines.',
    color: '#2bb7a8',
    Icon: Car
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    count: 0,
    description: 'Castles, unicorns, dragons, and story prompts.',
    color: '#f6ad34',
    Icon: Castle
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    count: 0,
    description: 'Holiday and classroom calendar activities.',
    color: '#5b6ee1',
    Icon: Sparkles
  },
  {
    id: 'ocean',
    name: 'Ocean',
    count: oceanCount,
    description: 'Sea animals and calm coloring pages.',
    color: '#3182ce',
    Icon: Shell,
    href: '/ocean/',
    badge: 'Available now!'
  },
  {
    id: 'playgrounds',
    name: 'Playgrounds',
    count: playgroundCount,
    description: 'Swings, slides, and outdoor fun for little adventurers.',
    color: '#48bb78',
    Icon: Footprints,
    href: '/playgrounds/',
    badge: 'Available now!'
  },
  {
    id: 'circus',
    name: 'Circus',
    count: circusCount,
    description: 'Ringmasters, big tops, and showtime fun for young learners.',
    color: '#d9485f',
    Icon: TentTree,
    href: '/circus/',
    badge: 'New!'
  },
  {
    id: 'garden',
    name: 'Garden',
    count: gardenCount,
    description: 'Gloves, trowels, and tools for little garden helpers.',
    color: '#48a15a',
    Icon: Sprout,
    href: '/garden/',
    badge: 'Available now!'
  },
  {
    id: 'flowers',
    name: 'Flowers',
    count: flowersCount,
    description: 'Roses and beautiful blooms for calm, creative number practice.',
    color: '#d94f70',
    Icon: Flower2,
    href: '/flowers/',
    badge: 'New!'
  },
  {
    id: 'usa250',
    name: 'America 250 Years',
    count: usa250Count,
    description: 'Celebrate America\'s 250th birthday! Patriotic dot-to-dot puzzles honouring 250 years of American history.',
    color: '#e53e3e',
    Icon: Flag,
    href: '/usa-250/',
    badge: 'New!'
  },
  {
    id: 'canada',
    name: 'Canada',
    count: canadaCount,
    description: 'Explore Canada with a polar bear, raccoon, moose, and maple leaf to connect and colour.',
    color: '#d52b1e',
    Icon: Leaf,
    href: '/canada/',
    badge: 'New!'
  },
  {
    id: 'uae',
    name: 'UAE',
    count: uaeCount,
    description: 'Explore the United Arab Emirates! Iconic landmarks like the Burj Al Arab, ready to connect and colour.',
    color: '#c9a24b',
    Icon: Landmark,
    href: '/uae/',
    badge: 'Available now!'
  },
  {
    id: 'space',
    name: 'Space',
    count: spaceCount,
    description: 'Planets, astronauts, and rocket adventures.',
    color: '#805ad5',
    Icon: Rocket,
    href: '/space/',
    badge: 'New!'
  },
  {
    id: 'worksheets',
    name: 'Worksheets',
    count: 0,
    description: 'Teacher-ready number sequencing sheets.',
    color: '#dd6b20',
    Icon: GraduationCap
  },
  {
    id: 'bigDotBooks',
    name: 'Big Dot Books',
    count: 0,
    description: 'Long-form puzzles for focused older learners.',
    color: '#2d3748',
    Icon: BookOpen
  }
];
