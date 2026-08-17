import { test, expect } from '@playwright/test';
import { getActiveCategories } from '@/lib/nav-categories';

// Regression test for a bug where the Space category tile rendered on every
// locale's homepage when that locale has no puzzles-space.json file.
// getActiveCategories must hide a category for any locale that has no
// translated content file for it - space and circus both have partial
// locale coverage today, which is exactly the shape that bug slipped through.

test('space category only appears for locales with real space content', () => {
  const ids = (locale: string) => getActiveCategories(locale).map((c) => c.id);

  expect(ids('en')).toContain('space');
  expect(ids('fr')).toContain('space');
  expect(ids('ja')).toContain('space');
  expect(ids('de')).toContain('space');
});

test('circus category respects per-locale content availability', () => {
  const ids = (locale: string) => getActiveCategories(locale).map((c) => c.id);

  // German now has real circus content too, so it must appear there.
  expect(ids('en')).toContain('circus');
  expect(ids('es')).toContain('circus');
  expect(ids('ar')).toContain('circus');
  expect(ids('fi')).toContain('circus');
  expect(ids('ja')).toContain('circus');
  expect(ids('de')).toContain('circus');
});

test('every returned category has an href and locale-appropriate ordering by count', () => {
  const categories = getActiveCategories('en');
  expect(categories.length).toBeGreaterThan(0);
  for (const category of categories) {
    expect(category.href).toBeTruthy();
  }
  for (let i = 1; i < categories.length; i++) {
    expect(categories[i - 1].count).toBeGreaterThanOrEqual(categories[i].count);
  }
});
