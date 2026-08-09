# Prompt: Common Template Generator (Next.js)

## Context
DotToDotFreePrintables.com runs on Next.js as a static site generator. Puzzle and collection content is authored as validated JSON (via an existing form-based CMS tool) and needs to flow into Next's static generation (`getStaticPaths` / `getStaticProps`, or the App Router equivalent) rather than being hand-written as one-off page files or generated as raw HTML outside of Next.

Two page types must be generated from data, not hand-coded per instance:
1. **Collection pages** — one per category (e.g. `/collections/flowers`), listing every puzzle in that category, sourced from that category's single JSON file (see `collection-json-schema-prompt.md`).
2. **Puzzle pages** — one per individual puzzle (e.g. `/collections/flowers/puppy-dot-to-dot`), sourced from that same category JSON file's `puzzles` array.

There is also a **master collections index page** (e.g. `/collections`) listing all categories/collections with a thumbnail and short description each — this should also be generated from data rather than hand-coded.

## Locking requirement (important — read carefully)
Once each of the following is built, tested, and confirmed stable, it must be treated as **locked**: no future AI-assisted edit should modify these files without explicit human instruction to unlock them. This is a deliberate safeguard so that automated/AI-driven edits later (e.g. content updates, new categories) cannot accidentally corrupt shared structure, meta tag handling, or SEO-critical markup.

The three components to build, in order:

### 1. Shared header/meta template
A single shared component (e.g. `<PageHead>` or a shared layout template) responsible for ALL `<head>` output: title, meta description, Open Graph tags, and JSON-LD injection. Both the collection template and the puzzle template must import/include this same component — no duplicated head logic in either.
- Must accept the relevant `header` object (from either a collection JSON or a puzzle JSON) as props and render it generically — it should not contain any hardcoded content.
- Must support injecting the appropriate JSON-LD type per page type (collection page JSON-LD vs. individual puzzle JSON-LD vs. breadcrumb JSON-LD — see `collection-json-schema-prompt.md` for the schema.org types involved).
- **This file gets locked once stable.**

### 2. Collection page template
Generates each category's landing page (`/collections/[category]`) plus the master collections index page (`/collections`).
- Sourced entirely from category JSON files — one `getStaticProps`/`getStaticPaths` pattern that reads a category's collection header/body fields plus its nested `puzzles` array.
- Renders the shared header/meta template with the collection's `header` object.
- Renders collection body content (h1, name, tagline, description, hero image).
- Renders a grid/list of every puzzle in that category's `puzzles` array, each linking to its individual puzzle page. This list must be fully dynamic — adding a new puzzle entry to the category JSON should automatically extend this listing on next build, with zero template changes.
- Renders breadcrumb navigation (Home → Collection) matching the breadcrumb JSON-LD emitted in the head.
- The master `/collections` index page should loop over all category JSON files and list each collection (using each collection's `body.name`, `tagline`, and `hero_image`).
- **This file gets locked once stable.**

### 3. Puzzle page template
Generates each individual puzzle page (`/collections/[category]/[puzzle-slug]`).
- Sourced entirely from a single puzzle entry within a category JSON file's `puzzles` array.
- Renders the shared header/meta template with the puzzle's `header` object.
- Renders puzzle body content (h1, name, tagline, description, fun_fact, dot_guide sections, color_schemes).
- Renders breadcrumb navigation (Home → Collection → Puzzle).
- Renders a link back to its parent collection page.
- All images and any downloadable assets (e.g. printable PDF) are rendered using the relative asset paths stored in the JSON (see Image Paths below) resolved against a single configurable base assets path — never hardcoded per-puzzle in the template.
- **This file gets locked once stable.**

## Image and asset path handling
- JSON stores only relative paths (e.g. `/images/flowers/puppy-dot-to-dot.png`), never full domain-qualified URLs.
- The template resolves these against a single base path/CDN root defined in one place (e.g. a config/env value), so the domain or CDN can change later without touching any JSON file or any per-puzzle code.
- Apply this identically to puzzle images, collection hero images, and OG images.

## Linking requirements
- Puzzle → parent collection: derived automatically from which category JSON file the puzzle entry lives in — do not require a manually-authored "parent" field.
- Collection → all its puzzles: derived automatically by looping the `puzzles` array — do not hardcode a puzzle list anywhere in the template.
- Breadcrumbs on both page types generated from the same category/puzzle relationship, not manually authored per page.

## Deliverable
1. The shared header/meta component.
2. The collection page template (including the master collections index).
3. The puzzle page template.
4. A short written explanation of the `getStaticPaths`/`getStaticProps` (or App Router equivalent) data-loading strategy used to turn the category JSON files into all of the above pages at build time.
5. Confirmation of which files are recommended to be locked once verified stable, and a suggested way to mark/enforce that (e.g. a code comment banner, a lint rule, or a README note) so it's clear to any future AI-assisted edit that these are off-limits without explicit unlock instruction.
