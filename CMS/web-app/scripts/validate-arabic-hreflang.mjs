import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://dottodotfreeprintables.com';
const outDir = 'out';
const pages = ['ar', 'ar-AE', 'ar-SA', 'ar-QA'];
// Each Arabic regional path is a fully self-canonical page (see
// scripts/strip-next-runtime.mjs publishArabicRegionalAliases and
// lib/seo.ts buildAlternates) that reciprocally alternates with the other
// three, forming one complete hreflang cluster — matching
// tests/i18n-layout.spec.ts's "Arabic regional alias hreflang cluster" suite.
const ALIASES = ['ar-AE', 'ar-SA', 'ar-QA'];

function pageFile(locale) {
  return join(outDir, locale, 'index.html');
}

function extractCanonical(html) {
  return html.match(/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="([^"]+)")[^>]*>/i)?.[1] ?? null;
}

function extractAlternates(html) {
  const alternates = {};
  const linkPattern = /<link\b(?=[^>]*\brel="alternate")[^>]*>/gi;

  for (const { 0: tag } of html.matchAll(linkPattern)) {
    const hreflang = tag.match(/\bhreflang="([^"]+)"/i)?.[1];
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1];

    if (hreflang && href) {
      alternates[hreflang] = href;
    }
  }

  return Object.fromEntries(Object.entries(alternates).sort(([a], [b]) => a.localeCompare(b)));
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual:   ${actual}`);
  }
}

const baseline = {};

for (const locale of pages) {
  const file = pageFile(locale);

  if (!existsSync(file)) {
    throw new Error(`Missing Arabic output page: ${file}`);
  }

  const html = readFileSync(file, 'utf8');
  const canonical = extractCanonical(html);
  const alternates = extractAlternates(html);

  assertEqual(canonical, `${SITE}/${locale}/`, `${locale} canonical must self-reference its own page`);

  assertEqual(alternates.ar, `${SITE}/ar/`, `${locale} is missing the ar alternate`);
  for (const alias of ALIASES) {
    assertEqual(alternates[alias], `${SITE}/${alias}/`, `${locale} is missing the ${alias} alternate`);
  }

  if (locale === pages[0]) {
    Object.assign(baseline, alternates);
    continue;
  }

  assertEqual(
    JSON.stringify(alternates),
    JSON.stringify(baseline),
    `${locale} hreflang cluster differs from /${pages[0]}/`
  );
}

console.log('Arabic hreflang cluster is consistent across /ar/, /ar-AE/, /ar-SA/, and /ar-QA/.');
