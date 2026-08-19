# Search Console indexing issues — code-side TODOs

From the GSC verification pass on 2026-08-19. Console-only actions (clicking
"Validate Fix", waiting on crawl budget) are tracked in Search Console itself,
not here — this file is only for changes that require code.

- [x] **Page with redirect (44 pages)** — investigated 2026-08-19: `routing.ts`
      no longer lists `ar-AE`/`ar-SA`/`ar-QA` (removed in 3531980f), and a
      grep for hardcoded un-prefixed hrefs (`/dinosaurs/...`,
      `/ocean/...`, etc.) across `.tsx` found none — the only hit was a
      direct `.pdf` download link, unrelated to routing. The 301s in
      `firebase.json` (~lines 57–160) are a legacy safety net for old
      external backlinks/cached URLs, not something the app itself still
      generates. No code change needed — just click "Validate Fix" in GSC.
- [ ] **Duplicate, Google chose different canonical (61 pages)** — verify
      per-locale content is actually distinct (not just passing
      `validate-i18n-keys.mjs`) for the affected URLs once GSC re-crawls
      after "Validate Fix" is clicked; re-open this item if duplicates
      persist after re-indexing.
- [ ] **Discovered - currently not indexed (1,489 pages)** — no code fix;
      revisit only if crawl-budget/indexing doesn't improve after a few
      weeks (consider internal-linking density, sitemap prioritization).
