import {
  BookOpen,
  Flag,
  Flower2,
  Footprints,
  Heart,
  Landmark,
  Leaf,
  Rocket,
  Shell,
  Sparkles,
  Sprout,
  TentTree,
  type LucideIcon,
} from 'lucide-react';
import { routing } from '@/i18n/routing';
import { getCollections } from './export-content';
import { puzzleIdFromHref } from './puzzle-id';

export type Puzzle = { id: string; name: string; category: string; age: string; dots: number; difficulty: 1 | 2 | 3; image: string; href: string; isNew?: boolean };
export type Category = { id: string; name: string; count: number; description: string; color: string; Icon: LucideIcon; href?: string; badge?: string };

// These values are foreground accents (icons, headings, and borders). Soft
// backgrounds are derived from them with color-mix in CSS, so the source
// colors need enough contrast to remain readable on white cards.
const palette = ['#2774b8', '#9a6200', '#167968', '#b9365d', '#6845ad', '#ad5520'];
const categoryAccents: Partial<Record<string, string>> = {
  flowers: '#a83278',
  ocean: '#087c8f'
};

const categoryIcons: Record<string, LucideIcon> = {
  canada: Leaf,
  circus: TentTree,
  cute: Heart,
  dinosaurs: Sparkles,
  flowers: Flower2,
  garden: Sprout,
  ocean: Shell,
  playgrounds: Footprints,
  space: Rocket,
  uae: Landmark,
  'usa-250': Flag,
};

function buildPuzzles(locale: string): Puzzle[] {
  return getCollections(locale).flatMap((collection) => collection.puzzles.map((puzzle) => {
    const href = `/${collection.slug}/${puzzle.slug}/`;
    return { id: puzzleIdFromHref(href), name: puzzle.name, category: collection.body.name ?? collection.slug, age: puzzle.age ?? '', dots: puzzle.dots ?? 0, difficulty: puzzle.difficulty, image: puzzle.image ?? '', href };
  }));
}

function buildCategories(locale: string): Category[] {
  const exportCollections = getCollections(locale);
  return [
    ...exportCollections.map((collection, index) => ({ id: collection.slug === 'usa-250' ? 'usa250' : collection.slug, name: collection.body.name ?? collection.slug, count: collection.puzzles.length, description: collection.body.description ?? '', color: categoryAccents[collection.slug] ?? palette[index % palette.length], Icon: categoryIcons[collection.slug] ?? Sparkles, href: `/${collection.slug}/` })),
    { id: 'blog', name: 'Blog', count: 0, description: 'Learning guides and activity ideas.', color: '#fff0c7', Icon: BookOpen, href: '/blog/' }
  ];
}

const puzzlesByLocale: Record<string, Puzzle[]> = {};
const categoriesByLocale: Record<string, Category[]> = {};
for (const locale of routing.locales) {
  puzzlesByLocale[locale] = buildPuzzles(locale);
  categoriesByLocale[locale] = buildCategories(locale);
}

export function puzzlesForLocale(locale: string): Puzzle[] {
  return puzzlesByLocale[locale] ?? [];
}
export function categoriesForLocale(locale: string): Category[] {
  return categoriesByLocale[locale] ?? [];
}

// English-only exports kept for call sites that haven't been made
// locale-aware yet.
export const puzzles: Puzzle[] = puzzlesByLocale.en ?? [];
export const categories: Category[] = categoriesByLocale.en ?? [];
