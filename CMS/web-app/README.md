# UI App DB JSON

This is an independent static-page project cloned from the `ui-app` layout and
CSS. The original `ui-app` is a visual reference only. This project reads
English collection and puzzle content directly from
`../mapping-check/export/en/puzzles-<category>.json` and writes its own static
site to `out/`.

## Content loading

`lib/content-source.ts` loads export files using the intended
`{ "collection": ..., "puzzles": [...] }` document shape. The shared
collection and puzzle templates consume that data at build time. Search indexes
are regenerated automatically before every production build.

Adding a JSON file creates a collection route. Adding a puzzle to its `puzzles` array creates the card and puzzle route on the next build. `NEXT_PUBLIC_ASSET_BASE_URL` is the single asset/CDN root.

Optional puzzle FAQs are rendered by the same template and emitted as `FAQPage` structured data. The loader accepts `faq` or `faqs` at the puzzle root or inside `body`, as either an array or an object containing `items`/`questions`. Items may use `question`/`answer` or `q`/`a` keys.

## Template lock

After human visual and SEO approval, treat these files as locked:

- `lib/page-metadata.ts`
- `app/collections/page.tsx`
- `app/collections/[category]/page.tsx`
- `app/collections/[category]/[slug]/page.tsx`

They include a lock banner. Keep this list in code-review rules or a CODEOWNERS file when the repository ownership model is known. Do not edit them through automation without an explicit unlock request.

## Local use

Copy `.env.example` to `.env.local` if the content or asset locations differ, then run `npm install` and `npm run dev`. Use `npm run build` to generate the static site in `out/`.

`DOT_TO_DOT_CONTENT_DIR` can point to `puzzles-<category>.json` exports. Both a
legacy puzzle array and the complete `{ "collection": ..., "puzzles": [...] }`
shape are supported. English headings, metadata, and puzzle copy are read from
the exports during the static build; missing files use the bundled content.
