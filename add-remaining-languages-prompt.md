# Task: Export and wire the remaining languages into Ui-app-DB-json

## Context

`generator/Ui-app-DB-json` (a Next.js 14 static-export app) already has real,
DB-sourced content wired for **en, ar, de, fi** (see commits `c73abdc` and
`6760d1e` on `master` for the reference implementation — read them before
starting). This task extends the exact same pipeline to the remaining
languages so the whole site is available in every language the data
supports.

The `mapping_audit_*.db` files under `generator/mapping-check/` (SQLite,
table `mapping_audit`, columns include `language`, `puzzle_slug`, `new_key`,
`new_value`) contain full per-language content — confirmed present for all
33 language codes:

```
ar az cs da de el en es fa fi fr hr hu id it ja ko lt lv nl no pl pt pt-BR
ro ru sk sl sv th tr uk vi
```

Already done: `en, ar, de, fi`. **Remaining: the other 29** (do all of them,
or a clearly-communicated subset if you choose to batch — see "Suggested
batching" below).

## Hard rules — read before touching anything

1. **No `ui-app` references, anywhere.** There is no `ui-app` directory in
   this repo (it was removed from disk but is still tracked in git as a
   pending, uncommitted deletion — do not touch that deletion, and do not
   reintroduce any code path that reads from `ui-app`). Content comes
   **strictly** from the `mapping_audit_*.db` files, via the DB's own
   `language` column. Do not fall back to, copy from, or reference
   `dot-to-dot-web/content/<locale>` either — that structure was explicitly
   rejected as a source for this app.
2. **Never touch `ui-app` or `dot-to-dot-web`** as a side effect of
   "helpful" copying, referencing, or diffing. If you think you need to,
   stop and ask first.
3. **Commit your current working tree state before starting** (a narrow,
   scoped commit — see "Committing" below), the same way the en/ar/de/fi
   work did. Do not include the large pre-existing `ui-app`/`content`
   deletion in your commit; leave that untouched and unstaged.
4. **Reuse `generator/mapping-check/export_locale_content.py` as-is.** It
   already takes a `--langs` argument. Do not fork or rewrite it unless you
   find and fix an actual bug — if you do, explain the bug and the fix.
5. **Don't touch the dead code paths.** `generator/Ui-app-DB-json/lib/*-data.ts`
   (e.g. `dinosaurs-data.ts`), `lib/content-source.ts`, `lib/converted-content.ts`,
   and `lib/puzzle-i18n.ts` are **not** used by any live route — verify this
   yourself with a repo-wide grep for each filename before assuming
   otherwise, don't just trust this document. The live path is
   `lib/export-content.ts` → `lib/category-registry.ts` →
   `components/templates/CommonCollectionTemplate.tsx` /
   `CommonPuzzleTemplate.tsx`.
6. **Strict data provenance.** Every piece of visible page content for a
   given locale must trace back to that locale's own `export/<locale>/*.json`
   file. Do not invent, translate-on-the-fly, or backfill missing fields
   with English text.
7. **Known, accepted gap — do not try to "fix" it by inventing content.**
   The DB has zero `<category>-collection` rows for any language (confirmed
   for en/ar/de/fi already), so collection (category-page) title/H1/meta
   description are not available from the DB for any locale. The existing
   fallback (title-cased slug, e.g. `dinosaurs` → `Dinosaurs`) in
   `lib/category-registry.ts` already covers every locale — you do not need
   to add per-language fallback text. If you find a *different* kind of gap
   (e.g. a whole category missing for one language), report it, don't paper
   over it.

## Steps

### 1. Checkpoint commit
Run `git status` first. Stage only files you're about to touch as part of
this task (the export script if you change it, and whatever app files you
modify) — never `git add -A`. Confirm no `.env`/secret-looking files sneak
in. Leave the pre-existing `ui-app`/`content` deletions alone.

### 2. Run the export
From `generator/mapping-check/`:

```
python export_locale_content.py --langs <lang1> <lang2> ...
```

This writes `generator/mapping-check/export/<lang>/*.json` for each
language: `about.json`, `contact.json`, `privacy-policy.json`, `terms.json`,
`home.json`, `blog.json`, and `puzzles-<category>.json` for all 12
categories (canada, circus, cute, dinosaurs, flowers, garden, ocean,
playgrounds, space, uae, usa-250, plus whatever `DB_TO_OUTPUT` in the script
lists — check it, don't assume this list is exhaustive/current).

Watch the console output for `SKIP BAD ROW` and `CONFLICT` lines — these are
expected in small numbers (pre-existing data-quality quirks the script
already tolerates) but a **large** spike for a specific language/category is
a signal to look at that DB before proceeding, not just plow through.

### 3. Spot-check the export
For at least 2 languages × 2 categories, open the generated JSON and check:
- It parses as valid JSON.
- Text is in the target language (not English, not another language, not
  mojibake).
- `dotGuide.sections`, `dotGuide.colorSchemes` (or `color_schemes`) are
  present and non-empty, matching the puzzle's English section count.

### 4. Wire the app
Edit `generator/Ui-app-DB-json/i18n/routing.ts` — add the new language codes
to the `locales` array. That is very likely the **only** required app code
change, because `export-content.ts` → `category-registry.ts` already read
`../mapping-check/export/${locale}` generically for whatever locale is
requested (this is exactly why en/ar/de/fi needed no per-language special
casing beyond adding them to `routing.locales`).

**But verify, don't assume** — check these two things per new language and
fix if missing:
- `app/[locale]/layout.tsx`: `localeToHtmlLang` and `localeToOgLocale` maps.
  As of this writing, **`az` and `fa` are missing from both maps** — add them
  (and check the others aren't missing anything either) before treating
  those two languages as done.
- `components/LocaleHtml.tsx`: `rtlLocales` set. As of this writing it only
  contains `ar` — **`fa` (Persian) is also RTL** and must be added when you
  do `fa`. Check whether any other code in the list is RTL (it isn't, for
  the standard set above, but verify rather than trust this note).

### 5. Build and verify
```
cd generator/Ui-app-DB-json
npx tsc --noEmit -p tsconfig.json
rm -rf .next out && npm run build
```
Both must complete with no errors. Then spot-check rendered output the same
way the en/ar/de/fi pass did: grep a puzzle page's `out/<locale>/<category>/<slug>/index.html`
for a `<title>` tag and confirm it's in the target language, not empty, not
English.

Known pre-existing, out-of-scope failures — do not try to fix these as part
of this task, just don't make them worse:
- `npm run validate:i18n` and `tests/i18n-layout.spec.ts` — both target a
  `content/<locale>/messages.json` file structure that doesn't exist in this
  app (confirmed broken independent of any locale work). If you have spare
  time and want to actually fix this, that's a separate, explicit task —
  don't fix it silently as a side effect of this one.
- Site-wide UI chrome strings (nav labels, buttons, FAQ headings) come from
  `content/en/common.json` / `home.json` only, for every locale — there is no
  per-language source for these in the DB (`common_content.db` has no
  `language` column). Leave as-is.

### 6. Commit
Scope the commit to exactly what you changed: `export/<lang>/` directories
for the languages you added, `i18n/routing.ts`, and `app/[locale]/layout.tsx`
/ `components/LocaleHtml.tsx` only if you actually edited them. Write a
commit message that states which language codes were added and links back
to the en/ar/de/fi commits as the pattern being followed.

## Suggested batching

Doing all 29 remaining languages in one pass is reasonable since the app
wiring is a one-time change (step 4) — the per-language cost is just steps
2–3 (export + spot-check) and a slightly longer build in step 5. If you do
batch, still spot-check **every** language's export in step 3, not just a
couple — sampling 2 languages total across 29 is not enough; sample at
least 1 category from every language, and 2+ categories from a handful
chosen at random.

If something about one specific language's DB looks structurally different
from the others (extra/missing tables, no `language='xx'` rows at all,
wildly different row counts), stop and report it rather than silently
skipping or forcing it through.

## Verification checklist (must all be true before calling this done)

- [ ] `export/<lang>/` exists and is non-empty for every language in scope.
- [ ] `npx tsc --noEmit` clean.
- [ ] `npm run build` succeeds, generating static pages for every new
      locale (check the build's route summary output, same as the
      en/ar/de/fi build listed `/en`, `/ar`, `/de`, `/fi` under each route).
- [ ] At least one puzzle page per new language, when inspected in
      `out/`, has a translated `<title>`, translated body text, and (for RTL
      languages) `LocaleHtml`/`rtlLocales` correctly covers it.
- [ ] `localeToHtmlLang` / `localeToOgLocale` have an entry for every new
      language code (no silent fallback to `en`).
- [ ] Commit is scoped — no `ui-app`/`content` deletions, no unrelated
      files, no `node_modules`/`.next`/`out`/test-result artifacts.
