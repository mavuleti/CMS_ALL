# Dot-to-Dot Puzzle JSON — Schema & Form Generator

## 1. Purpose

Each puzzle page (e.g. "Cute Puppy") is represented as one JSON entry. The entry
is split into two top-level sections that mirror the actual HTML page:

- **`header`** — everything that lives in `<head>`: SEO title, meta description,
  Open Graph tags, JSON-LD structured data.
- **`body`** — everything visible on the page: H1, tagline, description, fun
  fact, and the full dot guide (step-by-step sections + color schemes).

This split makes it obvious, at a glance, which key feeds which part of the
page — and makes it easy for a technical or non-technical person to jump
straight to the section they need to fix.

## 2. Naming Convention

| Old key (flat)   | New key (namespaced)              | Maps to                        |
|------------------|------------------------------------|---------------------------------|
| `seoTitle`       | `header.title`                     | `<title>` tag                   |
| `seoDescription` | `header.meta_description`          | `<meta name="description">`     |
| `seoImageAlt`    | `header.og.image_alt`              | Open Graph image alt text       |
| —                | `header.og.title` / `.description` | Open Graph tags (new)           |
| —                | `header.json_ld.*`                 | JSON-LD structured data (new)   |
| `seoH1`          | `body.h1`                          | `<h1>` tag                      |
| `name`           | `body.name`                        | Puzzle name                     |
| `tagline`        | `body.tagline`                     | Page tagline                    |
| `description`    | `body.description`                 | Intro paragraph                 |
| `funFact`        | `body.fun_fact`                    | Fun fact callout                |
| `dotGuide`       | `body.dot_guide`                   | Step-by-step guide + coloring   |
| `slug`           | `slug` (unchanged, top-level)      | URL routing, not page content   |

Rule of thumb: `<section>_<element>`, snake_case, nested under `header` or
`body` depending on where it renders.

## 3. Full Schema

```json
{
  "slug": "cute-puppy-dot-to-dot-puzzle",
  "header": {
    "title": "string — required, 30–60 chars",
    "meta_description": "string — required, 70–160 chars",
    "og": {
      "title": "string — required, max 60 chars",
      "description": "string — required, max 200 chars",
      "image_alt": "string — required, max 125 chars"
    },
    "json_ld": {
      "type": "string — required, e.g. CreativeWork",
      "name": "string — required",
      "description": "string — required, max 200 chars",
      "image": "string (URL) — required",
      "educational_use": "string — required",
      "age_range": "string — required, e.g. 4-8"
    }
  },
  "body": {
    "h1": "string — required, 20–70 chars",
    "name": "string — required, max 60 chars",
    "tagline": "string — required, max 80 chars",
    "description": "string — required, 50–300 chars",
    "fun_fact": "string — required, 20–400 chars",
    "faqs": [
      { "q": "string — required", "a": "string — required" }
    ],
    "dot_guide": {
      "intro": "string — required, min 50 chars",
      "sections": [
        {
          "range": "e.g. 1–15",
          "title": "string, max 60 chars",
          "learn": "string, min 20 chars",
          "fact": "string, min 20 chars"
        }
      ],
      "outro": "string — required, min 20 chars",
      "color_schemes": [
        {
          "name": "string",
          "note": "string",
          "mapping": [
            {
              "range": "e.g. 1–15",
              "part": "string",
              "color": "string",
              "hex": "#RRGGBB",
              "why": "string"
            }
          ]
        }
      ]
    }
  }
}
```

## 4. Validation Rules (enforced in the Angular form)

Single source of truth: `src/app/models/field-rules.ts`

