# Puzzle Content Generator — Field-by-Field Guide

Based on the live puzzle data in `content/en/` and example puzzles like Cute Puppy, Ocean Jellyfish, and Seahorse.

---

## How the content system works

Each puzzle lives in **one JSON file per locale** under `content/{locale}/puzzles-{category}.json`.
The same `slug` must appear in every locale file. English (`en`) is the master; all other locales translate the human-readable fields only.

**33 active locales:** ar, az, cs, da, de, el, en, es, fa, fi, fr, hr, hu, id, it, ja, ko, lt, lv, nl, no, pl, pt, pt-BR, ro, ru, sk, sl, sv, th, tr, uk, vi

**9 categories:** cute, dinosaurs, ocean, garden, flowers, circus, playgrounds, canada, uae, planes, space, usa-250

---

## Puzzle JSON schema (English master)

```json
{
  "slug": "cute-puppy-dot-to-dot-puzzle",
  "name": "Cute Puppy",
  "seoTitle": "Cute Puppy Dot to Dot — 70 Dots Printable",
  "seoH1": "Cute Puppy Dot to Dot — 70 Dots of Printable Fun",
  "tagline": "A Furry Friend Is Waiting to Say Hello!",
  "description": "Connect 70 dots to reveal an adorable puppy. ...",
  "seoDescription": "Puppies can't see for two weeks after birth. Reveal this curious pup across 70 dots with a free printable PDF for ages 5–9.",
  "funFact": "Puppies are born unable to see or hear — their eyes and ears open at around two weeks old...",
  "seoImageAlt": "Adorable floppy-eared puppy wagging into view across 70 printable dots",
  "dotGuide": { ... }
}
```

### Field rules

| Field | Rule |
|---|---|
| `slug` | kebab-case, ends in `-dot-to-dot-puzzle`. Same across ALL locales — never translate. |
| `name` | Short display name. Translated per locale. |
| `seoTitle` | Under 60 chars. Include dot count + keyword. |
| `seoH1` | Slightly longer than seoTitle, adds "Printable Fun" or similar hook. |
| `tagline` | One punchy line. Child-friendly. |
| `description` | 1–2 sentences. Lead with what the child does ("Connect N dots to reveal..."). Include what skill it builds. |
| `seoDescription` | Under 155 chars. Lead with a surprising animal/object fact, end with dot count + age range. |
| `funFact` | 1–2 sentences. Must be a genuine, verifiable fact. Not repeated in seoDescription. |
| `seoImageAlt` | Describes the card image as if the puzzle is mid-reveal. Include dot count. |

---

## Difficulty rubric (auto-derived from dot count)

| Dot count | Difficulty | Age range | Sections in dotGuide |
|---|---|---|---|
| 10–20 | Easy | ages 3–5 | 2–3 sections |
| 21–50 | Easy–Medium | ages 4–7 | 3–4 sections |
| 51–100 | Medium | ages 5–9 | 4–5 sections |
| 101–150 | Hard | ages 7–12 | 5–6 sections |
| 150+ | Expert | ages 9–12+ | 6+ sections |

**Never enter difficulty or age range manually.** The generator computes it from `dotCount`.

---

## dotGuide structure

The `dotGuide` is the richest part of the page — a step-by-step drawing walkthrough that teaches kids what they are drawing as they go.

```json
"dotGuide": {
  "intro": "One paragraph. Set the scene, name the animal/object, build excitement. Mention dot count.",
  "sections": [
    {
      "range": "1–15",
      "title": "The Head and Floppy Ears",
      "learn": "What the child draws in this range. Mention what makes the lines in this section distinctive (curves, precision, long strokes). Include a teaching tip.",
      "fact": "A real fact about the relevant body part or animal behaviour. Different from the main funFact."
    }
  ],
  "outro": "Celebrate completion. Suggest colouring. Link back to the puzzle index with: discover more free <a href=\"/\">dot to dot printables</a>.",
  "colorSchemes": [ ... ]
}
```

### Section writing rules

- Divide dots into logical body parts (head, body, legs, tail, etc.)
- Each section: 10–20 dots, 3–5 sections total depending on difficulty
- `learn` field: describe the drawing task + what skill it practises (curves, precision, flowing lines, etc.)
- `fact` field: one new fact per section, not repeated anywhere else in the puzzle
- Range notation: use en-dash `–` not hyphen `-` (e.g. `"1–15"`)

### colorSchemes (optional but high-value)

Provide 1–3 real-world colour variants with specific Crayola colour names and hex values:

```json
"colorSchemes": [
  {
    "name": "Golden Retriever Puppy",
    "note": "One sentence about why this colour variant is interesting.",
    "mapping": [
      {
        "range": "1–15",
        "part": "Head and floppy ears",
        "color": "Crayola Raw Sienna",
        "hex": "#D68A59",
        "why": "Why this colour fits this body part."
      }
    ]
  }
]
```

