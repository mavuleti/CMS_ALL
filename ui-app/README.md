# Dot-to-Dot Data-Driven Templates

This Next.js app builds the collection index, collection pages, and every puzzle page directly from the source JSON in `../content/en/converted` at build time. No content is copied into or maintained inside this app.

## Content loading

`lib/content.ts` scans all `puzzles-*.json` files. It supports both the intended `{ "collection": ..., "puzzles": [...] }` document and the current legacy root-array shape. Legacy files receive conservative collection-page fallback copy derived from the filename and puzzle count; puzzle content itself is never modified.

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