| Field                        | Required | Min | Max |
|-------------------------------|:--------:|:---:|:---:|
| `slug`                        | ✅       | —   | —   |
| `header.title`                 | ✅       | 30  | 60  |
| `header.meta_description`      | ✅       | 70  | 160 |
| `header.og.title`              | ✅       | —   | 60  |
| `header.og.description`        | ✅       | —   | 200 |
| `header.og.image_alt`          | ✅       | —   | 125 |
| `header.json_ld.*`             | ✅       | —   | —   |
| `body.h1`                      | ✅       | 20  | 70  |
| `body.name`                    | ✅       | —   | 60  |
| `body.tagline`                 | ✅       | —   | 80  |
| `body.description`             | ✅       | 50  | 300 |
| `body.fun_fact`                | ✅       | 20  | 400 |
| `body.faqs`                    | ✅       | 1 item | each item requires non-empty `q` and `a` |
| `dot_guide.intro`              | ✅       | 50  | —   |
| `dot_guide.outro`              | ✅       | 20  | —   |
| Dot range fields (`1–15`)      | ✅       | format: `\d+[–-]\d+` |
| Hex color fields               | ✅       | format: `#RRGGBB` |

## 5. Using the Angular App

```bash
unzip dot2dot-form-angular8.zip
cd dot2dot-form
npm install
ng serve
```

Open `http://localhost:4200`. Fill in Header, Body, Dot Guide sections, and
Color Schemes (add/remove rows as needed). Click **Generate JSON** — invalid
fields are highlighted with inline messages. Once valid, a JSON preview
appears with a **Download JSON File** button that saves it as `{slug}.json`.

## 6. Roadmap

- **Phase 1 (done):** Single-entry form + JSON generation, this doc.
- **Phase 2 (next):** Group multiple entries into one array (e.g. by category
  — cute, dinosaurs, ocean, etc.), likely via a "puzzle group" selector at the
  top of the form that lets you add entries to a running JSON array and
  export them all together.

## 7. Files in this delivery

- `dot2dot-form-angular8.zip` — Angular 8 project source
- `puzzles-cute-converted.json` — your existing 11 puzzles migrated to this
  schema (og.image and json_ld.age_range are placeholders — not in the
  original data, need manual fill-in)
- `puzzle-json-schema.md` — this file

## Additional Validators (added Aug 2026)

**Language/script check** — A "Content language" dropdown (English / Arabic) sits at the top of the form. Every free-text field (titles, descriptions, tagline, fun fact, dot guide text, section learn/fact) is checked against the selected script: English mode flags Arabic characters, Arabic mode flags Latin characters. URLs and email addresses are always exempt in either mode. Slug, hex codes, and structured IDs are not language-checked.

**Character limits (per current Google guidance, checked Aug 2026)**
- `header.title`: 30–60 characters (Google truncates by pixel width, not strict character count — 60 is a safe ceiling)
- `header.meta_description`: 70–158 characters (~155–160 is the commonly cited safe range)
- JSON-LD fields: Google's current guidance is less about character counts and more about the structured data matching what's visibly on the page — don't put anything in `json_ld` that doesn't also appear in the visible body content.

**Image asset-path check** — image and PDF fields must be root-relative paths from the configured assets root. They start with exactly one `/`, contain no scheme, host, query, fragment, backslash, or `..` segment, and use a supported extension. Images end in `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.svg`; PDFs end in `.pdf`.

## Collection document schema

Category files may use the collection-document shape below. `puzzles` retains the existing puzzle-entry structure unchanged. There is deliberately no `canonical` field.

```json
{
  "collection": {
    "header": {
      "title": "30–60 characters",
      "meta_description": "70–158 characters",
      "og": { "title": "1–60 characters", "description": "1–200 characters", "image": "/images/category/cover.webp" },
      "json_ld": {
        "type": "CollectionPage",
        "name": "1–60 characters",
        "description": "1–200 characters",
        "image": "/images/category/cover.webp",
        "main_entity": { "type": "ItemList", "item_source": "puzzles" }
      },
      "breadcrumb_json_ld": {
        "type": "BreadcrumbList",
        "items": [
          { "position": 1, "name": "Home", "path": "/" },
          { "position": 2, "name": "Collection name", "path": "/category/" }
        ]
      }
    },
    "body": {
      "h1": "20–70 characters",
      "name": "1–60 characters",
      "tagline": "1–80 characters",
      "description": "50–300 characters",
      "hero_image": "/images/category/cover.webp",
      "slug": "lowercase-kebab-case"
    }
  },
  "puzzles": ["existing puzzle entries, unchanged"]
}
```

