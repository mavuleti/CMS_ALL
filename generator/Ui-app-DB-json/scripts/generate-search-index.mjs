#!/usr/bin/env node
// scripts/generate-search-index.mjs
//
// Pre-build step: generates one search-index JSON file per routable locale
// (public/search-index/{locale}.json) that the client-side search component
// can fetch statically after `next build`'s static export.
//
// Design notes (why it's built this way):
//
// - Puzzle data is sourced by calling the SAME getXxxPuzzlesForLocale()
//   functions the pages themselves call (lib/canada-data.ts,
//   lib/flowers-data.ts, etc). Those functions already do the real "does
//   this puzzle exist + is it translated" merge (see lib/puzzle-i18n.ts /
//   mergeLocalizedPuzzles). Re-deriving that logic here would risk drifting
//   from what actually gets built and indexing puzzles that have no live
//   page. This is the same pattern already used by
//   scripts/lib/translation-availability.mjs, which imports
//   lib/section-locales.ts directly -- Node 22's native TS support (no
//   ts-node/tsx needed) makes `import '../lib/x.ts'` from a .mjs script work
//   as-is.
// - Category *names* are looked up from content/{locale}/messages.json's
//   `categories.items.<key>.name`. Two sections (canada, flowers) don't have
//   an entry there at all in ANY locale (verified before writing this) --
//   those always fall back to English and are logged as missing, same as
//   any locale that's simply missing the key.
// - "Does the puzzle exist" is enforced by construction: we only ever read
//   puzzles that getXxxPuzzlesForLocale() returned, which already checked
//   the content JSON + shell definition both exist.
// - Missing-translation detection: for each locale we also call the loader
//   with 'en' and diff slugs. Any English slug absent from the locale's
//   result is a puzzle that has no translation (or no live page) for that
//   locale, and got dropped rather than silently mixed with English text.
//   Default behavior is SKIP (matches what the site actually renders --
//   never index a URL that doesn't exist). Pass --fallback-text to instead
//   emit the entry using the English name/category, still under the
//   locale's own URL (only use this if you understand it may point users at
//   an English-fallback page).

import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { register, createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// lib/*.ts uses extensionless relative imports (fine for Next's bundler,
// invalid for plain Node ESM) -- register a resolver hook that retries with
// .ts/.tsx/.mts before importing anything from lib/.
register('./lib/ts-extension-hook.mjs', import.meta.url);

// lib/*.ts also uses `require('../content/en/...json')` to pull in JSON
// content (again, fine under Next's/webpack's loader, not defined in plain
// Node ESM). scripts/ sits at the same depth as lib/ under the repo root,
// so a require() anchored to this file resolves those same relative
// ../content/... paths identically to one anchored inside lib/.
globalThis.require = createRequire(import.meta.url);

const { routing } = await import('../i18n/routing.ts');
const { puzzleIdFromSlug } = await import('../lib/puzzle-id.ts');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'search-index');
const DEFAULT_LOCALE = routing.defaultLocale ?? 'en';
const LOCALES = routing.locales;

const FALLBACK_TEXT = process.argv.includes('--fallback-text');

