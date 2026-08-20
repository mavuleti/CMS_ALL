# Project rules

## No empty/missing translation values — ever

Every locale must ship 100% real, non-empty content for every field that exists in the
English source (`content/en/**`, backed by `../mapping-check/export/en`). This applies to
every field without exception — including ones that look decorative or secondary (e.g.
`dot_guide.heading`).

- **Do not add code-level fallbacks** that substitute a generic/templated string (e.g.
  `value ?? t('genericHeading')`) when a locale is missing a real translated value. A
  fallback like that hides the gap instead of fixing it — the page silently ships
  degraded content and nobody ever finds out translation is missing.
- **Missing or empty values must fail the build**, not warn and continue. `npm run build`
  runs `npm run validate:i18n` first (via the `prebuild` script in `package.json`), which
  runs `scripts/validate-i18n-keys.mjs` — this exits non-zero and stops page generation if
  any locale has a field that's missing or empty compared to the English source. If you
  add a new required content field, do NOT add it to the validator's exemption lists
  (`nonStrictFiles`, `optionalSubtrees`, the seoTitle/seoDescription/seoImageAlt/seoH1
  warn-only checks) unless it has a deliberate, documented reason to be optional (see the
  comments next to each exemption for the existing ones) — those are for it to permanently
  never be required.
- When you find a field that's missing across locales, the fix is to generate/backfill the
  real translated value for every locale (see `scripts/translate-i18n-missing.mjs`), not to
  paper over it with a fallback or a validator exemption.

See [[project_full_translation_policy]] equivalent context in memory: as of 2026-08-10,
every locale must be 100% translated — this file makes that rule enforceable, not just
aspirational.

## Every content JSON entry must also exist in the DB — DB is source of truth

`content/{locale}/*.json` (and the `../mapping-check/export/{locale}/*.json` /
`../exporter/export/output/{locale}/*.json` mirrors) are **exports**, not the source of
truth. The `../database/mapping_audit_*.db` SQLite databases (one per category, plus
`mapping_audit_home.db` for home/site-level content) are the real source of truth. Writing
new or changed content only into the JSON files — without a matching row in the
corresponding `mapping_audit` table — is not a complete fix: the next DB export/sync run
has no record of that change and will silently overwrite or drop it.

- **This bit us for real:** a content feature (FAQ questions/answers) was added by writing
  `content/<locale>/faqs.json` directly (and its two export mirrors) across all 32 locales,
  with no DB tooling in this checkout to write through. The JSON looked complete and the
  site built and rendered the new content correctly — but the change didn't actually exist
  anywhere durable. It had to be backfilled afterward as real `mapping_audit` rows once the
  gap was noticed.
- When you add or change content that ships in `content/{locale}/*.json`, insert/update the
  matching row(s) in the relevant `mapping_audit_*.db`'s `mapping_audit` table too — same
  locale, same value, decomposed one DB row per sub-key/array-index (see the truncation
  section below; e.g. an array like `site.faqs[8]` becomes rows keyed
  `faqs.site[8].q` / `faqs.site[8].a`, following the same bracket-index convention already
  used for e.g. `body.dot_guide.sections[0].title`). Match the existing schema
  (`puzzle_slug`, `language`, `where_used_in_page`, `new_key`, `new_value`, `status: 'OK'`,
  `relevant: 'YES'`, `usage_relevant: 'YES'`, `created_at`) and existing `puzzle_slug`
  conventions (`'home'` for site-level content, `'<category>-collection'` for category
  listing pages, the real puzzle slug for puzzle detail pages).
- If the DB-writer tooling referenced elsewhere in this file
  (`../mapping-check/_DB_Extra_scripts/`, `../mapping-check/DB-TO-Json-tool/`) isn't present
  in the current checkout, that's a missing-tool problem to flag, not a reason to skip the
  DB — write directly to the SQLite file with the schema above rather than leaving the
  change JSON-only.

## No truncation of any content value — ever, in export or DB tooling

Every value in `content/{locale}/*.json` must be the full, complete value — no length
limit applied anywhere in the pipeline that produces it.

- This bit us for real: `../mapping-check/_DB_Extra_scripts/audit_blog.py` used to clip
  any value over 500 chars to `text[:499] + "…"` before writing it into the DB row that
  `../mapping-check/DB-TO-Json-tool/export_locale_content.py` later exported verbatim.
  It shipped `blog.json` paragraphs cut off mid-`<a>`-tag to every locale, with valid JSON
  and no error — just silently missing content.
- `../mapping-check/_DB_Extra_scripts/value_repr.py`'s `full_repr()` is the shared,
  no-limit serializer for anything written into a `mapping_audit` DB row — never
  reimplement a local `compact_repr(..., limit=N)`.
- Nested objects (e.g. a related-link `{title, href, description}`, a hero image
  `{alt}`) must be decomposed into one DB row per sub-key, not `json.dumps()`'d whole
  into a single string field — a JSON string where the app expects a real object breaks
  the feature, not just the validator (see `../mapping-check/POPULATE-NEW-LANGUAGE-RULES.md`
  §3b for the full incident writeup).
- `export_locale_content.py` itself must never impose a length limit either — the DB
  value is written to the content JSON as-is.
