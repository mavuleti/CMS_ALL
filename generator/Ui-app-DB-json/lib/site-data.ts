import { BookOpen, Flower2, Shapes, type LucideIcon } from 'lucide-react';
import { getCollections } from './export-content';
import { puzzleIdFromHref } from './puzzle-id';

export type Puzzle = { id: string; name: string; category: string; age: string; dots: number; difficulty: 1 | 2 | 3; image: string; href: string; isNew?: boolean };
export type Category = { id: string; name: string; count: number; description: string; color: string; Icon: LucideIcon; href?: string; badge?: string };

const exportCollections = getCollections();
// These values are foreground accents (icons, headings, and borders). Soft
// backgrounds are derived from them with color-mix in CSS, so the source
// colors need enough contrast to remain readable on white cards.
const palette = ['#2774b8', '#9a6200', '#167968', '#b9365d', '#6845ad', '#ad5520'];
const categoryAccents: Partial<Record<string, string>> = {
  flowers: '#a83278',
  ocean: '#087c8f'
};

export const puzzles: Puzzle[] = exportCollections.flatMap((collection) => collection.puzzles.map((puzzle) => {
  const href = `/${collection.slug}/${puzzle.slug}/`;
  return { id: puzzleIdFromHref(href), name: puzzle.name, category: collection.body.name ?? collection.slug, age: puzzle.age ?? '', dots: puzzle.dots ?? 0, difficulty: puzzle.difficulty, image: puzzle.image ?? '', href };
}));

export const categories: Category[] = [
  ...exportCollections.map((collection, index) => ({ id: collection.slug === 'usa-250' ? 'usa250' : collection.slug, name: collection.body.name ?? collection.slug, count: collection.puzzles.length, description: collection.body.description ?? '', color: categoryAccents[collection.slug] ?? palette[index % palette.length], Icon: collection.slug === 'flowers' ? Flower2 : Shapes, href: `/${collection.slug}/` })),
  { id: 'blog', name: 'Blog', count: 0, description: 'Learning guides and activity ideas.', color: '#fff0c7', Icon: BookOpen, href: '/blog/' }
];
