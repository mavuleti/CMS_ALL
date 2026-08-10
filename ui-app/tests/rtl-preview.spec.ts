import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/* ═══════════════════════════════════════════════════════════════════════════
   RTL PREVIEW — Arabic module QA
   -----------------------------------------------------------------------
   Covers /rtl-preview/ (app/rtl-preview/page.tsx), which renders sample
   markup wrapped in modules/arabic/RtlProvider.tsx + modules/arabic/rtl.css.
   This route is intentionally outside app/[locale]/ and is not linked from
   site navigation — it's a lightweight, no-server-render-needed way to QA
   RTL CSS in isolation. Now that 'ar' is actually routed (see the "Phase B
   activation" and "soft-launch" describe blocks below), the real /ar/
   pages are the primary way to QA end-to-end, but this route is still
   useful for quick CSS-only iteration.

   The describe blocks below verify the current, intentional state:
   'ar' is live and statically generated, but deliberately kept out of the
   sitemap/hreflang/OG alternates/language switcher and marked noindex
   until it's ready to be formally announced (a "soft launch"). These
   tests fail loudly if that staged-rollout state ever drifts by
   accident — e.g. 'ar' silently disappearing from routing, or silently
   graduating into the sitemap without anyone updating PLACEHOLDER_LOCALES
   on purpose.
═══════════════════════════════════════════════════════════════════════════ */

const repoRoot = path.resolve(__dirname, '..');

