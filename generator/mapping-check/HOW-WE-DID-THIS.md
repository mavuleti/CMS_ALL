# Legacy → New Schema Migration Audit — How We Did This

This documents the exact process used to verify and complete the migration
for `cute-puppy-dot-to-dot-puzzle` (English), so the same steps can be
repeated for every remaining puzzle/locale. The tool that does the work is
`audit_single_puzzle.py` in this folder — nothing here is manual guesswork,
every step is either a script run or a code-verified fact.

## 0. Why this exists

Before trusting a bulk conversion of legacy puzzle JSON
(`seoTitle`, `seoDescription`, `dotGuide`, ...) into the new namespaced
schema (`header`/`body`, see `puzzle-json-schema.md`), we needed a way to
prove, field by field, that:

1. Every legacy key actually lands at its documented new key.
2. The value that lands there is the *same* value (no silent drops/swaps).
3. Fields the new schema adds that have no legacy source (`header.json_ld.*`)
   are clearly flagged as needing manual attention, not mistaken for a bug.
4. We know **where on the actual live page** each field is used — so we
   don't waste time filling in a field the site doesn't even read.

## 1. The tool: `audit_single_puzzle.py`

Lives at `generator/mapping-check/audit_single_puzzle.py`. It imports the
real conversion function (`migrate_legacy_schema.convert_entry`) — it never
reimplements the mapping logic, so the audit can't drift from what the real
migrator does.

### Basic run (tests the migrator itself)

```bash
python audit_single_puzzle.py <legacy_json_path> <slug>
```

Example (what we ran first):
```bash
python audit_single_puzzle.py \
  "C:\Users\...\dot-to-dot-web\content\en\puzzles-cute.json" \
  cute-puppy-dot-to-dot-puzzle
```

This loads the **legacy** entry, runs it through `convert_entry()` fresh, and
writes one row per field into a SQLite `mapping_audit` table
(`mapping_audit_<slug>.db`, in this folder). Use this mode to sanity-check
the migrator logic itself — it always shows a **freshly-derived** conversion,
never anything hand-edited afterward.

### Auditing the REAL current content (what you actually want when checking "is this puzzle done?")

```bash
python audit_single_puzzle.py <legacy_json_path> <slug> \
  --converted-json-path <already-migrated content file> \
  --prod-root <path to dot-to-dot-web repo> \
  --category <prod category folder, e.g. cute>
```

Example (what we ran to confirm `cute-puppy-dot-to-dot-puzzle` is complete):
```bash
python audit_single_puzzle.py \
  "C:\Users\...\dot-to-dot-web\content\en\puzzles-cute.json" \
  cute-puppy-dot-to-dot-puzzle \
  --converted-json-path "C:\Users\...\dot-to-dot-page-generator\content\en\puzzles-cute.json" \
  --prod-root "C:\Users\...\dot-to-dot-web" \
  --category cute
```

`--converted-json-path` matters: without it, the tool always re-derives a
fresh conversion and will keep showing `header.json_ld.image` etc. as blank
even after you've manually filled it in — because it's testing the
*migrator*, not the *file*. With it, the tool reads the entry as it actually
exists right now in the generator's content file, so manual fixes show up.

Run `--all` instead of a slug to audit every puzzle in a category file in
one pass (writes one `.db` with a distinct `puzzle_slug` per group of rows).

## 2. What ends up in the `mapping_audit` SQLite table

Columns, in order:

| Column | Meaning |
|---|---|
| `id` | row id |
| `puzzle_slug` | which puzzle this row belongs to |
| `where_used_in_page` | **verified against actual prod code** — file + line citation of where this field is consumed on the live page, or an explicit "NOT READ by prod" / "AUTO-DETECTED (unverified)" / "NOT FOUND" note |
| `legacy_key` | old flat key, e.g. `seoImageAlt` |
| `Legacy_value_by_key` | the literal value from the legacy JSON |
| `new_key` | target path under the new schema, e.g. `header.og.image_alt` |
| `new_value` | the value actually present at that path right now |
| `status` | `OK` / `DROPPED` / `MISMATCH` / `UNMAPPED` / `NEW_FIELD` |
| `relevant` | does `new_value` (col 3 conceptually) actually relate to `legacy_key`/`Legacy_value_by_key` (cols 1–2)? `YES` / `PARTIAL` / `NO` |
| `usage_relevant` | does `where_used_in_page`'s description actually relate to `new_key`? (catches a usage note that's just wrong/misplaced) `YES` / `NO` / `UNVERIFIED` |
| `notes` | free-text detail, mismatch reasons, etc. |
| `created_at` | UTC timestamp of the audit run |

