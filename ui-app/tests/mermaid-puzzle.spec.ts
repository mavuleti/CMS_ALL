import { expect, test } from '@playwright/test';

const locales = ['en', 'ar'] as const;
const slug = 'mermaid-dot-to-dot-puzzle';

for (const locale of locales) {
  test.describe(`${locale} Mermaid puzzle functionality`, () => {
    const puzzleUrl = `/${locale}/ocean/${slug}/`;

    test.beforeEach(async ({ page }) => {
      await page.goto(puzzleUrl, { waitUntil: 'domcontentloaded' });
    });

    test('renders the printable, puzzle details, and localized direction', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/mermaid|حورية/i);
      await expect(page.locator('.puzzle-preview-card img')).toHaveAttribute('src', /mermaid-puzzle/);
      await expect(page.locator('.meta-chips')).toContainText(/54/);
      await expect(page.locator('.fun-fact-box')).toBeVisible();
    });

    test('opens the printable PDF from the primary download button', async ({ page, request, baseURL }) => {
      const download = page.locator('a.download-btn').first();
      const expectedHref = locale === 'ar'
        ? '/ocean/mermaid-dot-to-dot-printable-horizontal_A4.pdf'
        : '/ocean/mermaid-dot-to-dot-printable-horizontal.pdf';
      await expect(download).toHaveAttribute('href', expectedHref);
      const href = await download.getAttribute('href');
      const response = await request.get(new URL(href!, baseURL ?? 'http://127.0.0.1:4444').toString());
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');

      // The link carries both target="_blank" and a `download` attribute;
      // Chromium honors `download` and saves the file directly rather than
      // opening a new tab, so the click surfaces as a `download` event, not
      // a new page.
      const downloadPromise = page.waitForEvent('download');
      await download.click();
      const pdfDownload = await downloadPromise;
      expect(pdfDownload.url()).toContain(expectedHref);
    });

    test('offers responsive sharing controls', async ({ page }) => {
      if ((page.viewportSize()?.width ?? 1280) <= 980) {
        await expect(page.locator('.mobile-share-toggle .desktop-social-link--share')).toBeVisible();
      } else {
        await expect(page.locator('.floating-share .floating-share-link').first()).toBeVisible();
        await expect(page.locator('.floating-share button.floating-share-link')).toBeVisible();
      }
    });

    test('breadcrumb navigates back to the Ocean collection', async ({ page }) => {
      await page.locator('nav.breadcrumb').getByRole('link').nth(1).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/ocean/$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('a related puzzle card opens another ocean puzzle', async ({ page }) => {
      const related = page.locator('section').filter({ has: page.locator('.puzzle-grid') }).first();
      const firstRelated = related.locator('article.puzzle-card').first();
      const href = await firstRelated.locator('a.puzzle-image').getAttribute('href');
      expect(href).toMatch(new RegExp(`^/${locale}/ocean/(?!${slug})`));
      await firstRelated.locator('a.puzzle-image').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/ocean/(?!${slug})[^/]+/$`));
    });

    test('FAQ expands when its question is clicked', async ({ page }) => {
      const faq = page.locator('details').first();
      await faq.locator('summary').click();
      await expect(faq).toHaveAttribute('open', '');
      await expect(faq.locator('p')).toBeVisible();
    });

    test('publishes canonical, social, breadcrumb, and puzzle schema', async ({ page }) => {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href', `https://dottodotfreeprintables.com${puzzleUrl}`
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /mermaid-puzzle/);
      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent || '{}'))
      );
      expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);
      expect(schemas.some((schema) => {
        const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
        return types.includes('CreativeWork') && /mermaid|حورية/i.test(schema.name);
      })).toBe(true);
    });

    test('has no horizontal overflow at the active device size', async ({ page }) => {
      const dimensions = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth
      }));
      expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
    });
  });
}