test.describe('RTL preview route — /rtl-preview/', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rtl-preview/');
  });

  test('loads and shows the internal QA banner', async ({ page }) => {
    await expect(page.getByTestId('preview-banner')).toBeVisible();
    await expect(page.getByTestId('preview-banner')).toContainText(/English-fallback placeholder/i);
  });

  test('page is marked noindex', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/i);
  });

  test('root RTL wrapper sets dir="rtl" and lang="ar"', async ({ page }) => {
    const wrapper = page.locator('.rtl-provider');
    await expect(wrapper).toHaveAttribute('dir', 'rtl');
    await expect(wrapper).toHaveAttribute('lang', 'ar');
  });

  test('the real document <html> element is NOT mutated by the preview', async ({ page }) => {
    // Phase A isolation: RtlProvider scopes dir/lang to its own wrapper
    // element only. The page's real <html> must stay whatever the root
    // layout sets (no dir="rtl" leak onto <html>).
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).not.toBe('rtl');
  });

  test('computed direction inside the wrapper is rtl', async ({ page }) => {
    const direction = await page.locator('.rtl-provider').evaluate((el) => getComputedStyle(el).direction);
    expect(direction).toBe('rtl');
  });

  test('nav renders and mirrors via flex-direction: row-reverse', async ({ page }) => {
    const nav = page.getByTestId('preview-nav').locator('.nav-shell');
    await expect(nav).toBeVisible();
    const flexDirection = await nav.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row-reverse');
  });

  test('hero renders sample copy and CTAs', async ({ page }) => {
    const hero = page.getByTestId('preview-hero');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(hero.locator('.hero-actions a')).toHaveCount(2);
  });

  test('puzzle grid renders 3 sample cards', async ({ page }) => {
    const cards = page.getByTestId('preview-puzzle-card');
    await expect(cards).toHaveCount(3);
  });

  test('puzzle card meta row (dot count / age) reverses under RTL', async ({ page }) => {
    const metaRow = page.getByTestId('preview-puzzle-card').first().locator('.puzzle-meta');
    const flexDirection = await metaRow.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row-reverse');
  });

  test('dot count uses Western digits (0-9), not Eastern Arabic-Indic numerals', async ({ page }) => {
    // See MERGE_PLAN.md QA checklist — this choice must be confirmed with
    // the user before Phase B ships; this test locks in the Phase A default
    // so a future change is deliberate, not accidental.
    const dotCount = await page.getByTestId('dot-count').first().textContent();
    expect(dotCount).toMatch(/^[0-9]+ dots$/);
    expect(dotCount).not.toMatch(/[٠-٩]/); // Eastern Arabic-Indic digit range
  });

  test('puzzle badge uses inset-inline-start (mirrors correctly under RTL)', async ({ page }) => {
    const badge = page.getByTestId('preview-puzzle-card').first().locator('.badge');
    await expect(badge).toBeVisible();
    const styles = await badge.evaluate((el) => {
      const computed = getComputedStyle(el);
      return { left: computed.left, right: computed.right };
    });
    // Under RTL with inset-inline-start: 16px, the browser resolves this to
    // the *right* edge, so `left` should no longer be pinned to 16px.
    expect(styles.left).not.toBe('16px');
  });

  test('download button renders and reverses icon/label order', async ({ page }) => {
    const button = page.getByTestId('preview-download-button').first();
    await expect(button).toBeVisible();
    const flexDirection = await button.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row-reverse');
  });

  test('breadcrumb renders and reverses trail order', async ({ page }) => {
    const breadcrumb = page.getByTestId('preview-breadcrumb');
    await expect(breadcrumb).toBeVisible();
    const flexDirection = await breadcrumb.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row-reverse');
  });

  test('blog post excerpt renders title, description, and sections', async ({ page }) => {
    const post = page.getByTestId('preview-blog-post');
    await expect(post).toBeVisible();
    await expect(post.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(post.locator('h2, p').first()).toBeVisible();
  });

  test('footer nav renders and reverses order', async ({ page }) => {
    const footerNav = page.getByTestId('preview-footer').locator('nav');
    await expect(footerNav).toBeVisible();
    const flexDirection = await footerNav.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row-reverse');
  });

  test('full-page visual snapshot (desktop)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'snapshot baseline only captured on desktop-chrome');
    await expect(page).toHaveScreenshot('rtl-preview-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});

test.describe('RTL preview — responsive smoke check', () => {
  const viewports = [
    { width: 375, height: 812, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 900, name: 'desktop' }
  ];

  for (const viewport of viewports) {
    test(`renders without horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/rtl-preview/');
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE B ACTIVATION GUARD — 'ar' is routed with real, translated Arabic
   content (content/ar/ passes npm run validate:i18n with 0 errors). It
   stays listed in PLACEHOLDER_LOCALES anyway — that flag no longer means
   "fallback text", it now gates the deliberate soft launch: excluded from
   hreflang/sitemap/OG alternates and the LanguageSwitcher dropdown, plus
   marked noindex (see app/[locale]/layout.tsx generateMetadata), until
   it's formally announced. Remove 'ar' from PLACEHOLDER_LOCALES (four
   places: layout.tsx, lib/seo.ts, blog/[slug]/page.tsx,
   scripts/generate-sitemap.mjs's KNOWN_FALLBACK_LOCALES) when that day
   comes — these tests will then need updating to assert the opposite.
═══════════════════════════════════════════════════════════════════════════ */
test.describe('Arabic locale - release activation', () => {
  test('ar IS in i18n/routing.ts locales', async () => {
    const routingSource = readFileSync(path.join(repoRoot, 'i18n', 'routing.ts'), 'utf8');
    const localesMatch = routingSource.match(/locales:\s*\[([^\]]*)\]/);
    expect(localesMatch).not.toBeNull();
    const locales = (localesMatch![1].match(/'([^']+)'/g) ?? []).map((s) => s.replace(/'/g, ''));
    expect(locales).toContain('ar');
  });

  test('ar is not listed as a PLACEHOLDER_LOCALE in layout.tsx, lib/seo.ts, or blog/[slug]/page.tsx', async () => {
    const layoutSource = readFileSync(path.join(repoRoot, 'app', '[locale]', 'layout.tsx'), 'utf8');
    const seoSource = readFileSync(path.join(repoRoot, 'lib', 'seo.ts'), 'utf8');
    const blogSource = readFileSync(path.join(repoRoot, 'app', '[locale]', 'blog', '[slug]', 'page.tsx'), 'utf8');
    for (const source of [layoutSource, seoSource, blogSource]) {
      expect(source).toMatch(/PLACEHOLDER_LOCALES:\s*string\[\]\s*=\s*\[\s*\]/);
      expect(source).not.toMatch(/PLACEHOLDER_LOCALES:\s*string\[\]\s*=\s*\[[^\]]*'ar'/);
    }
  });

  test('scripts/generate-sitemap.mjs treats ar availability the same way as every other locale', async () => {
    // generate-sitemap.mjs no longer hand-maintains locale lists at all (the
    // old KNOWN_FALLBACK_LOCALES array is gone) — it reads availability
    // straight from computeAvailability()/lib/section-locales.ts, the same
    // content-file-driven source the app itself uses. Assert that source,
    // not a since-removed implementation detail.
    const sitemapScript = readFileSync(path.join(repoRoot, 'scripts', 'generate-sitemap.mjs'), 'utf8');
    expect(sitemapScript).not.toMatch(/KNOWN_FALLBACK_LOCALES/);
    expect(sitemapScript).toMatch(/computeAvailability/);
  });

  test('public/sitemap-ar.xml contains Arabic canonical URLs but no regional-alias or USA-250 Arabic URLs', async () => {
    // sitemap.xml itself is just a <sitemapindex> pointing at per-locale
    // files (see scripts/generate-sitemap.mjs) — the actual <loc>/hreflang
    // entries live in sitemap-ar.xml.
    const sitemapPath = path.join(repoRoot, 'public', 'sitemap-ar.xml');
    test.skip(!existsSync(sitemapPath), 'sitemap-ar.xml not generated in this environment');
    const sitemap = readFileSync(sitemapPath, 'utf8');
    expect(sitemap).toContain('<loc>https://dottodotfreeprintables.com/ar/</loc>');
    expect(sitemap).toContain('hreflang="ar" href="https://dottodotfreeprintables.com/ar/"');
    expect(sitemap).toContain(
      'hreflang="ar" href="https://dottodotfreeprintables.com/ar/blog/benefits-of-dot-to-dot-puzzles-for-kids/"'
    );
    // ar-AE/ar-SA/ar-QA are compatibility aliases that canonicalize to /ar/
    // (see scripts/generate-sitemap.mjs) — submitting them as separate
    // sitemap/hreflang entries would be duplicate-content noise, so they must
    // never appear here at all.
    for (const locale of ['ar-AE', 'ar-SA', 'ar-QA']) {
      expect(sitemap).not.toContain(`/${locale}/`);
    }
    expect(sitemap).not.toContain('/ar/usa-250/');
  });

  test('ar is indexable (no locale-level noindex tag)', async ({ page }) => {
    await page.goto('/ar/', { waitUntil: 'domcontentloaded' });
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(0);
  });

  test('redesigned homepage no longer renders the legacy language dropdown', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('select.lang-select')).toHaveCount(0);
  });

  test('USA-250 hero slider and category tile are hidden on /ar/', async ({ page }) => {
    await page.goto('/ar/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.hero-slide--usa250')).toHaveCount(0);
    await expect(page.locator('.category-card--usa250')).toHaveCount(0);
  });

  test('out/ar/usa-250/ is not generated by the static export', async () => {
    // firebase.json has a blanket SPA-style rewrite ("**" -> /index.html) that
    // applies to every locale, not just 'ar' — so no route on this site ever
    // returns a true HTTP 4xx from Firebase Hosting, and asserting on response
    // status here would not mean what it looks like it means. The real
    // guarantee is that generateStaticParams excludes 'ar' for this route (see
    // app/[locale]/usa-250/page.tsx), so the file is never written at all.
    const usa250Dir = path.join(repoRoot, 'out', 'ar', 'usa-250');
    test.skip(!existsSync(path.join(repoRoot, 'out')), 'out/ not generated in this environment');
    expect(existsSync(usa250Dir)).toBe(false);
  });

  test('direct navigation to /ar/usa-250/ does not render USA-250 content', async ({ page }) => {
    await page.goto('/ar/usa-250/', { waitUntil: 'domcontentloaded' });
    // Falls through to the site's SPA-fallback shell (see firebase.json /
    // serve-static.mjs), not the real USA-250 page — confirm it's not showing
    // USA-250 content rather than asserting on HTTP status (see test above).
    // '[aria-labelledby="usa-250-video-title"]' is a section unique to the
    // real usa-250 page (app/[locale]/usa-250/page.tsx).
    await expect(page.locator('[aria-labelledby="usa-250-video-title"]')).toHaveCount(0);
  });

  test('USA-250 is NOT hidden for other locales (spot check: en)', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.category-card--usa250')).not.toHaveCount(0);
  });

  test('RTL CSS lives in exactly one place (modules/arabic/rtl.css), no duplicate block in globals.css', async () => {
    const globalsCss = readFileSync(path.join(repoRoot, 'app', 'globals.css'), 'utf8');
    const rtlCss = readFileSync(path.join(repoRoot, 'modules', 'arabic', 'rtl.css'), 'utf8');
    expect(globalsCss).toMatch(/@import\s+['"]\.\.\/modules\/arabic\/rtl\.css['"]/);
    // globals.css itself should not declare its own [dir="rtl"] rule block
    // (previously a duplicated copy lived at the bottom of this file).
    expect(globalsCss).not.toMatch(/\[dir="rtl"\]\s*\.hero\s*\{/);
    expect(rtlCss).toMatch(/\[dir='rtl'\]\s*\.hero\s*\{|\[dir="rtl"\]\s*\.hero\s*\{/);
  });

  test('Cairo font is actually loaded, not just declared', async () => {
    const rtlCss = readFileSync(path.join(repoRoot, 'modules', 'arabic', 'rtl.css'), 'utf8');
    // The stylesheet <link> intentionally lives in app/[locale]/layout.tsx,
    // gated on isArabic, rather than as an `@import` in rtl.css — an
    // unconditional @import here would fetch the font for all 30+ LTR
    // locales too (see the comment block above :lang(ar) in rtl.css).
    const layoutSource = readFileSync(path.join(repoRoot, 'app', '[locale]', 'layout.tsx'), 'utf8');
    expect(layoutSource).toMatch(/fonts\.googleapis\.com\/css2\?family=Cairo/);
    expect(rtlCss).toMatch(/:lang\(ar\)\s*\{[^}]*Cairo/);
  });

  test('ar messages.json plural strings use full Arabic CLDR categories, not just one/other', async () => {
    const messages = readFileSync(path.join(repoRoot, 'content', 'ar', 'messages.json'), 'utf8');
    // Each plural string is `{count, plural, zero {..} one {..} two {..} few {..} many {..} other {..}}` —
    // match through to the final `other {...}}` rather than stopping at the first closing brace.
    const pluralStrings = messages.match(/\{count, plural,[\s\S]*?other \{[^}]*\}\}/g) ?? [];
    expect(pluralStrings.length).toBeGreaterThan(0);
    for (const str of pluralStrings) {
      for (const category of ['zero', 'one', 'two', 'few', 'many', 'other']) {
        expect(str).toContain(`${category} {`);
      }
    }
  });

  test('content/ar exists with the full locale file set', async () => {
    const arDir = path.join(repoRoot, 'content', 'ar');
    expect(existsSync(arDir)).toBe(true);
    for (const file of ['messages.json', 'blog.json', 'puzzles-dinosaurs.json', 'puzzles-ocean.json', 'puzzles-playgrounds.json']) {
      expect(existsSync(path.join(arDir, file))).toBe(true);
    }
  });

  // usa-250 is US-specific and intentionally not translated for ar — see
  // lib/section-locales.ts. A locale opts out of a section by simply not
  // having its content file, so the absence itself is the expected state.
  test('content/ar has no puzzles-usa-250.json (usa-250 is intentionally excluded)', async () => {
    expect(existsSync(path.join(repoRoot, 'content', 'ar', 'puzzles-usa-250.json'))).toBe(false);
  });

  test('canonical Arabic route renders indexed RTL content', async ({ page }) => {
    await page.goto('/ar/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://dottodotfreeprintables.com/ar/');
  });

  test('existing locales (spot check: en, fr, tr) are unaffected — home page still renders', async ({ page }) => {
    const expectedHtmlLang: Record<string, string> = {
      en: 'en',
      fr: 'fr-FR',
      tr: 'tr-TR'
    };

    for (const locale of Object.keys(expectedHtmlLang)) {
      await page.goto(`/${locale}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', expectedHtmlLang[locale]);
      await expect(page.locator('html')).not.toHaveAttribute('dir', 'rtl');
    }
  });
});
