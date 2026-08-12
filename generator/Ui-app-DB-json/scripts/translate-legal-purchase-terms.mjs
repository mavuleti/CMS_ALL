import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// One-off: fill missing terms.purchaseTitle/purchasePolicy/purchaseHelp
// in every non-English content/<locale>/legal.json using Google's free
// unofficial translate endpoint (same one used by scripts/translate-markdown.mjs).

const contentDir = path.resolve('content');
const sourceLocale = 'en';
const keys = ['purchaseTitle', 'purchasePolicy', 'purchaseHelp'];

const localeTargets = {
  ar: 'ar', az: 'az', cs: 'cs', da: 'da', de: 'de', el: 'el', es: 'es', fa: 'fa',
  fi: 'fi', fr: 'fr', hr: 'hr', hu: 'hu', id: 'id', it: 'it', ja: 'ja', ko: 'ko',
  lt: 'lt', lv: 'lv', nl: 'nl', no: 'no', pl: 'pl', pt: 'pt', 'pt-BR': 'pt',
  ro: 'ro', ru: 'ru', sk: 'sk', sl: 'sl', sv: 'sv', th: 'th', tr: 'tr', uk: 'uk',
  vi: 'vi'
};

async function translateOne(text, targetLocale, attempt = 1) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetLocale);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url);
  if (!res.ok) {
    if (attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      return translateOne(text, targetLocale, attempt + 1);
    }
    throw new Error(`translate ${targetLocale} failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data?.[0] ?? []).map((entry) => entry?.[0] ?? '').join('');
}

const enLegal = JSON.parse(readFileSync(path.join(contentDir, sourceLocale, 'legal.json'), 'utf8'));

let ok = 0;
let failed = [];

for (const [locale, target] of Object.entries(localeTargets)) {
  const filePath = path.join(contentDir, locale, 'legal.json');
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  if (!data.terms) {
    console.warn(`skip ${locale}: no terms block`);
    continue;
  }

  const missing = keys.filter((k) => !data.terms[k]);
  if (missing.length === 0) {
    continue;
  }

  try {
    const translated = {};
    for (const key of missing) {
      translated[key] = await translateOne(enLegal.terms[key], target);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Rebuild terms object preserving en key order so purchase* lands
    // right after "permission" like in the English source.
    const newTerms = {};
    for (const key of Object.keys(enLegal.terms)) {
      if (key in data.terms) {
        newTerms[key] = data.terms[key];
      } else if (key in translated) {
        newTerms[key] = translated[key];
      }
    }
    data.terms = newTerms;

    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✓ ${locale}`);
    ok += 1;
  } catch (err) {
    console.error(`✗ ${locale}: ${err.message}`);
    failed.push(locale);
  }
}

console.log(`\nDone. ${ok} locales updated.`);
if (failed.length) {
  console.log(`Failed: ${failed.join(', ')}`);
  process.exit(1);
}
