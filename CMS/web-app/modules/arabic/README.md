# modules/arabic — Arabic (ar) RTL module (Phase A, isolated)

Standalone scaffold for eventual Arabic locale support. Nothing in this
module is wired into the live site yet: `ar` is **not** in
`i18n/routing.ts`, **not** in `FULLY_TRANSLATED_LOCALES`
(`app/[locale]/layout.tsx`), and does not appear in `public/sitemap.xml`
or `lib/seo.ts` alternates. See MERGE_PLAN.md at the repo root for the
steps that activate it later.

## What's here

- `rtl.css` — RTL-only style overrides, scoped under `[dir="rtl"]`.
  Prefers CSS logical properties; only overrides selectors that are
  genuinely direction-sensitive (nav, badges, breadcrumbs, forms, puzzle
  meta rows, download buttons).
- `RtlProvider.tsx` — a plain wrapper component that sets `dir="rtl"
  lang="ar"` on its own element. No dependency on next-intl or routing.
- `README.md` — this file.

Content scaffolding lives in `content/ar/` (sibling to `content/en/`,
`content/tr/`, etc.) with the same file shape as every other locale:
`messages.json`, `blog.json`, and the four `puzzles-*.json` files. Every
key matches `content/en/` exactly; values are English-fallback text (same
approach used for locales mid-translation), so `npm run validate:i18n`
passes with 0 missing/empty/broken-ICU errors for `ar` — you'll only see
"identical" warnings, which is expected and non-blocking.

## How isolation is enforced

Two build scripts scan `content/` directly rather than going through
`i18n/routing.ts`, so they were hardened with a one-line intersection
filter (`routing.locales.includes(locale)`) to guarantee a
`content/<locale>` directory alone can never leak into public output:

- `scripts/generate-sitemap.mjs` — sitemap/hreflang generation
- `scripts/run-mobile-alignment-locales.mjs` — default locale sweep for
  Playwright mobile-alignment tests

This filter is a no-op for all 17 existing locales (they're all already
in `routing.locales`) and was verified to produce a byte-identical
`public/sitemap.xml` before/after. `scripts/validate-i18n-keys.mjs` is
intentionally left untouched — it's a dev-only report, not a public
artifact, so validating `ar` there is harmless and desirable (it's how we
confirm key parity).

## How to test standalone

1. `npm run dev`
2. Visit `http://localhost:3000/rtl-preview/`

That route (`app/rtl-preview/page.tsx`) renders a nav sample, a hero
sample, a 3-card puzzle grid, and a blog post excerpt, all wrapped in
`RtlProvider` with `modules/arabic/rtl.css` imported. It reads directly
from `content/ar/*.json`, so any content edits show up immediately. It is
not linked from site navigation and carries `robots: noindex`.

Automated coverage: `tests/rtl-preview.spec.ts` (run via
`npx playwright test tests/rtl-preview.spec.ts`, or `npm run test:e2e --
tests/rtl-preview.spec.ts`). It checks the `dir`/`lang` attributes,
logical-property mirroring (nav, puzzle meta, breadcrumb, download
button), and includes an isolation guard that fails if `ar` ever
accidentally shows up in `i18n/routing.ts`, `FULLY_TRANSLATED_LOCALES`,
or `public/sitemap.xml` before Phase B is intentionally executed.

## How the later merge works (summary)

Full detail in `MERGE_PLAN.md`. Short version:

1. `app/[locale]/layout.tsx` sets `dir` conditionally on the real
   `<html>` element instead of relying on `RtlProvider`.
2. `rtl.css` moves into the global style pipeline (imported from
   `app/globals.css` or the locale layout), still scoped to `[dir="rtl"]`
   so it's a no-op for every other locale.
3. `ar` is added to `i18n/routing.ts` locales and to
   `FULLY_TRANSLATED_LOCALES` — one line each.
4. `lib/seo.ts` gets the geo-variant hreflang alternates
   (`ar-AE`/`ar-SA`/`ar-QA`) alongside the base `ar` entry.
5. `RtlProvider.tsx` and `app/rtl-preview/page.tsx` can be deleted once
   the real locale is live (or kept for future isolated component QA).

## Reversibility

Deleting `modules/arabic/` and `content/ar/` (and the `app/rtl-preview/`
route) fully removes the feature. No other file's *behavior* changes as
a result — `scripts/generate-sitemap.mjs` and
`scripts/run-mobile-alignment-locales.mjs` keep their routing.locales
guard permanently (harmless once `content/ar/` is gone), and no existing
locale file, `lib/seo.ts`, or `i18n/routing.ts` was touched.
