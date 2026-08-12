import { categories, type Category } from '@/lib/site-data';

export function getActiveCategories(locale: string): Category[] {
  return locale === 'en'
    ? categories.filter((category) => Boolean(category.href)).sort((a, b) => b.count - a.count)
    : [];
}
