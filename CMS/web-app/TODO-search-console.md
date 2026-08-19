# Search Console indexing issues — code-side TODOs

From the GSC verification pass on 2026-08-19. Console-only actions (clicking
"Validate Fix", waiting on crawl budget) are tracked in Search Console itself,
not here — this file is only for changes that require code.

- [ ] **Page with redirect (44 pages)** — Firebase 301s still exist for
      un-prefixed URLs (`/dinosaurs/...` → `/en/dinosaurs/...`) and Arabic
      regional locale aliases. Decide whether to keep these as permanent
      redirects (fine for GSC once validated) or remove the un-prefixed
      routes from anywhere they're still linked/sitemapped internally.
      Check `firebase.json` (redirects ~lines 55–160) against
      `scripts/generate-sitemap.mjs` for any remaining self-referential
      links to the un-prefixed paths.
- [ ] **Duplicate, Google chose different canonical (61 pages)** — verify
      per-locale content is actually distinct (not just passing
      `validate-i18n-keys.mjs`) for the affected URLs once GSC re-crawls
      after "Validate Fix" is clicked; re-open this item if duplicates
      persist after re-indexing.
- [ ] **Discovered - currently not indexed (1,489 pages)** — no code fix;
      revisit only if crawl-budget/indexing doesn't improve after a few
      weeks (consider internal-linking density, sitemap prioritization).
