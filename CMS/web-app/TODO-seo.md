# SEO / AEO / GEO — deferred items

Not done — needs a call before implementing.

- [x] **1200px srcset + OG image for puzzle images** — done 2026-08-19.
      The 800px web originals turned out not to be the highest-resolution
      source: every puzzle's print PDF embeds a 300dpi (2550x3300 or
      3300x2550) JPEG of the same artwork. `scripts/generate-1200px-puzzle-images.mjs`
      extracts that embedded image, isolates the artwork from the page's
      fixed-position footer/QR/branding block (verified identical at row
      2298 for landscape pages and 3048 for portrait pages across
      unrelated puzzles), and derives the equivalent full-canvas crop by
      matching ink bounding boxes against the existing 800px webp — so the
      1200px output is real captured detail, not an upscale. Wired into
      `ResponsiveImage.tsx`'s srcset (also fixed a pre-existing bug there:
      the 800px source was mislabeled with the display-width descriptor
      instead of its real 800w, which could stop browsers from ever
      selecting it) and into puzzle/category `og:image` via
      `lib/seo.ts`'s new `ogImageFor()`, plus the sitewide
      `DEFAULT_OG_IMAGE` fallback — all now meet Google's 1200px+
      large-image-preview / Discover threshold.
      Coverage: 78 of 82 puzzles (tracked in `lib/puzzle-1200-manifest.json`,
      regenerate by rerunning the script). Known gaps, left unresolved
      rather than shipping a bad crop: `seahorse`, `whale`,
      `gas-balloon-usa-250` use an older PDF template (a boxed "CONNECT
      THE DOTS" caption instead of the footer/QR block) that the fixed
      footer-row assumption doesn't handle — needs a second template
      profile if these are wanted; `ostriches` has no PDF at all.
- [x] **Speakable schema** (`SpeakableSpecification` in JSON-LD) for voice
      search / AI audio overviews — done 2026-08-19. `exportedSchema` in
      `components/templates/CommonPuzzleTemplate.tsx` now includes
      `speakable: { cssSelector: ['#puzzle-h1', '#puzzle-description'] }`,
      matching new ids added to the on-page h1/description elements.
- [x] **HTML summary/data tables** on puzzle pages (age, dot count,
      difficulty) for AEO/GEO citation by ChatGPT Search, Perplexity,
      Gemini — done 2026-08-19, puzzle pages only (category pages not
      attempted). Reuses existing translated labels (`agesLabel`,
      `dotsLabel`, `difficultyHeading`) so no new i18n keys/translation
      backfill was needed.
- [x] **Cross-category interlinking by dot-count/age tier** — done 2026-08-19.
      `getCrossTierPuzzles()` in `lib/category-registry.ts` adds a second
      "more puzzles at this skill level" grid on every puzzle page, linking
      to up to 3 puzzles from other categories at the same difficulty tier
      and overlapping age range. No new i18n keys needed. Verified with a
      full `next build`.
- [x] **Inline Microdata** (`itemscope`/`itemprop`) alongside existing
      JSON-LD, as a fallback if script-tag JSON-LD is truncated/fails to
      parse — done 2026-08-19, puzzle pages only. Added
      `itemScope itemType="https://schema.org/CreativeWork"` on the
      preview column with `itemProp` on name/description/image/
      educationalUse/typicalAgeRange, mirroring `exportedSchema`.

The remaining Speakable schema and Microdata items touch JSON-LD generation
more broadly — scope each one before starting.

## Growth ideas (from 5-idea review)

- [x] **Age & Difficulty hub pages** (`/en/ages/4-6/`, `/en/difficulty/easy-1-20-dots/`,
      etc.) — done 2026-08-19, English-only. See commit "Add Age & Difficulty
      hub pages" and `lib/hub-content.ts`.
      **Follow-up TODO:** translate hub copy into the other 31 locales via
      `scripts/translate-i18n-missing.mjs`, move it into the content/<locale>
      pipeline, then add those locales to both routes' `generateStaticParams`
      and remove the English-only handling in `generate-sitemap.mjs`. Needs a
      go-ahead first — that script calls a paid external translation API.
- [ ] **Interactive dot-connect preview** — explicitly out of scope per user
      request ("ignore canvas").
- [ ] **Custom pack / bundle PDF builder** — real feature work (cart state +
      PDF-merge pipeline that doesn't exist yet), not attempted.
- [ ] **Common Core / EducationalAlignment schema** — code-trivial addition to
      `lib/seo.ts`'s existing `LearningResource` JSON-LD, but no real
      standards-mapping data exists in the DB. Shipping invented/mismatched
      standards citations risks a structured-data penalty — skip unless real
      per-puzzle mappings are sourced.
- [ ] **UGC "print & color" photo gallery** — real feature work (upload +
      storage + moderation, real abuse surface), not attempted.

## Found along the way

- `scripts/generate-sitemap.mjs` currently throws
  (`enBySection[prefix].map is not a function`) via
  `scripts/lib/translation-availability.mjs:79`, independent of any change
  in this session — reproduces on a clean checkout. Looks like one of the
  section content files (likely `content/en/puzzles-canada.json`, the one
  file with a known non-strict/older schema — see CLAUDE.md) isn't a plain
  array the way the others are. Not fixed here since it's pre-existing and
  the script isn't wired into `npm run build`/`prebuild`, but worth fixing
  before this script is next relied on (e.g. to regenerate sitemap.xml with
  the new hub URLs above).