Open the `.db` in any SQLite browser (DB Browser for SQLite, etc.) to scroll
and review — it's a read-only verification artifact, never the production
data store.

## 3. Step-by-step: how `cute-puppy-dot-to-dot-puzzle` (EN) got to "fully mapped"

1. **Ran the basic audit** against the legacy file. Result: 93 rows, 89 `OK`,
   0 `DROPPED`/`MISMATCH`/`UNMAPPED`, 4 `NEW_FIELD` (the `header.json_ld.*`
   fields that have no legacy source). Confirmed the migrator's mapping is
   trustworthy for this entry.
2. **Cross-checked `seoImageAlt`** against prod (`dot-to-dot-web`) directly,
   because the schema doc's mapping table only mentioned "Open Graph image
   alt text." Found: `seoImageAlt` actually drives BOTH `og:image:alt` **and**
   the real visible `<img alt>` on the page, via a shared
   `puzzleImageAlt()` helper (`dot-to-dot-web/lib/localized-seo.ts:150-178`).
   Verified the generator's own renderer (`ui-app/lib/converted-content.ts`
   + `CommonPuzzleTemplate.tsx`) reuses the single stored
   `header.og.image_alt` value the same way, so no schema change was needed
   — just corrected the doc comment so nobody "fixes" this into a false
   `UNMAPPED` finding later.
3. **Read the actual "Cute" category prod code** (`cute/page.tsx`,
   `cute/[slug]/page.tsx`, `GuideListen.tsx`, `lib/seo.ts`) line by line and
   built the `where_used_in_page` lookup table in
   `audit_single_puzzle.py` (`_WHERE_USED_IN_PAGE`) from it. This is what
   surfaced the real finding: **`header.json_ld.description`,
   `.name`, `.type`, `.image`, `.educational_use`, `.age_range` are all
   stored but never actually read by prod's `puzzleJsonLd()`** — it
   rebuilds JSON-LD fresh from `body.description`/`puzzle.name`/hardcoded
   constants at render time. Not a migration bug (nothing's lost), but
   editing those stored fields wouldn't change the live page today.
   `body.faqs` is the same story — prod pulls FAQs from the locale's
   `faqs.json` pack, ignoring the puzzle's own `faqs` array.
4. **Added `usage_relevant`**, an automatic cross-check that the
   `where_used_in_page` text for a given `new_key` actually mentions a
   keyword you'd expect for that field (e.g. an `image_alt` row's usage
   text must contain "alt", not just "image"). Caught two real bugs in our
   own keyword-matching order and two `where_used_in_page` descriptions
   that were too vague — fixed both, re-ran, ended up 93/93 `YES`.
5. **Filled in the one field that genuinely needed a manual value**:
   `header.json_ld.image` was `""` (correct — the migrator intentionally
   leaves it blank, mirroring the CMS form's `normalizeEntry()`, which never
   auto-fills an image path). Looked up the puzzle's real image path from
   prod (`dot-to-dot-web/lib/cute-data.ts:58` →
   `/images/cute-puppy-puzzle.webp`, confirmed the file exists at
   `dot-to-dot-web/public/images/cute-puppy-puzzle.webp`), confirmed the
   **root-relative path convention** is correct practice here (per the
   schema doc's own image-path validator, and because `absoluteUrl()` only
   prepends the domain at the point of external output — content itself
   never hardcodes `https://dottodotfreeprintables.com/...`), and set
   `content/en/puzzles-cute.json → header.json_ld.image =
   "/images/cute-puppy-puzzle.webp"` directly (single-line diff, verified
   with `git diff`).
6. **Re-ran the audit with `--converted-json-path`** pointed at the real
   generator content file. Result: **93/93 rows have a non-empty
   `new_value`**, all 4 `NEW_FIELD` rows now show real values
   (`CreativeWork`, `/images/cute-puppy-puzzle.webp`,
   `Fine motor skills, number sequencing`, `5-9`), both relevance columns
   are 93/93 `YES`. This puzzle, this locale, is done.

## 4. How to repeat this for the remaining puzzles

For each remaining puzzle (other slugs in `puzzles-cute.json`, other
category files, other locales):

