# Feature Prompt: Keyword Research Tab + Content Quality Dashboard

**This prompt supersedes the earlier `keyword-density-tracker-prompt.md`.**
That version assumed a flat 20–25 keyword list per language. This version
replaces that data source with a much richer per-locale SEO research file
and adds a full content-quality summary dashboard, not just a count table.

---

## 1. Data source

New source file (already produced separately, structure shown below):
`seo-keywords-locales.json` (Kishor's uploaded file was named
`SEO-KeywordsAndLocalesexpericne.json` — rename/copy to this on ingest).

This file is a **living document** — an automation process keeps adding
more locales over time (33 done as of this writing, more to come). The
form must read whichever locale keys exist at load time — **never hardcode
the list of supported locales from this file.**

### Per-locale shape (varies slightly by locale, treat fields as optional)
Each locale key (e.g. `"telugu"`, `"de"`, `"vi"`, `"az"`) contains one or
more research blocks (e.g. `answer`, `local_search_answer`), each of which
may include:
- `native_search_phrases` / `telugu_script` / `german_search_phrases` etc. —
  phrases in the locale's native script, each with a `meaning` and optional
  `note`
- `*_in_english_letters` — romanized versions of native phrases
- `english_phrases_used_by_locals` / `english_searches` /
  `english_phrase_notes` — English phrases that locals themselves search,
  even though the locale is non-English
- `specialized_searches` — audience- or format-specific variants (e.g. "for
  adults", "PDF", age ranges)
- `local_search_insight` — primary terms, intent modifiers (e.g. "free",
  "print", "worksheet"), and general notes on search behavior
- `suggested_next_steps`, `displayed_result_links`, `source` — supporting
  context, not keyword data itself

Because field names differ slightly per locale (the data was generated
per-locale via AI research, not a fixed schema), **the parser must be
tolerant**: group by known field-name patterns (`native`, `romanized`/`in_english_letters`,
`english_phrases`/`english_search`, `intent`/`insight`) rather than expecting
exact key names to match across every locale.

---

## 2. Top-of-page: Expandable Keyword Research Tab

- Collapsed by default (it's a lot of content); expandable/collapsible
  panel at the top of the form.
- When the language dropdown changes, load that locale's full research
  block from `seo-keywords-locales.json`.
- Display organized into clearly labeled sections, in this order:
  1. **Native phrases** (native script + meaning + any note)
  2. **Romanized phrases** (native language written in English letters)
  3. **English phrases used by locals** (see §3 — English pooling)
  4. **Intent modifiers** (free, print, PDF, worksheet, game, etc.)
  5. **Specialized/audience variants** (adults, age ranges, format-specific)
- Purpose is for a human writer AND an AI content assistant to read
  through and internalize authentic local search behavior — not just a
  keyword bag to stuff. Keep the full meanings/notes visible, not just
  the bare phrases, so the "why" behind each phrase is preserved.
- No editing of this data from the form — it's reference-only display.

---

## 3. English phrase pooling across locales

- Every locale's `english_phrases_used_by_locals` / `english_searches` /
  similar English-language entries represent **global English search
  demand**, not demand specific to that locale's language.
- On load/build, these English phrases should be **extracted from every
  locale and pooled into the English (`en`) locale's own keyword set**,
  deduplicated against whatever native English research already exists
  there.
- The Telugu, Vietnamese, German, etc. locale panels/tables should NOT
  count or display these pooled English phrases as their own — they stay
  native-phrase-only for that locale's tab and table.
- This pooling can be a one-time build step (script) rather than a live
  runtime operation, since the source file only changes when automation
  adds new locales — re-run the pooling step whenever
  `seo-keywords-locales.json` is updated.

---

## 4. Locale-aware matching for the usage table

- Only match/count phrases in the writer's content that are in the
  correct script/language for the currently selected locale.
  - Native-script phrases (e.g. Telugu script) are only counted against
    that locale's own content field — never matched against English text.
  - Romanized phrases count for that same locale's content.
  - English phrases (including pooled ones) only count against the
    English locale's content.
- Matching rules otherwise same as originally scoped: case-insensitive,
  substring match on the full phrase, no stemming.
- Fields scanned: `title`, `meta_description`, `description`/body content
  — same as before.

---

## 5. Bottom-of-page: Content Quality Summary Dashboard

Replaces the plain keyword-count table with a fuller scorecard, auto-populated
live as the writer types:

**Keyword usage table**
- Top keywords/phrases used, sorted by usage count descending (or by
  research rank/priority where available).
- Each row: phrase, meaning (if available), count.
- Phrases with 0 uses visually flagged (muted/red) as before — informational
  only, never blocking.

**Overall content quality score**
- A single derived score/grade (e.g. Poor / Fair / Good / Excellent, or a
  numeric 0–100) based on keyword density and coverage — how many of the
  available researched phrases were actually used, weighted toward
  higher-priority/native phrases over minor variants.
- Exact scoring formula is an implementation detail for the AI coding tool
  to propose — the requirement here is that a clear, simple summary grade
  is shown, not raw numbers only.

**Link analysis**
- Count of **internal links** — links pointing to other pages on
  DotToDotFreePrintables.com.
- Count of **external/extra links** — links pointing to any other domain.
- Detected by scanning `<a href>` tags (or markdown links, depending on
  what format the content field uses) within the content field.
- Displayed as simple counts alongside the keyword summary, so a thin or
  overloaded link profile is visible at a glance.

This whole dashboard is a **writing aid, not a validator** — nothing here
blocks save. It's there so Kishor (or an AI writer) can see content
richness and internal-linking health before publishing.

---

## 6. Implementation locations

Same as prior scoping:
- `puzzle-form-preview.html` (primary build)
- Angular: new component(s), e.g. `keyword-research-tab.component.ts/.html`
  and `content-quality-summary.component.ts/.html`, wired to the existing
  language `FormControl`.

Load `seo-keywords-locales.json` (post-pooling-build version) once per
language change, not on every keystroke. Recompute the live table/summary
on a debounced input event (~300ms), same as originally scoped.

---

## 7. Explicitly out of scope

- No admin UI for editing `seo-keywords-locales.json` — it's produced by
  Kishor's separate automation process.
- No changes to the puzzle JSON schema — this is form-side only, not saved
  as puzzle data.
- No stemming/synonym/NLP matching.
- No enforcement/blocking tied to the quality score — informational only.
- Exact scoring formula for the quality grade is left to the AI coding
  tool to design within the guidance above, not fully specified here.
