# Filling missing prod translations — STRICT RULES

This is phase 2. Phase 1 (`POPULATE-NEW-LANGUAGE-RULES.md`) built an honest
**audit** of what's missing — it never touched prod content, only the
throwaway `mapping_audit_*.db` files. Phase 2 is different and higher risk:
**it writes real translated copy into `dot-to-dot-web/content/<lang>/*.json`
— actual prod content.** Read this whole file before writing a single
translated string. The rules below are not suggestions.

---

## 0. What "missing" means here — and why it's trustworthy

Every empty cell counted below was produced by `clone_en_to_language.py`,
which never fabricates: an empty `Legacy_value_by_key`/`new_value` means
the field's `legacy_key`/`new_key` path was looked up directly against that
language's real `content/<lang>/*.json` in prod and **genuinely was not
there** — not a lookup bug, not a skipped step. This was independently
re-verified multiple times across the `ar/de/es/fr/it/ja/ru/fi/nl/pt` runs
and the final 22-language batch (see chat history / commit log for the
verification passes). Treat the counts in §2 as real.

---

## 1. MUST NOT fabricate a translation — MUST be genuine, correct target-language copy

This is the same principle as phase 1's rule 3, extended to writing prod
content directly:

- **MUST NOT** copy the English string in unchanged and call it done.
- **MUST NOT** run it through a naive machine-translation pass and paste
  the raw output — verify it reads as fluent, natural copy in the target
  language, matching the tone of that language's *other, already-present*
  fields in the same file (read a sibling entry in the same
  `content/<lang>/` file first, to match register/style).
