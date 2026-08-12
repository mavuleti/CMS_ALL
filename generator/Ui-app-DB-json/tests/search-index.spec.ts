import { expect, test } from '@playwright/test';

const cases = [
  {
    locale: 'en',
    name: 'English Search Test Puzzle',
    category: 'Dinosaurs',
    href: '/en/dinosaurs/english-search-test-puzzle/'
  },
  {
    locale: 'es',
    name: 'Rompecabezas de prueba español',
    category: 'Dinosaurios',
    href: '/es/dinosaurs/rompecabezas-prueba/'
  }
] as const;

for (const localeCase of cases) {
  test(`${localeCase.locale} homepage loads its search index lazily and keeps locale links correct`, async ({ page }) => {
    let indexRequests = 0;

    await page.route(`**/search-index/${localeCase.locale}.json`, async (route) => {
      indexRequests += 1;
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{
          id: `${localeCase.locale}-search-test`,
          slug: `${localeCase.locale}-search-test`,
          name: localeCase.name,
          category: localeCase.category,
          categoryKey: 'dinosaurs',
          href: localeCase.href,
          image: '/images/trex-61-puzzle.webp',
          difficulty: 2,
          dots: 61,
          age: 'Ages 6-9',
          isNew: false
        }])
      });
    });

    await page.goto(`/${localeCase.locale}/`, { waitUntil: 'networkidle' });
    expect(indexRequests).toBe(0);

    const searchInput = page.locator('.discovery-search input');
    await searchInput.focus();
    await expect.poll(() => indexRequests).toBe(1);

    await searchInput.fill(localeCase.name);
    const resultLink = page.locator('.discovery-card h2 a', { hasText: localeCase.name });
    await expect(resultLink).toBeVisible();
    await expect(resultLink).toHaveAttribute('href', localeCase.href);
    expect(await resultLink.getAttribute('href')).not.toContain(`/${localeCase.locale}/${localeCase.locale}/`);

    await page.locator('.discovery-filters .filter-medium').click();
    expect(indexRequests).toBe(1);
  });
}
