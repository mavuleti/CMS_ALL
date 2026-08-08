# Dot-to-Dot CMS

Internal Angular 21 editorial tool for managing multilingual Dot-to-Dot puzzle JSON. It uses the repository-local `content/` copy and never writes to the sibling production project.

## Current implementation

- Upgraded the original Angular 8 application to Angular 21 standalone components.
- Added a searchable category/puzzle sidebar with English puzzle labels and language-aware content loading.
- Copied and migrated the production content into this repository: 33 languages, 326 puzzle files, and 2,711 puzzle entries.
- Added Azerbaijani (`az`) and Persian (`fa`) to the menu so every copied content language is available.
- Migrated legacy flat puzzle records to the structured `slug`, `header`, and `body` schema.
- Added detailed field and cross-field validation with a **Validate Form** action.
- Added **Save Draft**, **Validate**, and **Generate JSON** workflow states stored as `_cms.status`: `draft`, `validated`, and `submitted`.
- Added IndexedDB draft history, automatic latest-draft restore, and a maximum of five versions per puzzle.
- Added version restore, rename, pin, compare, delete, clear, export, and import operations.
- Added unsaved-change protection and a translation-completeness dashboard.
- Added safe JSON export that removes internal CMS metadata.
- Added Angular sanitization and Playwright regression coverage.

## Commands

Run commands from `generator/dot2dot-form-angular8`:

- `npm start` — generate local menu assets and start the development server.
- `npm run build` — generate menu assets and create a production build in `dist/dot-to-dot-cms`.
- `npm test` — build and run the Playwright regression suite.
- `npm run assets:menu` — rebuild the menu manifest and runtime JSON from the local `content/` tree.
- `npm run schema:preview` — preview legacy-schema conversion across every copied language.
- `npm run schema:convert` — create migrated copies in each language's ignored `converted/` directory.

## Content and menu workflow

The repository-level `content/` directory is the CMS working copy. `generator/tools/build_menu_assets.py` reads it, copies puzzle JSON into ignored Angular runtime assets, and creates `manifest.json`.

The menu contains every language with puzzle content. Categories reflect actual file availability for the selected language. Puzzle labels always come from English content, while selecting a puzzle loads JSON for the active language.

The sibling production project at `../dot-to-dot-web` is reference-only. Refreshing the CMS working copy from production must be an explicit copy operation; normal start, build, test, save, and migration commands do not update production.

## Legacy schema migration

`generator/tools/migrate_legacy_schema.py` accepts either individual language directories or the root `content/` directory. By default it writes to `converted/`, validates top-level JSON shapes, uses atomic file replacement, and returns a non-zero exit code when conversion fails. Use `--in-place` only on a disposable or version-controlled local copy.

## Draft and version workflow

Drafts are grouped by language, category, and puzzle slug in browser IndexedDB. Each puzzle retains at most five versions, ordered newest first, and the latest version loads by default. Pinned versions are protected during automatic trimming.

Generated production JSON excludes `_cms` and legacy top-level status metadata. Version-history export retains CMS metadata so it can be imported into another browser session.

## Verification status

Verified after the multilingual migration:

- Angular production build completed successfully.
- Menu manifest contains all 33 languages.
- All 326 puzzle files contain valid structured entries.
- All 2,711 migrated entries include object-valued `header` and `body` properties.
- All six Playwright regression tests passed.
- Git whitespace validation passed.

The Playwright suite covers tree search and language loading, validation/status transitions, five-version retention and latest restore, unsaved-change protection, version management and translation reporting, and history export/import.