- **MUST NOT** guess factual content (ages, dot counts, image paths,
  category names) — carry these over from the English source's *structure*
  but keep them factually identical (a dot count or age range is not
  translated, it's copied verbatim; only prose is translated).
- **MUST** preserve every template placeholder exactly
  (`{name}`, `{min}`, `{max}`, `{dots}` etc. — see
  `dot-to-dot-web/lib/localized-seo.ts` for the exact placeholder tokens
  used in this codebase) — do not translate the token itself, only the
  surrounding sentence.
- **MUST** preserve the exact JSON key structure / schema shape of the
  sibling English (or nearest existing) entry — do not add, remove, or
  rename keys. Only leaf string values change.

If you cannot produce genuinely fluent target-language copy for a field
(e.g. a low-resource language you have no confidence in), **leave it empty
and say so explicitly** — an honest gap is still better than fabricated
content, exactly as phase 1 established.

---

## 2. Technical / non-translatable fields — copy verbatim from English, never translate

**This is the one deliberate exception to rule 1's "never copy English"
principle**, and it's a different case entirely, not a loophole: these
fields are not user-facing prose in the first place, so "translating" them
would corrupt routing, schema.org data, or design tokens rather than
produce a missing translation. Confirmed empirically (2026-08-12) by
diffing `content/en/**` against `content/ar/**` for every shared
puzzle/post: every field below is byte-identical across all locales in
prod today. Treat that identity as intentional, not as an untranslated gap.

| Field(s) | Why it's technical, not prose | Verified |
|---|---|---|
| `slug` (puzzles, blog posts, legal pages) | The URL routing segment. Every locale reuses the exact same English slug — there is no per-locale URL path in this schema. | Diffed `content/en/puzzles-{cute,canada,dinosaurs}.json` vs `content/ar/...` — identical slug sets. Diffed `blog.json` — identical. This is the exact field from the `az`/`best-free-dot-to-dot-printables-by-age` example: if that post is ever authored for `az`, its `slug` value is correctly the unchanged English string, not an empty gap to "translate." |
| `relatedLinks[].href` (blog) | A URL path built from another post/category's `slug`, which is itself locale-invariant (see above). | Diffed `en`/`ar` `blog.json` `relatedLinks[].href` for the same post — identical. |
| `body.dot_guide.color_schemes[].mapping[].hex` | A hex color code (`#D68A59`), not language content. | Read directly from `content/en/puzzles-cute.json`. |
| `body.dot_guide.sections[].range`, `...mapping[].range` | A numeric dot-count range (e.g. `1–15`). Digits, not prose — and this site's convention keeps Western numerals in every locale's copy (confirmed in the Arabic homepage SEO strings already in `LOCALIZED_HOME_SEO`, e.g. "100 نقطة" keeps the literal `100`). | Read from `puzzles-cute.json`; cross-checked against `LOCALIZED_HOME_SEO['ar']`. |
| `header.json_ld.age_range` | A numeric age range (e.g. `5-9`), not prose. | `audit_single_puzzle.py`'s schema notes. |
| `header.json_ld.image`, `body.hero_image`, `heroImage.src`/`width`/`height` (blog, prod-TS-shell scope) | File paths / dimensions, not content. Only the matching `*_alt` field (e.g. `header.og.image_alt`, `heroImage.alt`) is real prose and must be translated. | `audit_single_puzzle.py` / `audit_blog.py` docstrings + schema. |
| `header.json_ld.*.type` (`header.json_ld.type`, `.website.type`, `.organization.type`, `.collection_page.type`, `.item_list.type`) | schema.org vocabulary constants (`CreativeWork`, `WebSite`, `Organization`, `CollectionPage`, `ItemList`) — part of the JSON-LD spec, not copy. Changing these breaks structured data, it doesn't localize it. | `audit_single_puzzle.py` (`NEW_FIELD_ONLY`), `audit_home.py` (`build_header_rows`). |
| `header.json_ld.organization.same_as` | Array of literal social-media profile URLs (Pinterest/Facebook/YouTube). | `audit_home.py` `build_header_rows`. |
| `header.canonical`, `header.og.url` | Computed `/{locale}/` route templates, filled in by code at render time — not stored prose. | `audit_home.py` `build_header_rows` (marked `computed=True`). |
| `header.manifest` | Constant path (`/manifest.webmanifest`). | `audit_home.py`. |
| `header.twitter.card` | Constant enum value (`summary_large_image`). | `audit_home.py`. |
| `header.og.site_name` | The site's brand name (`DotToDotFreePrintables.com`) — a proper noun kept identical in every locale by design, same as any brand name. | `audit_home.py`; confirmed identical in the `ar/de/es/fr/it/ja/ru` home rows already populated. |

**Everything else in a given entry — titles, descriptions, alt text,
tagline, fun facts, dot-guide `name`/`note`/`part`/`why`/`color` (a color's
*name*, e.g. "Crayola Raw Sienna", is prose and must be translated even
though its paired `hex` is not), FAQ text, blog body sections, related-link
`title`/`description` — is real content and rule 1 applies normally: it
must be genuinely translated, never copied from English.**

If you find another field that looks technical while doing translation
work, verify it the same way (diff `content/en` against an already-fully-
translated locale like `ar`/`de`/`es` for a shared entry) before adding it
here — don't assume from the field name alone.

### This list is now enforced in code, not just documentation

`generator/mapping-check/i18n_technical_fields.py` is the single source of
truth (`TECHNICAL_NEW_KEYS` / `is_i18n_required()`) — this table above is
its human-readable explanation, not a separate thing to keep in sync by
hand. Every `mapping_audit_*.db` now has an **`i18nRequired` column**
(`INTEGER`, `0`/`1`):

- `i18nRequired = 0` — technical field. Its `Legacy_value_by_key`/`new_value`
  are **always** forced equal to the `en` row's value, for every language,
  regardless of what a per-language lookup would have found. This was
  backfilled once for existing data via `migrate_add_i18n_required.py`
  (2026-08-12: ~24% of rows in every puzzle-category table are technical,
  matching the density of `slug`/`hex`/`range`/JSON-LD-constant fields per
  entry) and is applied automatically by `clone_en_to_language.py` for
  every future language run — you do not need to do anything extra.
- `i18nRequired = 1` — real content. Populated by per-language lookup as
  normal; empty means genuinely missing, exactly as §3 (gap inventory)
  describes.

**Consequence for the gap counts in §3 below:** they were generated
*before* this column existed, so they include technical fields that used
to show up as false "gaps" whenever a language's raw content lacked that
exact key path (even though the correct value — the English one — was
knowable all along, e.g. the `az` `slug` example that prompted this
column). Re-run the query in §5 filtered to `i18nRequired=1` to get the
*true* remaining translation workload, which will be measurably smaller
than §3's numbers. Regenerate §3's table before relying on it for
planning.

---

## 3. Current gap inventory (generated 2026-08-12, from the phase-1 audit — PRE-DATES the `i18nRequired` column, see note above)

Aggregated across all 14 language-scoped tables
(`blog_all, canada, circus, cute, dinosaurs, flowers, garden, home, legal,
ocean, playgrounds, space, uae, usa-250`). Re-generate this table yourself
before starting work on a language — prod content changes over time and
this snapshot will go stale.

| Language | Total rows | Empty rows | Empty % | Whole-table gaps (0 rows — entire category untranslated) |
|---|---|---|---|---|
| `az` | 7345 | 1700 | 23.1% | — |
| `fa` | 7345 | 1700 | 23.1% | — |
| `hr` | 7345 | 1700 | 23.1% | — |
| `id` | 7345 | 1700 | 23.1% | — |
| `sk` | 7345 | 1700 | 23.1% | — |
| `cs` | 7345 | 1695 | 23.1% | — |
| `da` | 7345 | 1695 | 23.1% | — |
| `el` | 7345 | 1695 | 23.1% | — |
| `hu` | 7345 | 1695 | 23.1% | — |
| `it` | 7345 | 1694 | 23.1% | — |
| `ja` | 7345 | 1563 | 21.3% | — |
| `ko` | 7345 | 1563 | 21.3% | — |
| `lt` | 7345 | 1563 | 21.3% | — |
| `lv` | 7345 | 1563 | 21.3% | — |
| `ru` | 7345 | 1563 | 21.3% | — |
| `sl` | 7345 | 1563 | 21.3% | — |
| `th` | 7345 | 1563 | 21.3% | — |
| `uk` | 7345 | 1563 | 21.3% | — |
| `vi` | 7345 | 1563 | 21.3% | — |
| `pt` | 7345 | 1562 | 21.3% | — |
| `es` | 7345 | 1561 | 21.3% | — |
| `fi` | 7345 | 1558 | 21.2% | — |
| `fr` | 7345 | 1558 | 21.2% | — |
| `nl` | 7345 | 1557 | 21.2% | — |
| `no` | 7345 | 1557 | 21.2% | — |
| `pl` | 7345 | 1557 | 21.2% | — |
| `pt-BR` | 7345 | 1557 | 21.2% | — |
| `ro` | 7345 | 1557 | 21.2% | — |
| `sv` | 7345 | 1557 | 21.2% | — |
| `tr` | 7345 | 1557 | 21.2% | — |
| `ar` | 6772 | 1392 | 20.6% | `usa-250` (no `content/ar/puzzles-usa-250.json` in prod at all) |
| `de` | 7146 | 1409 | 19.7% | `circus`, `space` (no `content/de/puzzles-circus.json` / `puzzles-space.json` in prod at all) |

Two categories are thin **in every language**, `en` included relative to
the other categories — this is a real, pre-existing content-authoring gap,
not a translation gap: `circus` (66/86 = 76.7% empty for every non-en
locale) and `space` (83/113 = 73.5%). These puzzles are largely missing
`seoTitle`/`seoDescription`/`seoImageAlt` in EVERY language's legacy JSON,
including English — translating won't fix this, the English source content
itself needs authoring first. Flag this back to whoever owns puzzle content
authoring; do not attempt to "translate" a field that has no English
source to translate from.

---

## 4. Two kinds of gap — treat them differently

**A. Whole-table gaps** (`ar`/`usa-250`, `de`/`circus`, `de`/`space`): the
entire `content/<lang>/puzzles-<category>.json` file doesn't exist. This is
new-file authoring, not field-filling — translate the entire English
category file's structure and content into the target language, matching
the schema of `content/en/puzzles-<category>.json` exactly (same puzzle
count, same per-puzzle field set). This is the highest-value, most visible
gap per language — prioritize these first.

**B. Field-level gaps** (the bulk of the ~21-23% empty rates): individual
fields within an *existing* entry are missing (a puzzle exists in
`content/<lang>/puzzles-cute.json` but its `seoImageAlt` is absent, or a
blog post referenced by `en` doesn't have a `content/<lang>/blog.json`
entry at all yet). Use the query in §5 to find the exact field/entry per
language before writing anything.

---

## 5. How to find exactly what's missing for a language

**Always filter to `i18nRequired=1`** — otherwise you'll waste translation
effort on fields like `slug`/`hex`/schema.org constants that are supposed
to be empty-then-forced-to-English, not translated (see §2). As of the
`i18nRequired` column, these no longer show up as empty at all (they were
force-filled with the English value), but keep the filter anyway as a
guard in case a db is ever regenerated before that backfill runs again.

```bash
cd generator/mapping-check
python -c "
import sqlite3, glob
LANG = 'az'   # change per run
for f in sorted(glob.glob('mapping_audit_*.db')):
    conn = sqlite3.connect(f)
    try:
        rows = conn.execute('''
            SELECT puzzle_slug, legacy_key, new_key
            FROM mapping_audit
            WHERE language=? AND i18nRequired=1
                             AND (Legacy_value_by_key IS NULL OR Legacy_value_by_key='')
                             AND (new_value IS NULL OR new_value='')
            ORDER BY puzzle_slug, new_key
        ''', (LANG,)).fetchall()
        if rows:
            print(f'--- {f} ({len(rows)} empty) ---')
            for r in rows[:20]:
                print(' ', r)
            if len(rows) > 20:
                print(f'  ... and {len(rows)-20} more')
    except Exception:
        pass
    conn.close()
"
```

`puzzle_slug` tells you which prod entry to open (or create) in
`content/<lang>/<file>.json`; `legacy_key`/`new_key` tell you which field.
Cross-reference against the *same* `puzzle_slug` in `content/en/<file>.json`
to see the English source content and the expected field shape.

---

## 6. MUST back up before writing to prod content

This phase writes to files phase 1 never touched. Before editing any
`content/<lang>/*.json`:

```bash
cp -r dot-to-dot-web/content/<lang> dot-to-dot-web/content/<lang>.bak-$(date +%Y%m%d-%H%M%S)
```

(or your platform's equivalent — same principle as phase 1's db backups,
applied to the new thing being written.) If something goes wrong, restore
from this copy, not from memory.

---

## 7. MUST re-verify against the audit after every edit

After adding/editing content for a language:

```bash
python clone_en_to_language.py <lang> --only <table>
```

Re-running this **must not fabricate** the newly-added values — it reads
your real prod edit and fills the row from it, same as any other run.
Confirm:
1. The specific row(s) you just filled now show a non-empty
   `Legacy_value_by_key`/`new_value` matching what you actually wrote.
2. The empty count for that table dropped by exactly the number of fields
   you filled — not more, not less. A bigger-than-expected drop means you
   accidentally filled something you didn't intend to; a smaller drop means
   your edit didn't land where the audit expects it (wrong key path, wrong
   file, wrong slug).
3. Row counts still match `en` exactly (phase 1's rule 1 still applies —
   you're not supposed to be adding new rows here, only filling existing
   ones, except for whole-table gaps per §4.A which need a full new-file
   population run after the file is created).

---

## 8. MUST NOT touch English content or other languages' data

Only ever edit `content/<target-lang>/*.json`. Never touch
`content/en/**`, never touch another language's directory while working a
different one, never edit `generator/mapping-check/*.db` directly by hand
(only `clone_en_to_language.py` writes to those, per phase 1 rule 2).

---

## 9. Progress tracking

Update the table in §3 after finishing a language (dry-run the query in §5
again, recompute the aggregate). Mark whole-table gaps in §4.A as resolved
here once the new category file exists and phase-1's `clone_en_to_language.py
<lang>` populates full row counts with no `SKIP` for that table.

**Status: not started.** No prod content has been edited under this phase
yet — every number in §3 is the pre-translation baseline.

---

## 10. If you think you need to deviate from this file

Same policy as phase 1: you don't. If a language's content structure is
genuinely different in a way these rules don't cover (a schema variant, a
locale with RTL-specific fields, etc.), stop and say so explicitly, update
this document with the new case, then proceed — don't improvise silently.
