# SEO / AEO / GEO — deferred items

Not done — needs a call before implementing.

- [ ] **1200px srcset for puzzle images** — source puzzle images are only
      800px wide natively (checked via sharp metadata on
      `public/images/*-puzzle.webp`), so a 1200px variant would require
      upscaling, which `scripts/generate-responsive-images.mjs` explicitly
      disables (`withoutEnlargement: true`). Not actionable without
      re-sourcing higher-resolution originals.
- [ ] **Speakable schema** (`SpeakableSpecification` in JSON-LD) for voice
      search / AI audio overviews.
- [ ] **HTML summary/data tables** on category and puzzle pages (puzzle
      name, dot count, age, difficulty) for AEO/GEO citation by ChatGPT
      Search, Perplexity, Gemini.
- [x] **Cross-category interlinking by dot-count/age tier** — done 2026-08-19.
      `getCrossTierPuzzles()` in `lib/category-registry.ts` adds a second
      "more puzzles at this skill level" grid on every puzzle page, linking
      to up to 3 puzzles from other categories at the same difficulty tier
      and overlapping age range. No new i18n keys needed. Verified with a
      full `next build`.
- [ ] **Inline Microdata** (`itemscope`/`itemprop`) alongside existing
      JSON-LD, as a fallback if script-tag JSON-LD is truncated/fails to
      parse.

The remaining Speakable schema and Microdata items touch JSON-LD generation
more broadly — scope each one before starting.
