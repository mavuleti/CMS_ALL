# Translation availability

There is no separate tracker/coverage file layer. Availability — "does this
locale really have a translated page here, or would a visitor see English
content instead?" — is derived directly from `content/<locale>/*.json` at
build time, in exactly two places:

- **`lib/section-locales.ts`** — is a whole *section* (flowers, canada,
  usa-250, ...) built for this locale at all? Read directly by the app
  (`generateStaticParams` in each section's `page.tsx`, the CategoryGrid tile
  filter in `components/sections.tsx`) and by `scripts/lib/translation-availability.mjs`.
  A section is available for a locale if and only if
  `content/<locale>/<section-file>.json` exists and is non-empty — no code
  branch decides this. To hide a section for a locale, for any reason
  (untranslated, or editorially irrelevant like `usa-250` for `ar`/`ru`),
  remove or empty that locale's content file for it. There is no other way
  to opt a locale out.
- **`scripts/lib/translation-availability.mjs`** — per-*page* availability
  (`computeAvailability()`), used only by `scripts/generate-sitemap.mjs` to
  decide which URLs and hreflang alternates to emit. It defers section-level
  decisions to `lib/section-locales.ts` so the two never disagree.

Both are computed fresh from `content/` every time — nothing is
hand-maintained, and there is no XML/HTML artifact to regenerate or go stale.

## Why no hardcoded per-locale lists

Before this, sections like Flowers/Canada were gated by hand-maintained
arrays (`FLOWER_TRANSLATED_LOCALES`, `CANADA_TRANSLATED_LOCALES`) duplicated
across `lib/*-data.ts`, `components/sections.tsx`, and the sitemap script.
These went stale silently — e.g. a locale stayed in the array after its
content file was deleted, so its build still tried (and failed, or produced
an empty section) rather than skipping cleanly. Deriving availability from
the content files themselves means there's nothing to keep in sync.

## Regenerating the sitemap

```
npm run generate:sitemap
```

`npm run build` calls this automatically. It reads `content/` directly (via
`translation-availability.mjs`) and writes `public/sitemap.xml` plus
`public/llms.txt` / `public/llms-full.txt`. No intermediate files.

## Reasons a page is "missing" (per-page, sitemap only)

`computeAvailability()`'s `statusFor(locale, path)` returns `{status:
'missing', reason}` for:

- `placeholder` — the whole locale is an English-fallback scaffold (see
  `PLACEHOLDER_LOCALES` in `lib/seo.ts`).
- `entry-missing` — the slug isn't in `content/<locale>/<file>.json`. For
  puzzles this means no page is built at all (`mergeLocalizedPuzzles` in
  `lib/puzzle-i18n.ts` drops it); for blog posts the post still renders with
  English text mixed in (`lib/blog-data.ts` falls back field-by-field).
- `guide-untranslated` — the entry exists but its `dotGuide` block, present
  in the English source, was left untranslated.
- `section-excluded` — the whole section isn't built for this locale at all
  (see `lib/section-locales.ts`). Not a translation gap — don't chase this
  one.

## Adding a new language

1. Add the locale to `i18n/routing.ts` and `content/<locale>/`.
2. Translate `messages.json` (partial content is fine — missing entries just
   won't appear in the sitemap/pages, nothing breaks).
3. Add per-section content files as you translate them
   (`content/<locale>/puzzles-flowers.json`, etc.) — sections with a
   non-empty file build automatically, no list to edit.
4. If a section should stay hidden for this locale, for any reason (like
   `usa-250` for `ar`/`ru` — US-specific content, not a translation gap),
   simply don't create/keep a content file for it. No file means no
   section, for both the app and the sitemap.
5. Run `npm run build` (or `npm run generate:sitemap` standalone) to confirm
   the sitemap picks up the new locale.

## Catching typos

`scripts/generate-sitemap.mjs` runs `findOrphanSlugs()` from
`translation-availability.mjs` on every build, which cross-checks every
locale's content files against `content/en/`: a slug present in a locale's
`puzzles-*.json` but absent from the English file (usually a typo or a stale
rename) is printed as a warning, not silently ignored.
