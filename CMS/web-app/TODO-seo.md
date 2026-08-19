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
- [ ] **Cross-category interlinking by dot-count/age tier** (e.g. link a
      Dinosaur 50-dot puzzle to an Ocean 50-dot puzzle), not just within
      the same category.
- [ ] **Inline Microdata** (`itemscope`/`itemprop`) alongside existing
      JSON-LD, as a fallback if script-tag JSON-LD is truncated/fails to
      parse.

All four of the non-srcset items touch JSON-LD generation and/or page data
structures more broadly — scope each one before starting.
