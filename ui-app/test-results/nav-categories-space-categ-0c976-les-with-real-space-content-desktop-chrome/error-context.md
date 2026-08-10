# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav-categories.spec.ts >> space category only appears for locales with real space content
- Location: tests\nav-categories.spec.ts:10:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: "space"
Received array: ["cute", "playgrounds", "dinosaurs", "ocean", "uae", "garden"]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { getActiveCategories } from '@/lib/nav-categories';
  3  | 
  4  | // Regression test for a bug where the Space category tile rendered on every
  5  | // locale's homepage even though only content/en/puzzles-space.json exists.
  6  | // getActiveCategories must hide a category for any locale that has no
  7  | // translated content file for it - space and circus both have partial
  8  | // locale coverage today, which is exactly the shape that bug slipped through.
  9  | 
  10 | test('space category only appears for locales with real space content', () => {
  11 |   const ids = (locale: string) => getActiveCategories(locale).map((c) => c.id);
  12 | 
  13 |   expect(ids('en')).toContain('space');
> 14 |   expect(ids('fr')).toContain('space');
     |                     ^ Error: expect(received).toContain(expected) // indexOf
  15 |   expect(ids('ja')).toContain('space');
  16 |   expect(ids('de')).not.toContain('space');
  17 | });
  18 | 
  19 | test('circus category respects per-locale content availability', () => {
  20 |   const ids = (locale: string) => getActiveCategories(locale).map((c) => c.id);
  21 | 
  22 |   // content/{ar,en,es,fi,ja}/puzzles-circus.json exist as of this writing.
  23 |   expect(ids('en')).toContain('circus');
  24 |   expect(ids('es')).toContain('circus');
  25 |   expect(ids('ar')).toContain('circus');
  26 |   expect(ids('fi')).toContain('circus');
  27 |   expect(ids('ja')).toContain('circus');
  28 |   expect(ids('de')).not.toContain('circus');
  29 | });
  30 | 
  31 | test('every returned category has an href and locale-appropriate ordering by count', () => {
  32 |   const categories = getActiveCategories('en');
  33 |   expect(categories.length).toBeGreaterThan(0);
  34 |   for (const category of categories) {
  35 |     expect(category.href).toBeTruthy();
  36 |   }
  37 |   for (let i = 1; i < categories.length; i++) {
  38 |     expect(categories[i - 1].count).toBeGreaterThanOrEqual(categories[i].count);
  39 |   }
  40 | });
  41 | 
```