// One entry per puzzle "section" (category) that exists in the codebase.
// `contentFile` is only used for the existence report; the real data comes
// from `loader`. `categoryKey` maps to content/{locale}/messages.json's
// categories.items key; `categoryFallback` is the English name to use when
// that key doesn't exist for a locale (canada/flowers never have it; other
// locales may be missing it too).
const SECTIONS = [
  { key: 'canada', url: 'canada', contentFile: 'puzzles-canada.json', module: '../lib/canada-data.ts', fn: 'getCanadaPuzzlesForLocale', categoryKey: 'canada', categoryFallback: 'Canada' },
  { key: 'circus', url: 'circus', contentFile: 'puzzles-circus.json', module: '../lib/circus-data.ts', fn: 'getCircusPuzzlesForLocale', categoryKey: 'circus', categoryFallback: 'Circus' },
  { key: 'cute', url: 'cute', contentFile: 'puzzles-cute.json', module: '../lib/cute-data.ts', fn: 'getCutePuzzlesForLocale', categoryKey: 'cute', categoryFallback: 'Cute' },
  { key: 'dinosaurs', url: 'dinosaurs', contentFile: 'puzzles-dinosaurs.json', module: '../lib/dinosaurs-data.ts', fn: 'getDinosaursForLocale', categoryKey: 'dinosaurs', categoryFallback: 'Dinosaurs' },
  { key: 'flowers', url: 'flowers', contentFile: 'puzzles-flowers.json', module: '../lib/flowers-data.ts', fn: 'getFlowerPuzzlesForLocale', categoryKey: 'flowers', categoryFallback: 'Flowers' },
  { key: 'garden', url: 'garden', contentFile: 'puzzles-garden.json', module: '../lib/garden-data.ts', fn: 'getGardenPuzzlesForLocale', categoryKey: 'garden', categoryFallback: 'Garden' },
  { key: 'ocean', url: 'ocean', contentFile: 'puzzles-ocean.json', module: '../lib/ocean-data.ts', fn: 'getOceanPuzzlesForLocale', categoryKey: 'ocean', categoryFallback: 'Ocean' },
  { key: 'playgrounds', url: 'playgrounds', contentFile: 'puzzles-playgrounds.json', module: '../lib/playgrounds-data.ts', fn: 'getPlaygroundPuzzlesForLocale', categoryKey: 'playgrounds', categoryFallback: 'Playgrounds' },
  { key: 'space', url: 'space', contentFile: 'puzzles-space.json', module: '../lib/space-data.ts', fn: 'getSpacePuzzlesForLocale', categoryKey: 'space', categoryFallback: 'Space' },
  { key: 'uae', url: 'uae', contentFile: 'puzzles-uae.json', module: '../lib/uae-data.ts', fn: 'getUaePuzzlesForLocale', categoryKey: 'uae', categoryFallback: 'UAE' },
  { key: 'usa-250', url: 'usa-250', contentFile: 'puzzles-usa-250.json', module: '../lib/usa-250-data.ts', fn: 'getUsa250PuzzlesForLocale', categoryKey: 'usa250', categoryFallback: 'America 250 Years' }
];

function readJsonIfPresent(p) {
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (err) {
    warnings.push(`Could not parse JSON at ${path.relative(ROOT, p)}: ${err.message}`);
    return null;
  }
}

function categoryName(locale, section) {
  const messages = readJsonIfPresent(path.join(ROOT, 'content', locale, 'messages.json'));
  const name = messages?.categories?.items?.[section.categoryKey]?.name;
  if (name) return { name, missing: false };
  missingCategoryTranslations.push({ locale, section: section.key });
  return { name: section.categoryFallback, missing: true };
}

const warnings = [];
const errors = [];
const missingCategoryTranslations = [];
const missingPuzzleTranslations = []; // { locale, section, slug }
const report = []; // { locale, count, fileBytes }

mkdirSync(OUT_DIR, { recursive: true });

// Load every section's data-access module once.
const loaders = {};
for (const section of SECTIONS) {
  try {
    const mod = await import(section.module);
    const fn = mod[section.fn];
    if (typeof fn !== 'function') {
      throw new Error(`${section.fn} is not exported from ${section.module}`);
    }
    loaders[section.key] = fn;
  } catch (err) {
    errors.push(`Failed to load ${section.module}: ${err.message}`);
  }
}

// English puzzle set per section, used as the reference set for detecting
// missing translations in every other locale.
const englishBySection = {};
for (const section of SECTIONS) {
  if (!loaders[section.key]) continue;
  try {
    englishBySection[section.key] = loaders[section.key](DEFAULT_LOCALE);
  } catch (err) {
    errors.push(`Failed to load English puzzles for section "${section.key}": ${err.message}`);
    englishBySection[section.key] = [];
  }
}

