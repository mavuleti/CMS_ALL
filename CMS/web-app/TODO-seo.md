# SEO / AEO / GEO — deferred items

Not done — needs a call before implementing.

- [ ] **1200px srcset for puzzle images** — source puzzle images are only
      800px wide natively (checked via sharp metadata on
      `public/images/*-puzzle.webp`), so a 1200px variant would require
      upscaling, which `scripts/generate-responsive-images.mjs` explicitly
      disables (`withoutEnlargement: true`). Not actionable without
      re-sourcing higher-resolution originals.
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
