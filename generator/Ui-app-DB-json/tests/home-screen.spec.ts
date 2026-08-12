import { expect, test } from '@playwright/test';

const locales = ['en', 'ar'] as const;

// Puzzle names on the redesigned homepage's *featured* list (T-Rex, Mermaid,
// Jellyfish, …) are rendered in English even on /ar/. But typing a query or
// picking a filter loads the full catalog from public/search-index/{locale}.json
// (scripts/generate-search-index.mjs), which carries each locale's translated
// puzzle names — so search/filter results on /ar/ show Arabic names. The rest
// of these labels mirror the real strings from content/ar/messages.json
// (homepageUi / common / nav / purchase.ad namespaces) as rendered by
// components/HomeDiscovery.tsx.
const ui = {
  en: {
    h1: /find the perfect dot to dot printables/i,
    searchInputName: /search puzzles/i,
    searchButtonName: /^search$/i,
    mediumFilterName: /medium.*21/i,
    hardFilterName: /hard.*61/i,
    noResults: /no puzzles matched your search/i,
    save: (name: string) => new RegExp(`save ${name}`, 'i'),
    remove: (name: string) => new RegExp(`remove ${name}.*saved puzzles`, 'i'),
    printForFree: /download free printable/i,
    viewBook: /view book/i,
    browseByTheme: /browse by theme/i,
    mermaid: 'Mermaid',
    jellyfish: 'Jellyfish'
  },
  ar: {
    h1: /اعثر على أوراق توصيل النقاط المثالية للطباعة/,
    searchInputName: /بحث عن الألغاز/,
    searchButtonName: /^بحث$/,
    mediumFilterName: /متوسط.*21/,
    hardFilterName: /صعب.*61/,
    noResults: /لا توجد ألغاز مطابقة لبحثك/,
    save: (name: string) => new RegExp(`حفظ.*${name}`),
    remove: (name: string) => new RegExp(`إزالة.*${name}`),
    printForFree: /حمّل النسخة المجانية للطباعة/,
    viewBook: /عرض الكتاب/,
    browseByTheme: /تصفح حسب الموضوع/,
    mermaid: 'حورية البحر',
    jellyfish: 'قنديل البحر'
  }
} as const;

