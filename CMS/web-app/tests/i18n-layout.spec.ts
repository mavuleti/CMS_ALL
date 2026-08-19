import { expect, test } from '@playwright/test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { routing } from '../i18n/routing';

/* ═══════════════════════════════════════════════════════════════════════════
   Locales & key pages under test
═══════════════════════════════════════════════════════════════════════════ */
const contentDir = path.resolve('content');
const exportDir = path.resolve('../mapping-check/export');
const sourceLocale = 'en';

const htmlLangByLocale: Record<string, string> = {
  az: 'az-AZ',
  en: 'en',
  fa: 'fa-IR',
  fr: 'fr-FR',
  es: 'es',
  de: 'de-DE',
  pt: 'pt-PT',
  it: 'it-IT',
  nl: 'nl-NL',
  sv: 'sv-SE',
  no: 'no-NO',
  pl: 'pl-PL',
  da: 'da-DK',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  hu: 'hu-HU',
  ro: 'ro-RO',
  tr: 'tr-TR',
  'pt-BR': 'pt-BR',
  el: 'el-GR',
  uk: 'uk-UA',
  hr: 'hr-HR',
  sk: 'sk-SK',
  lt: 'lt-LT',
  lv: 'lv-LV',
  sl: 'sl-SI',
  id: 'id-ID',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  th: 'th-TH',
  vi: 'vi-VN'
};

function readJson(filePath: string) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function isPlaceholderLocale(locale: string) {
  const homePath = path.join(exportDir, locale, 'home.json');
  if (!existsSync(homePath)) return true;
  const home = readJson(homePath);
  return !home?.body || Object.keys(home.body).length === 0;

  // Section files (e.g. puzzles-flowers.json, puzzles-canada.json) are only
  // written for locales that carry that section at all (see
  // lib/section-locales.ts) — a missing file means "no section," same as an
  // empty one, not a sign the whole locale is untranslated.
}

// content/ may hold locale folders staged ahead of being wired up (see
// i18n/README.md "Adding a new language" step 1: content lands before the
// locale is added to routing.ts) — those aren't real routes yet and the app
// never builds pages for them, so testing them here would just assert
// against a page that doesn't exist. Only test locales the app actually routes.
const routedLocaleSet = new Set<string>(routing.locales);
const allRoutedLocales = readdirSync(exportDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((locale) => routedLocaleSet.has(locale))
  .sort();

// Full 30+ locale sweep is expensive (this file drives the overwhelming
// majority of the suite's runtime — one test per locale x key page x
// alignment check). Default CI runs only en/ar for fast feedback; set
// I18N_FULL_LOCALE_SWEEP=1 to run every locale (e.g. a scheduled/nightly job
// or before a release) so the other locales aren't left permanently untested.
const fullLocaleSweep = process.env.I18N_FULL_LOCALE_SWEEP === '1';
const defaultSweepLocales = ['en', 'ar'];
const locales = fullLocaleSweep
  ? allRoutedLocales
  : allRoutedLocales.filter((locale) => defaultSweepLocales.includes(locale));
const translatedLocales = locales.filter((locale) => !isPlaceholderLocale(locale));
const effectiveHreflangLocales = translatedLocales;
const runVisualBaselines = process.env.I18N_VISUAL_BASELINE === '1';

const keyPages = [
  { name: 'home', path: '' },
  { name: 'dinosaurs', path: '/dinosaurs' },
  { name: 'dinosaur-detail', path: '/dinosaurs/trex-61-dot-to-dot-puzzle' },
  { name: 'ocean', path: '/ocean' },
  { name: 'blog', path: '/blog' }
];

function withTrailingSlash(pathname: string) {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function collectStaticHtmlRoutes(rootDir: string, routePrefix: string) {
  if (!existsSync(rootDir)) return [];

  const routes: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }

      if (entry.name !== 'index.html') continue;

      const relativeDir = path.relative(rootDir, dir).replace(/\\/g, '/');
      routes.push(relativeDir ? `${routePrefix}/${relativeDir}/` : `${routePrefix}/`);
    }
  };

  walk(rootDir);
  return routes.sort((a, b) => a.localeCompare(b));
}

const allPagesAlignmentLocales = translatedLocales;
const allPagesAlignmentRoutes = Object.fromEntries(
  allPagesAlignmentLocales.map((locale) => [
    locale,
    collectStaticHtmlRoutes(path.resolve('out', locale), `/${locale}`)
  ])
);

/* ═══════════════════════════════════════════════════════════════════════════
   English marker strings — used to catch whole-section English leakage on
   non-English locales (a locale whose messages.json override didn't apply)
═══════════════════════════════════════════════════════════════════════════ */
const enMessages = readJson(path.join(exportDir, sourceLocale, 'home.json')).body;

const englishMarkers = [
  enMessages.hero?.h1,
  enMessages.hero?.browsePuzzles,
  enMessages.categories?.heading,
  enMessages.puzzleSection?.heading,
  enMessages.homepageUi?.title,
  enMessages.homepageUi?.description,
  enMessages.homepageUi?.searchPlaceholder,
  enMessages.homepageUi?.featuredPuzzles,
  enMessages.homepageUi?.bookDescription
].filter((value): value is string => typeof value === 'string' && value.length >= 20);