| Collection field | Required | Min | Max / format |
|---|:---:|:---:|---|
| `collection` | ✅ | — | object; no unknown fields |
| `collection.header.title` | ✅ | 30 | 60 characters |
| `collection.header.meta_description` | ✅ | 70 | 158 characters |
| `collection.header.og.title` | ✅ | 1 | 60 characters |
| `collection.header.og.description` | ✅ | 1 | 200 characters |
| `collection.header.og.image` | ✅ | — | root-relative supported image path |
| `collection.header.json_ld.type` | ✅ | — | exactly `CollectionPage` |
| `collection.header.json_ld.name` | ✅ | 1 | 60 characters |
| `collection.header.json_ld.description` | ✅ | 1 | 200 characters; matches visible copy |
| `collection.header.json_ld.image` | ✅ | — | root-relative supported image path |
| `collection.header.json_ld.main_entity.type` | ✅ | — | exactly `ItemList` |
| `collection.header.json_ld.main_entity.item_source` | ✅ | — | exactly `puzzles`; build-only |
| `collection.header.breadcrumb_json_ld.items` | ✅ | 2 items | Home, then Collection |
| `collection.body.h1` | ✅ | 20 | 70 characters |
| `collection.body.name` | ✅ | 1 | 60 characters |
| `collection.body.tagline` | ✅ | 1 | 80 characters |
| `collection.body.description` | ✅ | 50 | 300 characters |
| `collection.body.hero_image` | ✅ | — | root-relative supported image path |
| `collection.body.slug` | ✅ | 1 | lowercase kebab case; unique |
| `collection.body.faqs` | ✅ | 1 item | each item requires non-empty `q` and `a` |
| `puzzles` | ✅ | 1 item | existing puzzle rules unchanged |

The stored `CollectionPage` identifies the landing page; its `main_entity` instructs the build to generate a schema.org `ItemList` from sibling `puzzles` in display order. The stored breadcrumb contains stable Home and Collection items. Puzzle builds append position 3 using the selected puzzle's name and route. The renderer converts stored keys to schema.org JSON-LD keys, adds `@context`, resolves paths against the configured public base, and omits the build-only `item_source` field.

**FAQ content** — Every collection and puzzle stores its visible question/answer list in `body.faqs` as `{ "q": "...", "a": "..." }` objects. At least one complete item is required. Questions are 5–200 characters and answers are 20–1,000 characters; both also use the selected locale's script and child-safety validation. A renderer may derive `FAQPage` JSON-LD from this array, but its structured text must exactly match the visible FAQ content. The production importer prefers rich page-specific data from the locale's `faqs.json` and reproduces the localized `messages.json` fallback when no rich pack exists.

**Slug uniqueness** — Slug is checked against the 11 existing "cute" category puzzle slugs plus anything generated earlier in the same session. (Not a live check against the whole site — see Known Limitations.)

**Dot range consistency** — Section ranges (e.g. `1–15`, `16–30`) are checked across all sections: overlapping ranges block submission; gaps between ranges show as a non-blocking note.

**Color name and derived hex** — The form presents `color` as an alphabetical dropdown sourced from `crayola-color-lookup.json`. Selecting a standard Crayola name derives the authoritative `hex`, which is read-only in the form. The schema continues to store both strings and permits imported custom colors; a custom value is shown as “Custom / Other” with a non-blocking informational note.

**Static child-friendliness blocklist** — `body.description`, `body.fun_fact`, and section `learn`/`fact` text are checked against a small static word list (violence, profanity, mature-content terms). **This is a word-list only, not an AI/context check** — it catches obvious offenders but misses tone, sarcasm, and context. It is not a substitute for human review.

## Deterministic save/validate audit log

