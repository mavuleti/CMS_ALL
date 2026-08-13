# Task: Backfill missing puzzle-category files for `ar` and `de` locales

## Context
Repo: `dot-to-dot-web` (Next.js site). Puzzle content lives at:
`dot-to-dot-web/content/<locale>/puzzles-<category>.json`

Every locale should have the same category files that `en` has:
canada, circus, cute, dinosaurs, flowers, garden, ocean, playgrounds, uae, usa-250, (and any others — verify against `dot-to-dot-web/content/en/` directory listing for the exact full set).

## What's missing
- **ar**: `puzzles-usa-250.json` does not exist.
- **de**: `puzzles-circus.json` and `puzzles-space.json` do not exist.

(Re-verify this is still accurate by diffing filenames in `content/en/` against `content/ar/` and `content/de/` before starting — file inventory may have changed.)

## What to do
For each missing file, create it by translating the corresponding `en` file into the target language, preserving the exact JSON structure and keys. Do not invent new puzzles or drop any — one output entry per input entry, same `slug` values (slugs are typically not translated; check sibling files in that locale for the slug convention already in use).

### Required structure per puzzle entry
Match the shape used in existing `ar`/`de` files (e.g. `content/de/puzzles-dinosaurs.json`, `content/ar/puzzles-dinosaurs.json`) exactly — same top-level fields, same `dotGuide.sections` shape, same `dotGuide.outro`, etc. Translate all human-readable text fields into the target language; do not translate JSON keys, slugs, hex codes, or numeric ranges.

### Coloring guide (`dotGuide.colorSchemes`) — do not skip
Every puzzle must include a `dotGuide.colorSchemes` array, sibling to `dotGuide.sections`:

```json
"colorSchemes": [
  {
    "name": "string — scheme title, e.g. '<Subject> Challenge: Classic Real-Life Colors'",
    "note": "string — one-line description of the palette style",
    "mapping": [
      {
        "range": "string — must exactly match a dotGuide.sections[].range value",
        "part": "string — must exactly match that section's title (translated)",
        "color": "string — Crayola color name, translated/localized if the locale conventionally localizes color names (check sibling files for precedent)",
        "hex": "string — hex code, e.g. #BAB86C (do not translate/change)",
        "why": "string — one-sentence rationale, translated"
      }
    ]
  }
]
```

- Each puzzle needs 3 named color schemes (pattern seen in `en`: "Classic Real-Life", "Soft Natural", "Bold Real-Life" or category-appropriate equivalents).
- Each scheme's `mapping` array must have exactly one entry per `dotGuide.sections` range in that puzzle — same count, same ranges, same order.
- `hex` values should stay consistent with the `en` version of the same puzzle/part (same color, just localize the name/description).

## Reference / source of truth
- Use `content/en/puzzles-usa-250.json` and `content/en/puzzles-circus.json` / `content/en/puzzles-space.json` as the structural and factual source (dot counts, ranges, sections, part names, hex values).
- Use `content/ar/puzzles-dinosaurs.json` and `content/de/puzzles-dinosaurs.json` (or any other existing file in that locale) as the style/schema reference for how JSON keys, tone, and translated field names are formatted in that locale — match existing conventions exactly (e.g. quote style, formality register, existing translated UI terms).

## Hard rules
1. Do NOT modify any existing file — only create the missing ones listed above.
2. Do NOT touch any `ui-app` directory if one exists in this repo.
3. Output must be valid JSON, UTF-8, matching the exact key order/formatting style of sibling files in that locale (diff against an existing file in the same locale before finalizing).
4. Re-verify file counts/names against `content/en/` before finishing — if the missing-file list above is stale, follow the actual current gap instead.