1. **Run the audit** with `--converted-json-path` + `--prod-root` +
   `--category` set correctly for that puzzle's category (see command in
   §1). This alone tells you the current state — look at the printed
   summary block:
   - `DROPPED=0 MISMATCH=0 UNMAPPED=0` → migrator mapping is fine, no
     action needed there.
   - `STORED BUT NOT READ AT RENDER TIME IN PROD` list → informational only,
     skip these, they don't affect the live page (unless prod code changes
     later — if it does, re-verify `where_used_in_page` for that key).
   - Rows with an **empty `new_value`** and `status=NEW_FIELD` → these are
     the ones that need a manual value, same as step 5 above.
2. **For each empty `NEW_FIELD` row**, look up the real value the same way
   we did for the image:
   - `header.json_ld.image` → find the puzzle's `image` path in the prod
     category data file (e.g. `dot-to-dot-web/lib/{category}-data.ts`),
     confirm the file exists under `dot-to-dot-web/public/images/`, use the
     **same root-relative path** (`/images/....webp`) — never a full
     `https://...` URL.
   - `header.json_ld.age_range` → usually derivable from the puzzle's
     `age` field in the same prod data file (e.g. `"Ages 5–9"` → `"5-9"`).
   - `header.json_ld.type` / `.educational_use` → these already get sane
     defaults from the migrator (`CreativeWork` /
     `Fine motor skills, number sequencing`); only override if a puzzle
     genuinely needs something different.
3. **Edit the real content file directly** (e.g.
   `content/<locale>/puzzles-<category>.json`), same pattern as the
   single-line diff in step 5 above — change only the one field, verify with
   `git diff` that nothing else moved.
4. **Re-run the audit** with `--converted-json-path` to confirm the row
   count of empty `new_value` cells for that puzzle dropped to zero, and
   that `relevant`/`usage_relevant` are still 100% `YES`.
5. Repeat per puzzle. `--all` (instead of a single slug) audits every
   puzzle in a category file in one run if you want the full-category
   picture before diving into individual fixes.

## 5. Always verify against real prod source, not just sibling content JSON

**Never conclude a field is "empty," "missing," or "out of scope" by comparing
this repo's legacy/converted JSON files to each other alone.** Some prod
content is split across the content JSON and separate hardcoded data files
(e.g. `dot-to-dot-web/lib/blog-data.ts`'s `blogPostShells` array, which
supplies `heroImage.src`/`width`/`height`/`publishedAt`/`updatedAt` for blog
posts — the content JSON only carries `heroImage.alt`). Missing that source
during the blog hero-image audit led to a wrong conclusion (9/11 posts
"have no hero image") that hid a real live bug: 5 posts were rendering a
hero image with blank `alt=""` in production. Always read the actual prod
page component (`.tsx`) end-to-end and check for sibling data files under
`lib/` before declaring a field empty or not applicable.

## 6. Resolving the `messages.json` dynamic-key UNVERIFIED rows

`audit_other_pages_fields.py` (see its own docstring) can only prove a leaf
key is used when it's referenced by a *literal* string call, e.g.
`t('title')`. Keys read via a template-built key inside a `.map()`/loop
(`` t(`items.${id}.name`) ``) can't be proven by grep alone and are flagged
`UNVERIFIED (dynamic key in a loop...)`. As of 2026-08-10 there were 118 such
rows across 9 namespaces (`categories`, `puzzleSection`, `faq`,
`puzzleDetail`, `feedbackForm`, `purchase`, `nav`, `common`, `homepageUi`;
`footer` had 3 more, not yet classified).

Each dynamic-key row was manually traced end-to-end (loop variable → its
source array → whether the resulting key actually exists in `messages.json`)
and classified into one of four buckets:

| Bucket | Meaning |
|---|---|
| **Runtime used** | The template key is built from a real id/loop variable whose value, for at least one real locale/category/puzzle, produces this exact leaf key, and that's the branch that renders. |
| **Build/script used** | Not read by `t()` at all — consumed by a build-time script/generator instead. (None found in this pass.) |
| **Fallback used** | Only reached through a `t.has(key) ? t(key) : fallback` chain, where the fallback (not the primary key) is what actually renders for most locales today — still legitimate, not dead. |
| **Confirmed unused** | Not reachable by any runtime loop, build script, or fallback chain — genuinely dead code. (None found in this pass.) |

Result of the 2026-08-10 pass (115 of the 118 rows; `footer`'s 3 rows were
out of scope for that run):