for (const locale of LOCALES) {
  const entries = [];
  let puzzleCount = 0;

  for (const section of SECTIONS) {
    if (!loaders[section.key]) continue;

    let localePuzzles = [];
    try {
      localePuzzles = loaders[section.key](locale) ?? [];
    } catch (err) {
      errors.push(`[${locale}] Failed to load section "${section.key}": ${err.message}`);
      continue;
    }

    const englishPuzzles = englishBySection[section.key] ?? [];
    const localeSlugs = new Set(localePuzzles.map((p) => p.slug));

    // Any English puzzle missing from this locale's merged output has no
    // translation (or no live page) here.
    for (const enPuzzle of englishPuzzles) {
      if (localeSlugs.has(enPuzzle.slug)) continue;
      missingPuzzleTranslations.push({ locale, section: section.key, slug: enPuzzle.slug });
    }

    const puzzlesToIndex = localePuzzles.length > 0 || !FALLBACK_TEXT
      ? localePuzzles
      : englishPuzzles; // only relevant if locale had zero puzzles at all and --fallback-text is set

    if (puzzlesToIndex.length === 0 && locale !== DEFAULT_LOCALE && FALLBACK_TEXT) {
      // Section doesn't exist for this locale at all (no page will be
      // built) -- nothing sensible to fall back to, so skip regardless of
      // --fallback-text.
      continue;
    }

    const { name: catName } = categoryName(locale, section);

    for (const puzzle of puzzlesToIndex) {
      entries.push({
        id: puzzleIdFromSlug(puzzle.slug),
        slug: puzzle.slug,
        name: puzzle.name,
        category: catName,
        categoryKey: section.key,
        href: `/${locale}/${section.url}/${puzzle.slug}/`,
        image: puzzle.image ?? null,
        difficulty: puzzle.difficulty ?? null,
        dots: puzzle.dots ?? null,
        age: puzzle.age ?? null,
        isNew: Boolean(puzzle.isNew)
      });
      puzzleCount++;
    }
  }

  const outPath = path.join(OUT_DIR, `${locale}.json`);
  const json = JSON.stringify(entries);
  writeFileSync(outPath, json);
  const fileBytes = statSync(outPath).size;
  report.push({ locale, count: puzzleCount, fileBytes });
}

// ---- Report ----
console.log('\n=== Search Index Generation Report ===\n');
console.log('Puzzles indexed per locale:');
for (const r of report) {
  console.log(`  ${r.locale.padEnd(6)} ${String(r.count).padStart(4)} puzzles   ${(r.fileBytes / 1024).toFixed(1).padStart(7)} KB   -> public/search-index/${r.locale}.json`);
}

if (missingCategoryTranslations.length > 0) {
  console.log(`\nMissing category-name translations (${missingCategoryTranslations.length}) -- using English fallback:`);
  const bySection = {};
  for (const m of missingCategoryTranslations) {
    (bySection[m.section] ??= []).push(m.locale);
  }
  for (const [section, locales] of Object.entries(bySection)) {
    console.log(`  ${section}: ${locales.join(', ')}`);
  }
} else {
  console.log('\nNo missing category-name translations.');
}

if (missingPuzzleTranslations.length > 0) {
  console.log(`\nMissing puzzle translations (${missingPuzzleTranslations.length}) -- puzzle skipped for that locale:`);
  const bySection = {};
  for (const m of missingPuzzleTranslations) {
    (bySection[`${m.section} / ${m.locale}`] ??= []).push(m.slug);
  }
  for (const [key, slugs] of Object.entries(bySection)) {
    console.log(`  ${key}: ${slugs.length} puzzle(s) -- ${slugs.slice(0, 5).join(', ')}${slugs.length > 5 ? ', ...' : ''}`);
  }
} else {
  console.log('\nNo missing puzzle translations.');
}

if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.log(`\nErrors (${errors.length}):`);
  errors.forEach((e) => console.log(`  - ${e}`));
  console.log('\nSearch index generation completed WITH ERRORS.');
  process.exitCode = 1;
} else {
  console.log('\nSearch index generation completed successfully.');
}

const totalPuzzles = report.reduce((sum, r) => sum + r.count, 0);
const totalBytes = report.reduce((sum, r) => sum + r.fileBytes, 0);
console.log(`\nTotals: ${totalPuzzles} puzzle entries across ${report.length} locales, ${(totalBytes / 1024).toFixed(1)} KB written.\n`);