---

## Localized fields (what changes per locale)

Translate these fields for each locale:
- `name`
- `tagline`
- `description`
- `funFact`
- `dotGuide.intro`
- `dotGuide.sections[*].title`
- `dotGuide.sections[*].learn`
- `dotGuide.sections[*].fact`
- `dotGuide.outro`
- `colorSchemes[*].name`, `colorSchemes[*].note`, `colorSchemes[*].mapping[*].why`

Do NOT translate (keep English values):
- `slug`
- `seoTitle`, `seoH1`, `seoDescription`, `seoImageAlt` (these are generated per-locale by `lib/localized-seo.ts`)
- `colorSchemes[*].color`, `colorSchemes[*].hex`, `colorSchemes[*].range`, `colorSchemes[*].part`

---

## Image asset requirements

All images go in `data/{PuzzleName}/` (PascalCase folder name):

| File | Purpose |
|---|---|
| `{slug}-puzzle.webp` | Main puzzle image (dots only) |
| `{slug}-card.webp` | Thumbnail for category page |
| `{slug}.png` | Original PNG (source) |
| `{slug}.pdf` | Printable PDF |
| `{slug}_horizontal.pdf` | Landscape PDF (optional) |

**Generator must validate these files exist before writing any content JSON.**

---

## Generator input template (new puzzle checklist)

```
PUZZLE NAME:       e.g. "Cute Fox"
CATEGORY:          e.g. "cute"
SLUG:              e.g. "cute-fox-dot-to-dot-puzzle"
DOT COUNT:         e.g. 58
IMAGE FOLDER:      e.g. data/Cute_Fox/
THEME / SUBJECT:   e.g. a red fox sitting with its tail curled around it
FUN FACT (EN):     e.g. Foxes can make over 40 different sounds to communicate.
BODY PARTS (in dot order):
  1–12  → ears and forehead
  13–28 → face and snout
  29–42 → body
  43–54 → legs and paws
  55–58 → tail tip
```

The generator takes this input and outputs:
1. One complete English JSON entry to append to `content/en/puzzles-{category}.json`
2. A stub entry (name + tagline + description placeholders) for all 32 other locales
3. A validation report confirming image files exist

---

## What the page template auto-generates (never hand-edit)

Handled by `lib/seo.ts` and `lib/localized-seo.ts` — do not write these into content JSON:

- `og:locale` and `og:locale:alternate` — from `lib/seo.ts → ogLocaleFor()` + `ogAlternateLocalesFor()`
- Canonical URL — from `buildAlternates(locale, /${category}/${slug})`
- hreflang tags — from routing config
- JSON-LD structured data — from `puzzleJsonLd()` and `howToJsonLd()`
- Difficulty badge — computed from dot count at render time
- Age range — computed from dot count at render time
- Related puzzles — auto-pulled from same category

---

## Validation checks (run before commit)

```
✓ slug exists in content/en/puzzles-{category}.json
✓ same slug exists in all 33 locale files
✓ description field non-empty in all locales (or explicit "TBD" marker)
✓ image files exist: data/{folder}/{slug}-puzzle.webp and {slug}-card.webp
✓ dotGuide.sections has at least 3 entries
✓ no locale string hardcoded in template files (e.g. "vi_VN" appearing outside locales config)
✓ dot count matches difficulty rubric expectation
```

---

## Example: Seahorse (35 dots, Easy, ages 4–7)

**Folder:** `data/Seahorse/`
**Files:** `Seahorse_35_dots_easy-puzzle.webp`, `Seahorse_35_dots_easy-card.webp`, PDF + horizontal PDF

**Dot sections (3 sections, Easy tier):**
- 1–12: Head and snout crown
- 13–24: Body and fin
- 25–35: Curling tail

**Difficulty auto-output:** Easy · Ages 4–7 · 3 sections

---

## Example: Cute Puppy (70 dots, Medium, ages 5–9)

**Folder:** `data/Cute_Puppy/` (inferred)
**Dot sections (5 sections, Medium tier):**
- 1–15: Head and floppy ears
- 16–30: Face and friendly snout
- 31–45: Body
- 46–58: Legs and paws
- 59–70: Wagging tail

**Color schemes provided:** Golden Retriever, Dalmatian, Black Labrador

---

## Files in this folder

| File | Purpose |
|---|---|
| `BUILD-SPEC.md` | Architecture spec — what the system must guarantee |
| `GENERATOR-CONTENT-GUIDE.md` | This file — field rules, schema, examples |
| `generate-puzzle.mjs` | Generator script (to be built) |
| `validate-content.mjs` | Pre-commit validator (to be built) |
