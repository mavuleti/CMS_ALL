import { categories, type Category } from '@/lib/site-data';
import { isSectionAvailable } from '@/lib/section-locales';

/**
 * Categories that have a real listing page for this locale, in the same
 * order/priority used by the homepage CategoryGrid — sorted by puzzle count
 * (most content first), with tie-breaks preserving declaration order.
 *
 * Used by CategoryGrid (in-page tiles) so the category list stays
 * consistent without duplicating the availability rules.
 */
export function getActiveCategories(locale: string): Category[] {
  return categories
    .filter((category) => !!category.href)
    .filter((category) => !(category.id === 'usa250' && !isSectionAvailable(locale, 'usa-250/')))
    .filter((category) => !(category.id === 'flowers' && !isSectionAvailable(locale, 'flowers/')))
    .filter((category) => !(category.id === 'canada' && !isSectionAvailable(locale, 'canada/')))
    .filter((category) => !(category.id === 'circus' && !isSectionAvailable(locale, 'circus/')))
    .filter((category) => !(category.id === 'space' && !isSectionAvailable(locale, 'space/')))
    .map((category, index) => ({ category, index }))
    .sort((a, b) => b.category.count - a.category.count || a.index - b.index)
    .map(({ category }) => category);
}
