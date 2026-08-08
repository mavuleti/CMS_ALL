# Puzzle Page Template Generator — Build Spec

## Problem this solves
New puzzle pages are currently created by copying an existing page file and hand-editing it (often via AI coder). This causes drift: stale/hardcoded locale values (e.g. a leftover `vi_VN` alternate-locale tag appearing on every page regardless of actual language), missing JSON-LD structured data, and inconsistent thin content across ~32 locales × puzzles (3,000+ pages). This spec defines a generator-based system to make that drift structurally impossible.

## Goal
One locked template + one generator script. Adding a new puzzle means supplying structured data, not editing a copied file. The system must generate, validate, and only then allow controlled content population — with hard restrictions on what can ever be hand/AI-edited per locale.

---

## 1. Template must contain zero hardcoded content
- No locale strings, puzzle names, dot counts, or descriptions baked into the template file itself.
- Template is a skeleton of placeholder keys only.
- All actual values come from data files (per-puzzle JSON + per-locale content files), never typed directly into the template.

## 2. Single source of truth for locale metadata
- One central locale config (e.g. `locales.json`) mapping each locale code → its own `og:locale`, correct `og:locale:alternate` list, canonical path prefix, hreflang code, etc.
- Every page pulls from this config at generation time. No page-level locale tag may be written by hand.
- This directly eliminates the Vietnamese (`vi_VN`) leftover-tag problem — there is no place left where a wrong value could be typed.

## 3. Generator input (what you provide per new puzzle)
- Puzzle name
- Category
- Dot count
- Image path (must be validated to exist before generation proceeds — fail generation if missing)
- Per-locale description text (or a placeholder marker like `TBD` if not yet translated)
- Any other structured facts (fun fact, theme)

## 4. What the generator auto-derives (never manually entered)
- Difficulty badge + age range, computed from dot count using the existing rubric:
  - Easy: 10–20 dots (ages 3–5)
  - Medium: 20–50 dots (ages 6–9)
  - Hard: 50–100+ dots (ages 9–12+)
- Related-puzzles block: auto-pulled (2–3 puzzles from the same category), not manually linked.
- JSON-LD structured data block: fully generated from the same data (name, description, difficulty, age range, image, category, language) — never hand-written.
- Published/updated date: stamped automatically at generation/update time.
- Canonical URL: derived from locale + slug, not typed.

## 5. Locked vs. editable zones (critical guardrail)
The generated page/template must have explicit, enforced boundaries on what can be edited after generation — ideally by structure (e.g. content only lives in specific data-file fields, not in the template/component code at all):

**Never editable (generated/system-only):**
- JSON-LD block
- og:locale / og:locale:alternate / canonical / hreflang tags
- Difficulty badge, age range (derived, not entered)
- Related puzzles list
- Published/updated date

**Editable (AI or human may write here, per locale):**
- Puzzle description paragraph
- Fun fact text
- Skill-benefit blurb / "why this helps" line

This means: whoever (AI coder or human) is filling in content per locale can only ever touch the designated text fields in the data file — they have no access to touch template structure, tags, or schema at all, because those aren't exposed as editable surface.

## 6. Validation, not build-blocking
Per your constraint: do NOT run slow post-build audits that force a full rebuild cycle on failure. Instead:
- Run a **fast pre-build/pre-commit static check** that reads source data/template files directly (not a rendered build) — should complete in seconds.
- Checks to include:
  - No hardcoded locale strings found outside `locales.json`
  - JSON-LD generator function is actually invoked in the page template
  - Every puzzle's content file has a non-empty description field for every locale (or explicit `TBD` marker, not silently blank)
  - Image path referenced actually exists on disk
  - Canonical URL matches the locale's folder path

## 7. Why this approach
- Removes the root cause (copy-paste editing) rather than catching drift after the fact.
- Makes correctness structural: bad values have no file/field to be typed into.
- Keeps content work (translation, descriptions) decoupled from structural correctness (schema, tags), so translators/AI can work freely without risk of breaking SEO-critical fields.
- Scales safely to 32+ locales and thousands of puzzles without manual per-page verification.