Every explicit **Validate** and **Save** action creates one append-only audit record, including actions for which no values changed. Empty checks are retained as `"changes": []` because they prove that an entry was reviewed. The snapshot used as `old` is captured once when an import, CMS-tree selection, saved version, or reset loads the entry; saving does not move that baseline.

Audit records are newline-delimited JSON (`log.ndjson`), one object per line:

```json
{"timestamp":"2026-08-09T14:32:07.481Z","action":"save","trigger":"human","entry_id":"flowers-puppy-dot-to-dot","entry_type":"puzzle","changes":[{"field":"header.title","old":"Puppy Dot to Dot","new":"Puppy Dot to Dot Printable"}]}
```

- `action` is `validate` or `save`; `trigger` is `human` or `automated`.
- `entry_id` is the edited puzzle or collection slug and `entry_type` identifies which form view supplied the values.
- Plain objects are compared recursively in sorted-key order. Arrays are atomic fields: if an array changes, its complete old and new values are stored. Missing values are serialized as `null`, keeping every line valid JSON.
- Browser clicks default to `human`. Playwright calls `window.submitAsAutomation({ action: 'validate' | 'save', dryRun?: boolean })`, which reliably marks the entry `automated` and resolves to the computed audit object (plus validation status for validate actions).
- With `dryRun: true`, the form computes and returns the diff but writes neither the audit record nor a saved version.

Browser security prevents a page from silently appending a repository file. The Angular CMS therefore appends records to an IndexedDB audit store and exposes **Audit log** to download the entire append-only stream as `log.ndjson`; the standalone preview keeps the current session's lines in memory and offers the same download. A server/native wrapper can later consume the returned record and append it directly without changing the schema. A single growing log is accepted for now; rotation is intentionally deferred.

### Known limitations of this round of validators
- Slug uniqueness only checks against the 11 puzzles in this session's known list, not a live lookup against the full site — swap in a real API/data call before relying on it in production.
- The blocklist is intentionally small and literal — it will have false positives (e.g. flags "hell" inside "shell") and false negatives (anything not on the list). Treat it as a first-pass filter, not a guarantee.
- Angular version: the new validator *functions* have been added to `custom-validators.ts`, matching the logic in the HTML preview exactly, but they still need to be wired onto the relevant `FormControl`s in `puzzle-form.component.ts` (adding a `language` FormControl, passing it into `languageScriptValidator`, etc.) — the HTML preview is the fully wired, ready-to-use version of all seven checks right now.

## RTL / Internationalization hardening (per current best practice, checked Aug 2026)

- Fields checked for language now flip `dir="rtl"`/`ltr"` live when the language dropdown changes, and their `<label>` flips with them — this is the standard "one form, two direction modes" pattern rather than maintaining separate English/Arabic forms.
- Numbers, URLs, and emails typed inside an RTL field still render left-to-right automatically via the browser's Unicode bidi algorithm — no extra handling needed, this is native behavior once `dir` is set correctly.
- Script detection now uses Unicode script properties (`\p{Script=Arabic}` / `\p{Script=Latin}`) instead of a fixed character range, so Arabic presentation forms and diacritics are caught correctly — plus text is normalized to Unicode NFC before comparison, so visually-identical characters typed via different input methods don't slip past validation.
- CSS uses logical properties (`text-align: start` rather than `left`) on labels and inputs so layout adapts automatically to direction instead of needing separate left/right overrides.

### Still not covered (flagging honestly)
- Numeral style (Western 1-2-3 vs Eastern Arabic-Indic ١-٢-٣ digits) isn't normalized or enforced — current best practice for GCC-facing sites is to default to Western numerals; worth adding if Arabic dates/counts appear in generated content.
- No RTL mirroring of the *icons/buttons* themselves (e.g. "+ Add Section" arrow direction) — only text fields flip. Fine for this form's plain layout, but worth a look if the UI gets more visual.
- Whole-page RTL mirroring (nav, overall reading order) isn't done — only the language-tagged text fields flip individually, since only the *content*, not the tool's own UI, needs to support Arabic right now.
