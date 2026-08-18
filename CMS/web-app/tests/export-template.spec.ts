import { expect, test } from '@playwright/test';

test.describe('JSON export common templates', () => {
  test('collection renders exported copy, metadata, and dynamic puzzle cards', async ({ page }) => {
    await page.goto('/en/flowers/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Flower Dot-to-Dot Printables for Kids');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /free flower dot-to-dot printables/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', '20 Free Flower Connect the Dots Worksheets for Kids');
    await expect(page.locator('.puzzle-card')).toHaveCount(20);
    await expect(page.getByRole('link', { name: /Flax Flower/i }).first()).toHaveAttribute('href', '/en/flowers/flax-flower-dot-to-dot-puzzle/');
  });

  test('puzzle renders exported copy and keeps inherited assets and controls', async ({ page }) => {
    await page.goto('/en/flowers/flax-flower-dot-to-dot-puzzle/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Flax Flower Dot to Dot: Print a 90-Dot Blue Bloom PDF');
    await expect(page.locator('.fun-fact-box').getByText(/Flax stems contain strong fibres/)).toBeVisible();
    await expect(page.locator('.puzzle-preview-card img')).toHaveAttribute('src', /flower-flax-flower-puzzle/);
    await expect(page.getByRole('link', { name: /download/i }).first()).toHaveAttribute('href', /flower-flax-flower-dot-to-dot-printable/);
    await expect(page.getByRole('link', { name: 'Flowers', exact: true }).first()).toHaveAttribute('href', '/en/flowers/');
  });

  test('collection and puzzle do not overflow the viewport', async ({ page }) => {
    for (const path of ['/en/flowers/', '/en/flowers/flax-flower-dot-to-dot-puzzle/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
