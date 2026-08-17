import { categoriesForLocale, type Category } from '@/lib/site-data';

export function getActiveCategories(locale: string): Category[] {
  return categoriesForLocale(locale).filter((category) => Boolean(category.href)).sort((a, b) => b.count - a.count);
}