for (const locale of locales) {
  const labels = ui[locale];

  test.describe(`${locale} redesigned homepage`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.discovery-home')).toHaveAttribute('data-ready', 'true');
    });

    test('renders discovery content, restored content, and correct direction', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(page.getByRole('heading', { level: 1, name: labels.h1 })).toBeVisible();
      await expect(page.locator('.discovery-card')).toHaveCount(8);
      await expect(page.locator('#home-video-title')).toBeAttached();
      await expect(page.locator('#feedback')).toBeAttached();
      await expect(page.locator('details').first()).toBeAttached();
      await expect(page.locator('.ocean-pack-banner a')).toHaveAttribute('href', `/${locale}/premium/`);
    });

    test('publishes localized SEO, social metadata, and structured data', async ({ page }) => {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://dottodotfreeprintables.com/${locale}/`);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

      const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent || '{}'))
      );
      const byType = (type: string) => schemas.find((schema) => schema['@type'] === type);
      expect(byType('Organization')?.logo?.['@type']).toBe('ImageObject');
      expect(byType('CollectionPage')?.inLanguage).toBe(locale);
      expect(byType('ItemList')?.itemListElement).toHaveLength(8);
      expect(byType('FAQPage')?.mainEntity?.length).toBeGreaterThan(0);
    });

    test('emits GA4 events for homepage interactions', async ({ page }) => {
      await page.addInitScript(() => {
        (window as Window & { __gtagCalls?: unknown[][] }).__gtagCalls = [];
        window.gtag = (...args: unknown[]) => {
          (window as Window & { __gtagCalls?: unknown[][] }).__gtagCalls?.push(args);
        };
      });
      await page.reload();
      await expect(page.locator('.discovery-home')).toHaveAttribute('data-ready', 'true');

      await page.getByRole('textbox', { name: labels.searchInputName }).fill(labels.mermaid);
      await page.locator('.discovery-search').getByRole('button', { name: labels.searchButtonName }).click();
      await page.getByRole('button', { name: labels.mediumFilterName }).click();
      await page.getByRole('button', { name: labels.save(labels.mermaid) }).click();

      const calls = await page.evaluate(() => (window as Window & { __gtagCalls?: unknown[][] }).__gtagCalls ?? []);
      expect(calls).toEqual(expect.arrayContaining([
        ['event', 'search', expect.objectContaining({ search_term: labels.mermaid })],
        ['event', 'select_content', expect.objectContaining({ item_id: 'medium', action: 'apply' })],
        ['event', 'favorite_puzzle', expect.objectContaining({ action: 'save' })]
      ]));
    });

    test('search filters live, submits smoothly, and handles no results', async ({ page }) => {
      const search = page.locator('.discovery-search');
      const input = search.getByRole('textbox', { name: labels.searchInputName });

      await input.fill(labels.mermaid);
      await expect(page.locator('.discovery-card')).toHaveCount(1);
      await expect(page.locator('.discovery-card h2')).toHaveText(labels.mermaid);
      await search.getByRole('button', { name: labels.searchButtonName }).click();
      await expect(page.locator('.discovery-card')).toBeInViewport();

      await input.fill('not-a-real-puzzle');
      await expect(page.locator('.discovery-card')).toHaveCount(0);
      await expect(page.getByText(labels.noResults)).toBeVisible();

      await input.fill('');
      await expect(page.locator('.discovery-card')).toHaveCount(8);
    });

    test('difficulty filters toggle and combine with search', async ({ page }) => {
      const hard = page.getByRole('button', { name: labels.hardFilterName });
      await hard.click();
      await expect(hard).toHaveAttribute('aria-pressed', 'true');
      // Filtering searches the full site catalog, not just the 8 featured
      // puzzles, so this asserts "more than featured" rather than a fixed
      // number that would need updating every time a puzzle is added.
      // The catalog loads asynchronously (fetch of the search-index JSON),
      // so poll rather than taking a single synchronous count.
      await expect.poll(() => page.locator('.discovery-card').count()).toBeGreaterThan(8);
      await expect(page.getByRole('heading', { name: labels.mermaid })).toHaveCount(0);

      await page.getByRole('textbox', { name: labels.searchInputName }).fill(labels.jellyfish);
      await expect(page.locator('.discovery-card')).toHaveCount(1);

      await hard.click();
      await expect(hard).toHaveAttribute('aria-pressed', 'false');
    });

    test('favorite state persists after reload', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: labels.save('T-Rex') });
      await saveButton.click();
      await expect(page.getByRole('button', { name: labels.remove('T-Rex') })).toHaveAttribute('aria-pressed', 'true');

      await page.reload();
      await expect(page.locator('.discovery-home')).toHaveAttribute('data-ready', 'true');
      await expect(page.getByRole('button', { name: labels.remove('T-Rex') })).toHaveAttribute('aria-pressed', 'true');
    });

    test('Print button opens the selected puzzle page', async ({ page }) => {
      const firstCard = page.locator('.discovery-card').first();
      await expect(firstCard.getByRole('heading')).toContainText('T-Rex');
      await firstCard.getByRole('link', { name: labels.printForFree }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/dinosaurs/trex-61-dot-to-dot-puzzle/$`));
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    });

    test('Best of 2026 banner links to the premium book page', async ({ page }) => {
      await page.getByRole('link', { name: labels.viewBook }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/premium/$`));
    });

    test('FAQ and video buttons reveal their interactive content', async ({ page }) => {
      const firstFaq = page.locator('details').first();
      await firstFaq.locator('summary').click();
      await expect(firstFaq).toHaveAttribute('open', '');
      await expect(firstFaq.locator('p')).toBeVisible();

      const playButton = page.locator('#yt-player-z9wam99CxJ0 button[data-video-src]');
      await playButton.scrollIntoViewIfNeeded();
      await playButton.click();
      await expect(page.locator('#yt-player-z9wam99CxJ0 iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/z9wam99CxJ0/);
    });

    test('has no horizontal overflow and controls stay inside the viewport', async ({ page }) => {
      const result = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const controls = Array.from(document.querySelectorAll<HTMLElement>('button, input, a.discovery-print'))
          .filter((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
          });
        const clipped = controls.filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > viewportWidth + 1;
        }).map((element) => element.outerHTML.slice(0, 120));
        return {
          overflow: document.documentElement.scrollWidth - viewportWidth,
          clipped
        };
      });

      expect(result.overflow).toBeLessThanOrEqual(1);
      expect(result.clipped).toEqual([]);
    });

    test('responsive navigation works on the current device', async ({ page }) => {
      const viewport = page.viewportSize();
      if (viewport && viewport.width <= 980) {
        const menuButton = page.getByRole('button', { name: /open.*menu|categories|فتح قائمة الفئات/i }).first();
        await menuButton.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByRole('heading', { name: labels.browseByTheme })).toBeVisible();
      } else {
        await expect(page.locator('.category-menu-bar[data-home="true"]')).toBeVisible();
        await expect(page.locator(`.category-menu-bar a[href="/${locale}/"]`).first()).toBeVisible();
      }
    });
  });
}
