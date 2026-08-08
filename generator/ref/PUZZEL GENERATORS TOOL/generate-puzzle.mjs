#!/usr/bin/env node
/**
 * Puzzle Content Generator
 * Usage: node generate-puzzle.mjs ./input/cute-fox.json
 *
 * Reads a filled input JSON, validates image assets, then:
 *  1. Appends a full English entry to content/en/puzzles-{category}.json
 *  2. Appends a full Arabic entry to content/ar/puzzles-{category}.json (if input.ar is provided)
 *  3. Appends TBD stubs to the remaining 31 locale content files
 *  4. Prints a validation report
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// Read locales dynamically from the content/ directory — no hardcoded list
function getLocales() {
  const contentDir = resolve(PROJECT_ROOT, 'content');
  return readdirSync(contentDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort((a, b) => (a === 'en' ? -1 : b === 'en' ? 1 : a.localeCompare(b)));
}

const ALL_LOCALES = getLocales();

// Difficulty rubric derived from dot count
function deriveDifficulty(dotCount) {
  if (dotCount <= 20)  return { level: 'Easy',          ages: '3–5',  sections: 2 };
  if (dotCount <= 50)  return { level: 'Easy',          ages: '4–7',  sections: 3 };
  if (dotCount <= 100) return { level: 'Medium',        ages: '5–9',  sections: 5 };
  if (dotCount <= 150) return { level: 'Hard',          ages: '7–12', sections: 6 };
  return               { level: 'Expert',        ages: '9–12+',sections: 7 };
}

// Build the full English puzzle entry from input data
function buildEnglishEntry(input) {
  const diff = deriveDifficulty(input.dotCount);

  const entry = {
    slug: input.slug,
    name: input.name,
    seoTitle: input.seoTitle ?? `${input.name} Dot to Dot — ${input.dotCount} Dots Printable`,
    seoH1: input.seoH1 ?? `${input.name} Dot to Dot — ${input.dotCount} Dots of Printable Fun`,
    tagline: input.tagline,
    description: input.description,
    seoDescription: input.seoDescription,
    funFact: input.funFact,
    seoImageAlt: input.seoImageAlt,
    dotGuide: {
      intro: input.dotGuide.intro,
      sections: input.dotGuide.sections.map(s => ({
        range: s.range,
        title: s.title,
        learn: s.learn,
        fact: s.fact
      })),
      outro: input.dotGuide.outro,
      ...(input.dotGuide.colorSchemes ? { colorSchemes: input.dotGuide.colorSchemes } : {})
    }
  };

  return entry;
}

// Build a full Arabic entry from input.ar data
function buildArabicEntry(input) {
  const ar = input.ar;
  return {
    slug: input.slug,
    name: ar.name,
    tagline: ar.tagline,
    description: ar.description,
    funFact: ar.funFact,
    dotGuide: {
      intro: ar.dotGuide.intro,
      sections: ar.dotGuide.sections.map((s, i) => ({
        range: input.dotGuide.sections[i]?.range ?? s.range,
        title: s.title,
        learn: s.learn,
        fact: s.fact
      })),
      outro: ar.dotGuide.outro
    }
  };
}

// Build a TBD stub for remaining locales
function buildLocaleStub(input) {
  return {
    slug: input.slug,
    name: `TBD — ${input.name}`,
    tagline: 'TBD',
    description: 'TBD',
    funFact: 'TBD',
    dotGuide: {
      intro: 'TBD',
      sections: input.dotGuide.sections.map(s => ({
        range: s.range,
        title: 'TBD',
        learn: 'TBD',
        fact: 'TBD'
      })),
      outro: 'TBD'
    }
  };
}

// Append entry to a content JSON file
function appendToContentFile(filePath, entry) {
  if (!existsSync(filePath)) {
    console.warn(`  ⚠  File not found, skipping: ${filePath}`);
    return false;
  }

  const existing = JSON.parse(readFileSync(filePath, 'utf8'));

  // Check if slug already exists
  const alreadyExists = existing.some(p => p.slug === entry.slug);
  if (alreadyExists) {
    console.warn(`  ⚠  Slug "${entry.slug}" already exists in ${filePath} — skipping`);
    return false;
  }

  existing.push(entry);
  writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');
  return true;
}

// Validate required image assets exist
function validateImages(input) {
  const errors = [];
  const dataFolder = resolve(PROJECT_ROOT, 'data', input.imageFolder);

  if (!existsSync(dataFolder)) {
    errors.push(`Image folder not found: data/${input.imageFolder}`);
    return errors;
  }

  const required = [
    `${input.slug}-puzzle.webp`,
    `${input.slug}-card.webp`
  ];

  // Also accept underscore/space naming variants (e.g. Seahorse_35_dots_easy-puzzle.webp)
  for (const file of required) {
    const fullPath = resolve(dataFolder, file);
    if (!existsSync(fullPath)) {
      // Look for any file containing the base name
      const base = file.replace('.webp', '');
      const altFound = false; // Could glob here; for now just warn
      errors.push(`Missing: data/${input.imageFolder}/${file}`);
    }
  }

  return errors;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: node generate-puzzle.mjs <path-to-input.json>');
  process.exit(1);
}

const inputPath = resolve(process.cwd(), inputArg);
if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const input = JSON.parse(readFileSync(inputPath, 'utf8'));

console.log(`\n🧩 Puzzle Generator`);
console.log(`   Puzzle : ${input.name}`);
console.log(`   Slug   : ${input.slug}`);
console.log(`   Dots   : ${input.dotCount}`);
console.log(`   Cat    : ${input.category}`);

const diff = deriveDifficulty(input.dotCount);
console.log(`   Level  : ${diff.level} · Ages ${diff.ages}\n`);

// 1. Validate images
console.log('📁 Validating image assets...');
const imageErrors = validateImages(input);
if (imageErrors.length > 0) {
  console.error('❌ Image validation failed:');
  imageErrors.forEach(e => console.error(`   ${e}`));
  console.error('\nFix the missing files and re-run. No content files were modified.');
  process.exit(1);
}
console.log('   ✓ Image assets found\n');

// 2. Build entries
const enEntry = buildEnglishEntry(input);
const hasArabic = !!input.ar;
const arEntry = hasArabic ? buildArabicEntry(input) : null;
const stub = buildLocaleStub(input);

if (!hasArabic) {
  console.warn('⚠  No Arabic content (input.ar) found — ar will get a TBD stub.\n');
}

// 3. Write to all locale files
console.log('📝 Writing content files...');
let written = 0;
let skipped = 0;

for (const locale of ALL_LOCALES) {
  const contentPath = resolve(PROJECT_ROOT, 'content', locale, `puzzles-${input.category}.json`);
  let entry;
  if (locale === 'en') entry = enEntry;
  else if (locale === 'ar' && arEntry) entry = arEntry;
  else entry = stub;

  const ok = appendToContentFile(contentPath, entry);
  if (ok) {
    const label = (locale === 'en' || (locale === 'ar' && arEntry)) ? '✓ (full)' : '✓ (stub)';
    console.log(`   ${label} ${locale}`);
    written++;
  } else {
    skipped++;
  }
}

// 4. Summary
console.log(`\n✅ Done!`);
console.log(`   Written : ${written} locale files`);
console.log(`   Skipped : ${skipped} (already existed or file missing)`);
const stubCount = ALL_LOCALES.length - (hasArabic ? 2 : 1);
console.log(`\n   EN + AR: full content`);
console.log(`   Other ${stubCount} locales: TBD stubs — translate when ready.\n`);
console.log(`   Next: node "PUZZEL GENERATORS TOOL/validate-content.mjs" ${input.category}\n`);
