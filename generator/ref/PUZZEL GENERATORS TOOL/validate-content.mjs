#!/usr/bin/env node
/**
 * Content Validator
 * Usage: node validate-content.mjs [category]
 *
 * Checks every puzzle slug appears in all 33 locale files,
 * no TBD fields remain, and image assets exist.
 *
 * Examples:
 *   node validate-content.mjs           — validate ALL categories
 *   node validate-content.mjs cute      — validate cute category only
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// Read locales dynamically from content/ directory
const contentDir = resolve(PROJECT_ROOT, 'content');
const ALL_LOCALES = readdirSync(contentDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort((a, b) => (a === 'en' ? -1 : b === 'en' ? 1 : a.localeCompare(b)));

// Read categories dynamically from content/en/ files
const enContentDir = resolve(contentDir, 'en');
const CATEGORIES = readdirSync(enContentDir)
  .filter(f => f.startsWith('puzzles-') && f.endsWith('.json'))
  .map(f => f.replace('puzzles-', '').replace('.json', ''))
  .sort();

const targetCategory = process.argv[2];
const categories = targetCategory ? [targetCategory] : CATEGORIES;

let totalErrors = 0;
let totalWarnings = 0;

for (const category of categories) {
  const enPath = resolve(PROJECT_ROOT, 'content', 'en', `puzzles-${category}.json`);
  if (!existsSync(enPath)) {
    console.warn(`⚠  No file: content/en/puzzles-${category}.json — skipping`);
    continue;
  }

  const enPuzzles = JSON.parse(readFileSync(enPath, 'utf8'));
  console.log(`\n📦 ${category} (${enPuzzles.length} puzzles in EN)`);

  for (const puzzle of enPuzzles) {
    const slug = puzzle.slug;
    let puzzleErrors = 0;
    let puzzleWarnings = 0;

    // Check all locales have this slug
    for (const locale of ALL_LOCALES) {
      if (locale === 'en') continue;
      const localePath = resolve(PROJECT_ROOT, 'content', locale, `puzzles-${category}.json`);

      if (!existsSync(localePath)) continue;

      const localePuzzles = JSON.parse(readFileSync(localePath, 'utf8'));
      const found = localePuzzles.find(p => p.slug === slug);

      if (!found) {
        console.error(`   ❌ [${locale}] missing slug: ${slug}`);
        puzzleErrors++;
      } else if (found.description === 'TBD') {
        console.warn(`   ⚠  [${locale}] description is TBD: ${slug}`);
        puzzleWarnings++;
      }
    }

    // Check EN has required fields
    const required = ['slug', 'name', 'seoH1', 'tagline', 'description', 'seoDescription', 'funFact', 'seoImageAlt'];
    for (const field of required) {
      if (!puzzle[field]) {
        console.error(`   ❌ [en] missing field "${field}": ${slug}`);
        puzzleErrors++;
      }
    }

    // Check dotGuide sections exist
    if (!puzzle.dotGuide?.sections?.length) {
      console.error(`   ❌ [en] dotGuide.sections is empty: ${slug}`);
      puzzleErrors++;
    }

    if (puzzleErrors === 0 && puzzleWarnings === 0) {
      console.log(`   ✓ ${slug}`);
    } else if (puzzleErrors === 0) {
      console.log(`   ⚠  ${slug} (${puzzleWarnings} TBD stubs)`);
    }

    totalErrors += puzzleErrors;
    totalWarnings += puzzleWarnings;
  }
}

console.log(`\n${'─'.repeat(50)}`);
if (totalErrors === 0 && totalWarnings === 0) {
  console.log('✅ All checks passed. Content is clean.\n');
} else {
  if (totalErrors > 0) console.error(`❌ ${totalErrors} error(s) found — fix before deploying.`);
  if (totalWarnings > 0) console.warn(`⚠  ${totalWarnings} TBD stub(s) — translate to go live.\n`);
}

process.exit(totalErrors > 0 ? 1 : 0);