/* ═══════════════════════════════════════════════════════════════════════════
   Layout & console-error checks — every locale x every key page
═══════════════════════════════════════════════════════════════════════════ */
for (const locale of locales) {
  test.describe(`${locale} — layout`, () => {
    for (const { name, path: pagePath } of keyPages) {
      const url = `/${locale}${pagePath}/`;

      test(`${name}: loads without console/page errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          const text = message.text();
          if (message.type() === 'error' && !text.includes('Failed to load resource')) {
            errors.push(text);
          }
        });

        await page.goto(url);
        expect(errors, `console/page errors on ${url}`).toEqual([]);
      });

      test(`${name}: no horizontal overflow`, async ({ page }) => {
        await page.goto(url);
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
      });

      test(`${name}: h1 is visible`, async ({ page }) => {
        await page.goto(url);
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      });

      test(`${name}: lang, canonical, and hreflang are correct`, async ({ page }) => {
        await page.goto(url);

        await expect(page.locator('html')).toHaveAttribute('lang', htmlLangByLocale[locale] ?? locale);

        const normalizedPath = pagePath || '/';
        const expectedCanonicalPath = withTrailingSlash(normalizedPath === '/' ? `/${locale}/` : `/${locale}${normalizedPath}`);
        const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
        expect(canonicalHref, `canonical link missing on ${url}`).not.toBeNull();
        expect(new URL(canonicalHref!, page.url()).pathname).toBe(expectedCanonicalPath);

        for (const hreflang of effectiveHreflangLocales) {
          const expectedPath = withTrailingSlash(normalizedPath === '/' ? `/${hreflang}/` : `/${hreflang}${normalizedPath}`);
          const href = await page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`).getAttribute('href');
          expect(href, `hreflang ${hreflang} missing on ${url}`).not.toBeNull();
          expect(new URL(href!, page.url()).pathname).toBe(expectedPath);
        }

        const defaultHref = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
        expect(defaultHref, `x-default hreflang missing on ${url}`).not.toBeNull();
        expect(new URL(defaultHref!, page.url()).pathname).toBe(
          withTrailingSlash(normalizedPath === '/' ? `/${sourceLocale}/` : `/${sourceLocale}${normalizedPath}`)
        );
      });

      test(`${name}: matches visual baseline`, async ({ page }) => {
        test.skip(!runVisualBaselines, 'Set I18N_VISUAL_BASELINE=1 to run screenshot baseline checks.');
        await page.addInitScript(() => {
          const originalSetInterval = window.setInterval;
          window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
            if (timeout === 4000) return 0;
            return originalSetInterval(handler, timeout, ...args);
          }) as typeof window.setInterval;
        });
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot(`${name}-${locale}.png`, {
          fullPage: true,
          mask: [
            page.locator('[aria-label="Featured USA 250 printable preview"]')
          ],
          timeout: 15_000
        });
      });
    }
  });

  if (locale !== sourceLocale && translatedLocales.includes(locale)) {
    test.describe(`${locale} — English leakage`, () => {
      for (const { name, path: pagePath } of keyPages) {
        test(`${name}: no untranslated English marker strings visible`, async ({ page }) => {
          await page.goto(`/${locale}${pagePath}/`);
          const bodyText = await page.evaluate(() => document.body.innerText);

          for (const marker of englishMarkers) {
            expect(bodyText, `found English string "${marker}" on /${locale}${pagePath}/`).not.toContain(marker);
          }
        });
      }
    });
  }
}

for (const locale of allPagesAlignmentLocales) {
  test.describe(`${locale} all pages alignment`, () => {
    for (const route of allPagesAlignmentRoutes[locale]) {
      test(`${route}: no overflow or clipped primary UI`, async ({ page }) => {
        await page.goto(route);

        await expect(page.locator('header.site-header nav.nav-shell')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', htmlLangByLocale[locale] ?? locale);

        const layout = await page.evaluate(() => {
          const viewportWidth = document.documentElement.clientWidth;
          const documentOverflow = document.documentElement.scrollWidth - viewportWidth;
          const visibleElements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
            .filter((element) => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return (
                style.visibility !== 'hidden' &&
                style.display !== 'none' &&
                rect.width > 0 &&
                rect.height > 0 &&
                !element.closest('.hero-slider-track') &&
                !element.closest('.form-honeypot') &&
                !element.closest('.category-menu-bar') &&
                !element.closest('.lang-switcher')
              );
            });

          const horizontalOverflows = visibleElements
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName.toLowerCase(),
                className: String(element.className || ''),
                text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              };
            })
            .filter((item) => item.left < -1 || item.right > viewportWidth + 1);

          const clippedControls = visibleElements
            .filter((element) => {
              const tagName = element.tagName.toLowerCase();
              const role = element.getAttribute('role');
              const className = String(element.className || '');
              return (
                (tagName === 'button' || role === 'button' || element.classList.contains('btn') || className.includes('button')) &&
                !element.classList.contains('icon-tooltip') &&
                !element.closest('.category-card')
              );
            })
            .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
            .map((element) => ({
              tag: element.tagName.toLowerCase(),
              className: String(element.className || ''),
              text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
              scrollHeight: element.scrollHeight,
              clientHeight: element.clientHeight
            }));

          return { documentOverflow, horizontalOverflows, clippedControls };
        });

        expect(layout.documentOverflow, `${route} document should not overflow horizontally`).toBeLessThanOrEqual(1);
        expect(layout.horizontalOverflows, `${route} elements outside viewport`).toEqual([]);
        expect(layout.clippedControls, `${route} clipped links/buttons`).toEqual([]);
      });
    }
  });
}
