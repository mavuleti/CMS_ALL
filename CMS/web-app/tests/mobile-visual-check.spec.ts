import { expect, test } from '@playwright/test';

const devices = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'pixel-5', width: 393, height: 851 },
  { name: 'tablet', width: 768, height: 1024 }
];

test.describe('mobile visual diagnostics', () => {
  for (const device of devices) {
    test(`capture ${device.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      const metrics = await page.evaluate(() => {
        const hero = document.querySelector('.hero')?.getBoundingClientRect();
        const h1 = document.querySelector('h1')?.getBoundingClientRect();
        const nav = document.querySelector('.nav-shell')?.getBoundingClientRect();
        const image = document.querySelector('.hero-card img')?.getBoundingClientRect();

        return {
          viewportWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          heroHeight: Math.round(hero?.height ?? 0),
          h1Height: Math.round(h1?.height ?? 0),
          navHeight: Math.round(nav?.height ?? 0),
          imageTop: Math.round(image?.top ?? 0),
          imageHeight: Math.round(image?.height ?? 0)
        };
      });

      await testInfo.attach(`${device.name}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });

      console.log(`${device.name}: ${JSON.stringify(metrics)}`);
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    });
  }
});
