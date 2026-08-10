# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: i18n-layout.spec.ts >> Arabic regional alias hreflang cluster >> home pages are self-canonical, RTL, and share identical alternates
- Location: tests\i18n-layout.spec.ts:290:7

# Error details

```
Error: /ar-AE/ html lang

expect(locator).toHaveAttribute(expected) failed

Locator:  locator('html')
Expected: "ar-AE"
Received: "en"
Timeout:  5000ms

Call log:
  - /ar-AE/ html lang with timeout 5000ms
  - waiting for locator('html')
    3 × locator resolved to <html lang="en">…</html>
      - unexpected value "en"
    10 × locator resolved to <html lang="en" dir="ltr">…</html>
       - unexpected value "en"

```

```yaml
- document:
  - alert: Free Dot to Dot Printables for Kids | Connect the Dots Worksheets PDF
  - link "Skip to main content":
    - /url: "#main-content"
  - banner
  - main
  - contentinfo
```

# Test source

```ts
  196 | 
  197 |       test(`${name}: no horizontal overflow`, async ({ page }) => {
  198 |         await page.goto(url);
  199 |         const overflow = await page.evaluate(() => ({
  200 |           scrollWidth: document.documentElement.scrollWidth,
  201 |           clientWidth: document.documentElement.clientWidth
  202 |         }));
  203 |         expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  204 |       });
  205 | 
  206 |       test(`${name}: h1 is visible`, async ({ page }) => {
  207 |         await page.goto(url);
  208 |         await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  209 |       });
  210 | 
  211 |       test(`${name}: lang, canonical, and hreflang are correct`, async ({ page }) => {
  212 |         await page.goto(url);
  213 | 
  214 |         await expect(page.locator('html')).toHaveAttribute('lang', htmlLangByLocale[locale] ?? locale);
  215 | 
  216 |         const normalizedPath = pagePath || '/';
  217 |         const expectedCanonicalPath = withTrailingSlash(normalizedPath === '/' ? `/${locale}/` : `/${locale}${normalizedPath}`);
  218 |         const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  219 |         expect(canonicalHref, `canonical link missing on ${url}`).not.toBeNull();
  220 |         expect(new URL(canonicalHref!, page.url()).pathname).toBe(expectedCanonicalPath);
  221 | 
  222 |         for (const hreflang of effectiveHreflangLocales) {
  223 |           const expectedPath = withTrailingSlash(normalizedPath === '/' ? `/${hreflang}/` : `/${hreflang}${normalizedPath}`);
  224 |           const href = await page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`).getAttribute('href');
  225 |           expect(href, `hreflang ${hreflang} missing on ${url}`).not.toBeNull();
  226 |           expect(new URL(href!, page.url()).pathname).toBe(expectedPath);
  227 |         }
  228 | 
  229 |         const defaultHref = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
  230 |         expect(defaultHref, `x-default hreflang missing on ${url}`).not.toBeNull();
  231 |         expect(new URL(defaultHref!, page.url()).pathname).toBe(
  232 |           withTrailingSlash(normalizedPath === '/' ? `/${sourceLocale}/` : `/${sourceLocale}${normalizedPath}`)
  233 |         );
  234 |       });
  235 | 
  236 |       test(`${name}: matches visual baseline`, async ({ page }) => {
  237 |         test.skip(!runVisualBaselines, 'Set I18N_VISUAL_BASELINE=1 to run screenshot baseline checks.');
  238 |         await page.addInitScript(() => {
  239 |           const originalSetInterval = window.setInterval;
  240 |           window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
  241 |             if (timeout === 4000) return 0;
  242 |             return originalSetInterval(handler, timeout, ...args);
  243 |           }) as typeof window.setInterval;
  244 |         });
  245 |         await page.goto(url);
  246 |         await page.waitForLoadState('networkidle');
  247 |         await page.waitForTimeout(500);
  248 |         await expect(page).toHaveScreenshot(`${name}-${locale}.png`, {
  249 |           fullPage: true,
  250 |           mask: [
  251 |             page.locator('[aria-label="Featured USA 250 printable preview"]')
  252 |           ],
  253 |           timeout: 15_000
  254 |         });
  255 |       });
  256 |     }
  257 |   });
  258 | 
  259 |   if (locale !== sourceLocale && translatedLocales.includes(locale)) {
  260 |     test.describe(`${locale} — English leakage`, () => {
  261 |       for (const { name, path: pagePath } of keyPages) {
  262 |         test(`${name}: no untranslated English marker strings visible`, async ({ page }) => {
  263 |           await page.goto(`/${locale}${pagePath}/`);
  264 |           const bodyText = await page.evaluate(() => document.body.innerText);
  265 | 
  266 |           for (const marker of englishMarkers) {
  267 |             expect(bodyText, `found English string "${marker}" on /${locale}${pagePath}/`).not.toContain(marker);
  268 |           }
  269 |         });
  270 |       }
  271 |     });
  272 |   }
  273 | }
  274 | 
  275 | test.describe('Arabic regional alias hreflang cluster', () => {
  276 |   const pages = [
  277 |     { locale: 'ar', url: '/ar/' },
  278 |     { locale: 'ar-AE', url: '/ar-AE/' },
  279 |     { locale: 'ar-SA', url: '/ar-SA/' },
  280 |     { locale: 'ar-QA', url: '/ar-QA/' }
  281 |   ];
  282 | 
  283 |   const expectedArabicAlternates = {
  284 |     ar: '/ar/',
  285 |     'ar-AE': '/ar-AE/',
  286 |     'ar-SA': '/ar-SA/',
  287 |     'ar-QA': '/ar-QA/'
  288 |   };
  289 | 
  290 |   test('home pages are self-canonical, RTL, and share identical alternates', async ({ page }) => {
  291 |     let baseline: Record<string, string> | null = null;
  292 | 
  293 |     for (const { locale, url } of pages) {
  294 |       await page.goto(url, { waitUntil: 'domcontentloaded' });
  295 | 
> 296 |       await expect(page.locator('html'), `${url} html lang`).toHaveAttribute('lang', locale);
      |                                                              ^ Error: /ar-AE/ html lang
  297 |       await expect(page.locator('html'), `${url} html dir`).toHaveAttribute('dir', 'rtl');
  298 | 
  299 |       const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  300 |       expect(canonicalHref, `${url} canonical link missing`).not.toBeNull();
  301 |       expect(new URL(canonicalHref!, page.url()).pathname).toBe(url);
  302 | 
  303 |       const alternates = await alternateMap(page);
  304 | 
  305 |       for (const [hreflang, expectedPath] of Object.entries(expectedArabicAlternates)) {
  306 |         expect(alternates[hreflang], `${url} ${hreflang} alternate`).toBe(expectedPath);
  307 |       }
  308 | 
  309 |       if (!baseline) {
  310 |         baseline = alternates;
  311 |       } else {
  312 |         expect(alternates, `${url} hreflang cluster differs from /ar/`).toEqual(baseline);
  313 |       }
  314 |     }
  315 |   });
  316 | 
  317 |   test('nested pages preserve the same Arabic path in every regional alternate', async ({ page }) => {
  318 |     const suffix = 'blog/benefits-of-dot-to-dot-puzzles-for-kids/';
  319 | 
  320 |     for (const { locale, url } of pages) {
  321 |       await page.goto(`${url}${suffix}`, { waitUntil: 'domcontentloaded' });
  322 | 
  323 |       const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  324 |       expect(canonicalHref, `${locale} nested canonical link missing`).not.toBeNull();
  325 |       expect(new URL(canonicalHref!, page.url()).pathname).toBe(`/${locale}/${suffix}`);
  326 | 
  327 |       const alternates = await alternateMap(page);
  328 | 
  329 |       for (const hreflang of arabicLocales) {
  330 |         expect(alternates[hreflang], `${locale} nested ${hreflang} alternate`).toBe(`/${hreflang}/${suffix}`);
  331 |       }
  332 |     }
  333 |   });
  334 | });
  335 | 
  336 | for (const locale of allPagesAlignmentLocales) {
  337 |   test.describe(`${locale} all pages alignment`, () => {
  338 |     for (const route of allPagesAlignmentRoutes[locale]) {
  339 |       test(`${route}: no overflow or clipped primary UI`, async ({ page }) => {
  340 |         await page.goto(route);
  341 | 
  342 |         await expect(page.locator('header.site-header nav.nav-shell')).toBeVisible();
  343 |         await expect(page.locator('main')).toBeVisible();
  344 |         await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  345 |         await expect(page.locator('html')).toHaveAttribute('lang', htmlLangByLocale[locale] ?? locale);
  346 | 
  347 |         const layout = await page.evaluate(() => {
  348 |           const viewportWidth = document.documentElement.clientWidth;
  349 |           const documentOverflow = document.documentElement.scrollWidth - viewportWidth;
  350 |           const visibleElements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
  351 |             .filter((element) => {
  352 |               const style = window.getComputedStyle(element);
  353 |               const rect = element.getBoundingClientRect();
  354 |               return (
  355 |                 style.visibility !== 'hidden' &&
  356 |                 style.display !== 'none' &&
  357 |                 rect.width > 0 &&
  358 |                 rect.height > 0 &&
  359 |                 !element.closest('.hero-slider-track') &&
  360 |                 !element.closest('.form-honeypot') &&
  361 |                 !element.closest('.category-menu-bar') &&
  362 |                 !element.closest('.lang-switcher')
  363 |               );
  364 |             });
  365 | 
  366 |           const horizontalOverflows = visibleElements
  367 |             .map((element) => {
  368 |               const rect = element.getBoundingClientRect();
  369 |               return {
  370 |                 tag: element.tagName.toLowerCase(),
  371 |                 className: String(element.className || ''),
  372 |                 text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
  373 |                 left: Math.round(rect.left),
  374 |                 right: Math.round(rect.right),
  375 |                 width: Math.round(rect.width)
  376 |               };
  377 |             })
  378 |             .filter((item) => item.left < -1 || item.right > viewportWidth + 1);
  379 | 
  380 |           const clippedControls = visibleElements
  381 |             .filter((element) => {
  382 |               const tagName = element.tagName.toLowerCase();
  383 |               const role = element.getAttribute('role');
  384 |               const className = String(element.className || '');
  385 |               return (
  386 |                 (tagName === 'button' || role === 'button' || element.classList.contains('btn') || className.includes('button')) &&
  387 |                 !element.classList.contains('icon-tooltip') &&
  388 |                 !element.closest('.category-card')
  389 |               );
  390 |             })
  391 |             .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
  392 |             .map((element) => ({
  393 |               tag: element.tagName.toLowerCase(),
  394 |               className: String(element.className || ''),
  395 |               text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
  396 |               scrollWidth: element.scrollWidth,
```