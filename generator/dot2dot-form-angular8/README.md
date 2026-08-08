# Dot-to-Dot CMS

Angular 21 editorial tool for the sibling `dot-to-dot-web` application. The production project is a read-only content source; this CMS never writes into it.

## Commands

- `npm start` — stage production content assets and run the development server.
- `npm run build` — create a production build in `dist/dot-to-dot-cms`.
- `npm test` — build, start the static output, and run the Playwright regression suite.

## Draft workflow

Drafts are stored in IndexedDB and grouped by language, category, and puzzle slug. Each puzzle retains at most five versions. Saving, validating, and generating JSON create `draft`, `validated`, and `submitted` versions respectively. CMS metadata lives under `_cms`; downloaded production JSON removes that metadata.

The Versions panel supports restoring, comparing, renaming, pinning, deleting, clearing, exporting, and importing history. The newest saved version is restored when the CMS opens.

## Production sync

`generator/tools/build_menu_assets.py` reads `../dot-to-dot-web/content` through the configured sibling-relative path and generates ignored runtime assets. It does not modify production content.