- **Runtime used — 93 keys**
  - `categories` (40): `components/sections.tsx` `CategoryGrid`/`Navbar`
    build `items.${id}.name`/`.description`, `badges.${id}` from the live
    category id list in `dot-to-dot-web/lib/site-data.ts` (via
    `lib/nav-categories.ts`'s `getActiveCategories()`); `t.has()` is true
    for every id, so `t(key)` — not a fallback — is what renders.
  - `puzzleSection` (33): category labels and `items.<slug>.name` built
    from the same `site-data.ts` puzzle/category data.
  - `feedbackForm` (5): `components/FeedbackForm.tsx`'s
    `FEEDBACK_TYPES` array maps 1:1 to `types.*` keys, unconditional loop.
  - `purchase` (5): `app/[locale]/premium/page.tsx`'s `benefits` array
    maps 1:1 to `premium.benefits.*` keys, unconditional loop.
  - `common` (4): `comingSoon` (inactive category tiles) and
    `difficulty.1/2/3` (`HomeDiscovery.tsx`, puzzle difficulty 1–3).
  - `homepageUi` (2): `categoryNames.cute`/`.flowers` — `Navbar` checks
    `tHome.has()` *before* falling back to `categories.items.*.name`, so
    these two win priority over the categories fallback for those two
    categories' nav labels.
  - `nav` (4: `freePack`/`kids`/`parents`/`teachers`) — reachable only via
    the standalone `app/rtl-preview/page.tsx` QA route (reads
    `messages.nav.*` directly, not via `t()`); real code, but a dev-only
    surface not linked from the live site nav for any locale.
- **Fallback used — 22 keys** (and this fallback is the one that actually
  renders for most locales, not a dead safety net):
  - `faq` (16: `q1`–`q8`/`a1`–`a8`): `FaqSection`/`CategoryFaqSection` in
    `sections.tsx` use a "rich" per-locale `faqs.json` pack when one
    exists (only en/es/ar/de/fr ship one) and fall back to these literal
    `t('q1'..'a8')` keys otherwise — for the other 25+ shipped locales,
    this fallback text **is** the live FAQ content.
  - `puzzleDetail` (6: `faqQ1`–`3`/`faqA1`–`3`): same pattern,
    `PuzzleFaqSection`, per-puzzle `faqs.json` pack vs. these fallback
    keys, same non-en/es/ar/de/fr locales use the fallback.
- **Build/script used — 0. Confirmed unused — 0.**

Full per-key evidence table (file:line citations for all 115 rows) is
preserved in the session transcript; regenerate on demand by re-running
`audit_other_pages_fields.py` and manually tracing any new UNVERIFIED rows
the same way (read the actual consuming `.tsx` loop, don't guess from the
key name). The `footer` namespace's 3 UNVERIFIED rows from the same run
still need this same manual trace.

**Policy implication:** per the "100% translation, no fallback" policy
adopted the same day (2026-08-10), the `faq`/`puzzleDetail` fallback-used
keys are exactly the kind of pattern being phased out going forward — new
work should not add more `t.has() ? : fallback` chains, even though these
existing ones are currently load-bearing for most locales.

## 7. Things to keep in mind while doing this

- **`_WHERE_USED_IN_PAGE` in `audit_single_puzzle.py` was built by reading
  the "Cute" category's prod code specifically.** Other categories
  (dinosaurs, flowers, ocean, etc.) use the same field *names* but are
  separate `page.tsx` files — the tool's `best_effort_prod_search()`
  fallback will grep for a plausible match automatically when no manual
  entry exists yet, but it's marked `AUTO-DETECTED (unverified)` and should
  be spot-checked, not trusted blindly, the same way the "Cute" entries were
  hand-verified line-by-line before being trusted.
- **Never hand-edit `migrate_legacy_schema.py`'s defaults** to "fix" a
  NEW_FIELD gap for one puzzle — that would change behavior for every
  puzzle. Fill in real per-puzzle values in the content files instead, as
  done here.
- **The audit tool is read-only against real content** — it never writes
  back into any puzzle JSON. All content edits (like the image path fix)
  are done separately and manually, then re-verified with the audit.
- Re-migrating a puzzle *from the legacy source* will regenerate
  `header.json_ld.image` etc. as blank again (the migrator's defaults
  haven't changed) — so if a legacy re-import ever happens, the manual
  fill-ins done via this process need to be reapplied afterward.
