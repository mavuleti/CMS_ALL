// Validates every content/{locale}/*.json file against the English source of truth.
// Errors are batched across all locales/files so CI gets one complete report.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { IntlMessageFormat } from 'intl-messageformat';

const contentDir = path.resolve('content');
const sourceLocale = 'en';
const reportPath = path.resolve('temp/i18n-validation-report.txt');
const contentFiles = readdirSync(path.join(contentDir, sourceLocale))
  .filter((file) => file.endsWith('.json'))
  .sort();

const placeholderPattern = /^(?:todo|tbd|\[translate\]|xxx|\?{3})$/i;
// "Ã<byte>" and "Â<byte>" are classic UTF-8-read-as-Latin-1 mojibake shapes, but "Â"
// is also a legitimate standalone accented capital in French/Portuguese/Vietnamese words
// (e.g. "Âges"). Only flag Â when followed by a non-letter (the mojibake continuation byte
// is always a symbol/control char, never a plain letter continuing a word).
const mojibakePattern = /�|Ã.|Â[^A-Za-zÀ-ÖØ-öø-ÿ]|â[€™€œ€“€”¢€¦]|ï¿½/;
const tagPattern = /<\/?([A-Za-z][A-Za-z0-9-]*)(?:\s[^<>]*)?>/g;
const ignoredIdenticalValues = new Set(['OK', 'PDF', 'USA', 'FAQ']);
// Canada content is only maintained in en/es for now; other locales keep the
// older flat schema and intentionally lag the dotGuide fields. Warn, don't fail.
const nonStrictFiles = new Set(['puzzles-canada.json']);
// Some content categories are rolled out to a subset of locales first (translated
// there for real) before the rest catch up. An entirely-absent subtree is a
// legitimate "page not launched here yet", not a translation gap - warn, don't fail.
// Partial translation within a locale that *has* the subtree is still a strict error.
const optionalSubtrees = new Map([['faqs.json', ['categories.flowers']]]);

function getAtPath(obj, dottedPath) {
  return dottedPath.split('.').reduce((node, segment) => (node == null ? undefined : node[segment]), obj);
}

const allLocales = readdirSync(contentDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== sourceLocale)
  .map((entry) => entry.name)
  .sort();

const jsonCache = new Map();

function readJson(filePath) {
  if (jsonCache.has(filePath)) return jsonCache.get(filePath);
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  jsonCache.set(filePath, data);
  return data;
}

function localeHasColorSchemes(locale, file) {
  const filePath = path.join(contentDir, locale, file);
  if (!existsSync(filePath)) return false;
  try {
    const data = readJson(filePath);
    return Array.isArray(data) && data.some(
      (item) => Array.isArray(item?.dotGuide?.colorSchemes) && item.dotGuide.colorSchemes.length > 0
    );
  } catch {
    return false;
  }
}

function localePuzzleHasColorSchemes(locale, routeKey) {
  const [category, slug] = routeKey.split('/');
  if (!category || !slug) return false;
  const filePath = path.join(contentDir, locale, `puzzles-${category}.json`);
  if (!existsSync(filePath)) return false;
  try {
    const data = readJson(filePath);
    const puzzle = Array.isArray(data) ? data.find((item) => item?.slug === slug) : undefined;
    return Array.isArray(puzzle?.dotGuide?.colorSchemes) && puzzle.dotGuide.colorSchemes.length > 0;
  } catch {
    return false;
  }
}

function isOptionalColorFaqField(locale, sourceData, key) {
  const match = key.match(/^puzzles\.([^[]+)\.faqs\[(\d+)]\.(?:q|a)$/);
  if (!match || localePuzzleHasColorSchemes(locale, match[1])) return false;
  const sourceQuestion = sourceData?.puzzles?.[match[1]]?.faqs?.[Number(match[2])]?.q;
  return typeof sourceQuestion === 'string'
    && sourceQuestion.toLowerCase().startsWith('what colors should i use');
}

function readJsonSafe(filePath, bucket, label) {
  try {
    return readJson(filePath);
  } catch (error) {
    bucket.push(`${label}: ${error.message}`);
    return undefined;
  }
}

// A locale is a routable placeholder (English-fallback only, see I18N.md) when
// messages.json is `{}` and every array file is `[]`. Skip strict translation
// validation for those until real content lands.
function isPlaceholderLocale(locale) {
  const parseErrors = [];
  const messages = readJsonSafe(path.join(contentDir, locale, 'messages.json'), parseErrors, `${locale}/messages.json`);
  if (parseErrors.length || !messages || Object.keys(messages).length > 0) return false;

  return contentFiles
    .filter((file) => file !== 'messages.json')
    .every((file) => {
      const data = readJsonSafe(path.join(contentDir, locale, file), parseErrors, `${locale}/${file}`);
      return Array.isArray(data) && data.length === 0;
    });
}

// Default: every real (non-placeholder) locale is strict. STRICT_I18N_LOCALES can still
// narrow this down for a fast local check while iterating on one or two locales.
const strictLocales = new Set(
  process.env.STRICT_I18N_LOCALES?.split(',').map((locale) => locale.trim()).filter(Boolean) ?? allLocales
);
const placeholderLocales = allLocales.filter(isPlaceholderLocale);
const skippedLocales = allLocales.filter((locale) => !placeholderLocales.includes(locale) && !strictLocales.has(locale));
const locales = allLocales.filter((locale) => !placeholderLocales.includes(locale) && strictLocales.has(locale));

function flatten(value, prefix, out) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const key = item && typeof item === 'object' && item.slug ? item.slug : String(index);
      flatten(item, prefix ? `${prefix}[${key}]` : `[${key}]`, out);
    });
    return out;
  }

  if (value && typeof value === 'object') {
    for (const [key, val] of Object.entries(value)) {
      flatten(val, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }

  out[prefix] = value;
  return out;
}

function flattenFile(data) {
  return flatten(data, '', {});
}

function placeholders(value) {
  return [...String(value).matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g)].map((match) => match[1]).sort();
}

function htmlTags(value) {
  const stack = [];
  const seen = [];
  for (const match of String(value).matchAll(tagPattern)) {
    const raw = match[0];
    const name = match[1].toLowerCase();
    if (raw.endsWith('/>')) continue;
    seen.push(`${raw.startsWith('</') ? '/' : ''}${name}`);
    if (raw.startsWith('</')) {
      if (stack.pop() !== name) return { balanced: false, seen };
    } else {
      stack.push(name);
    }
  }
  return { balanced: stack.length === 0, seen };
}

function sameList(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function bracesBalanced(value) {
  let depth = 0;
  for (const char of String(value)) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function validateIcu(value, locale) {
  try {
    new IntlMessageFormat(String(value).replace(tagPattern, ''), locale);
    return null;
  } catch (error) {
    return error.message;
  }
}

function compareLocale(locale, file) {
  const errors = {
    parse: [],
    missing: [],
    empty: [],
    placeholders: [],
    parameterMismatch: [],
    brokenIcu: [],
    htmlMismatch: [],
    mojibake: []
  };
  const warnings = {
    identical: [],
    extra: [],
    missingPage: []
  };

  // seoTitle/seoH1/seoDescription/seoImageAlt(N) used to have a code-level
  // fallback to generic/templated copy, so this validator let them warn
  // instead of fail. That fallback has been removed (see CLAUDE.md: "No
  // empty/missing translation values — ever") and the template now throws at
  // generation time when any of them is missing, so every field is strict.
  function pushError(bucket, key, message) {
    errors[bucket].push(message ?? key);
  }

  const sourcePath = path.join(contentDir, sourceLocale, file);
  const targetPath = path.join(contentDir, locale, file);

  // A page can be intentionally absent in a locale: the whole file missing,
  // or a whole slug-keyed entry (blog post / puzzle) not present. Those are
  // warn-only; only partially translated entries are strict errors.
  if (!existsSync(targetPath)) {
    warnings.missingPage.push(`${locale}/${file}: entire file is missing`);
    return { errors, warnings };
  }

  const sourceData = readJsonSafe(sourcePath, errors.parse, `${sourceLocale}/${file}`);
  const targetData = readJsonSafe(targetPath, errors.parse, `${locale}/${file}`);
  if (!sourceData || !targetData) return { errors, warnings };

  const missingEntryPrefixes = [];
  for (const subtreePath of optionalSubtrees.get(file) ?? []) {
    if (getAtPath(sourceData, subtreePath) !== undefined && getAtPath(targetData, subtreePath) === undefined) {
      warnings.missingPage.push(`${subtreePath}: entire subtree missing (not launched for this locale)`);
      missingEntryPrefixes.push(subtreePath);
    }
  }
  if (file === 'faqs.json') {
    for (const [routeKey, sourcePack] of Object.entries(sourceData.puzzles ?? {})) {
      const targetPack = targetData.puzzles?.[routeKey];
      const hasColorFaq = sourcePack?.faqs?.some(
        (faq) => typeof faq?.q === 'string' && faq.q.toLowerCase().startsWith('what colors should i use')
      );
      if (!targetPack && hasColorFaq && !localePuzzleHasColorSchemes(locale, routeKey)) {
        missingEntryPrefixes.push(`puzzles.${routeKey}`);
      }
    }
  }
  if (Array.isArray(sourceData) && Array.isArray(targetData)) {
    const targetBySlug = new Map(targetData.map((item) => [item?.slug, item]).filter(([slug]) => slug));
    for (const item of sourceData) {
      if (!item?.slug) continue;
      if (!targetBySlug.has(item.slug)) {
        warnings.missingPage.push(`[${item.slug}] entire entry is missing`);
        missingEntryPrefixes.push(`[${item.slug}]`);
        continue;
      }
      // The whole dotGuide block being untranslated is a build-time page-skip
      // (see lib/puzzle-i18n.ts), not a strict error — a partially-translated
      // dotGuide (some fields present) is still a real error below.
      const targetItem = targetBySlug.get(item.slug);
      if (item.dotGuide && !targetItem?.dotGuide) {
        warnings.missingPage.push(`[${item.slug}].dotGuide: entire dotGuide missing (page skipped for this locale)`);
        missingEntryPrefixes.push(`[${item.slug}].dotGuide`);
      } else if (
        Array.isArray(item.dotGuide?.colorSchemes)
        && item.dotGuide.colorSchemes.length > 0
        && !(Array.isArray(targetItem?.dotGuide?.colorSchemes) && targetItem.dotGuide.colorSchemes.length > 0)
      ) {
        // colorSchemes is an English-first, all-or-nothing subtree. A locale
        // may omit it completely; once added, all nested fields are strict.
        missingEntryPrefixes.push(`[${item.slug}].dotGuide.colorSchemes`);
      }
    }
  }

  const sourceFlat = flattenFile(sourceData);
  const targetFlat = flattenFile(targetData);

  for (const [key, sourceValue] of Object.entries(sourceFlat)) {
    if (!(key in targetFlat)) {
      if (file === 'faqs.json' && isOptionalColorFaqField(locale, sourceData, key)) continue;
      // The cute coloring heading is only needed when this locale has at least
      // one localized coloring guide to render.
      if (
        file === 'messages.json'
        && key === 'cutePage.colorH2'
        && !localeHasColorSchemes(locale, 'puzzles-cute.json')
      ) {
        continue;
      }
      if (!missingEntryPrefixes.some((prefix) => key.startsWith(prefix))) {
        if (nonStrictFiles.has(file)) {
          warnings.missingPage.push(`${key}: field missing (non-strict file)`);
        } else {
          errors.missing.push(key);
        }
      }
      continue;
    }

    const targetValue = targetFlat[key];

    if (typeof targetValue === 'string') {
      if (targetValue.trim() === '') {
        // An empty target is only an error when the source has content;
        // intentionally empty source strings (e.g. heading-less intro
        // sections) are allowed to stay empty in every locale.
        if (typeof sourceValue !== 'string' || sourceValue.trim() !== '') {
          pushError('empty', key);
        }
        continue;
      }

      if (placeholderPattern.test(targetValue.trim())) {
        pushError('placeholders', key);
      }

      if (mojibakePattern.test(targetValue)) {
        pushError('mojibake', key);
      }

      const icuError = validateIcu(targetValue, locale);
      if (
        !bracesBalanced(targetValue) ||
        (/\b(?:plural|select)\s*,/.test(targetValue) && !/\bother\s*\{/.test(targetValue)) ||
        icuError
      ) {
        pushError('brokenIcu', key, icuError ? `${key}: ${icuError}` : key);
      }
    }

    if (typeof sourceValue === 'string' && typeof targetValue === 'string') {
      if (sourceValue === targetValue && !ignoredIdenticalValues.has(sourceValue)) {
        warnings.identical.push(key);
      }

      const sourcePlaceholders = placeholders(sourceValue);
      const targetPlaceholders = placeholders(targetValue);
      if (!sameList(sourcePlaceholders, targetPlaceholders)) {
        pushError('parameterMismatch', key, `${key} expected {${sourcePlaceholders.join('},{')}} got {${targetPlaceholders.join('},{')}}`);
      }

      const sourceTags = htmlTags(sourceValue);
      const targetTags = htmlTags(targetValue);
      if (!sourceTags.balanced || !targetTags.balanced || !sameList(sourceTags.seen, targetTags.seen)) {
        pushError('htmlMismatch', key);
      }
    }
  }

  for (const key of Object.keys(targetFlat)) {
    if (!(key in sourceFlat)) warnings.extra.push(key);
  }

  return { errors, warnings };
}

function countEntries(groups) {
  return Object.values(groups).reduce((sum, entries) => sum + entries.length, 0);
}

function countTotals(groups) {
  return Object.values(groups).reduce((sum, count) => sum + count, 0);
}

function printEntries(lines, entries, limit = 50) {
  for (const entry of entries.slice(0, limit)) lines.push(`    - ${entry}`);
  if (entries.length > limit) lines.push(`    ... ${entries.length - limit} more`);
}

let hasErrors = false;
const summary = [];

for (const locale of locales) {
  const row = {
    locale,
    errors: { parse: 0, missing: 0, empty: 0, placeholders: 0, parameterMismatch: 0, brokenIcu: 0, htmlMismatch: 0, mojibake: 0 },
    warnings: { identical: 0, extra: 0, missingPage: 0 },
    details: []
  };

  for (const file of contentFiles) {
    const result = compareLocale(locale, file);
    for (const key of Object.keys(row.errors)) row.errors[key] += result.errors[key].length;
    for (const key of Object.keys(row.warnings)) row.warnings[key] += result.warnings[key].length;

    if (countEntries(result.errors) || countEntries(result.warnings)) {
      row.details.push({ file, ...result });
    }
  }

  if (countTotals(row.errors) > 0) hasErrors = true;
  summary.push(row);
}

const lines = [];

if (placeholderLocales.length) {
  lines.push(`Skipping placeholder locales (English-fallback only): ${placeholderLocales.join(', ')}`);
  lines.push('');
}

if (skippedLocales.length) {
  lines.push(`Skipping locales outside the current strict validation set (${[...strictLocales].join(', ')}): ${skippedLocales.join(', ')}`);
  lines.push('');
}

lines.push('i18n validation report (source of truth: en)');
lines.push('');
lines.push('locale  missing  empty  junk  params  icu  html  mojibake  identical  extra  no-page');
lines.push('------  -------  -----  ----  ------  ---  ----  --------  ---------  -----  -------');
for (const row of summary) {
  lines.push(
    `${row.locale.padEnd(6)}  ${String(row.errors.missing).padEnd(7)}  ${String(row.errors.empty).padEnd(5)}  ${String(row.errors.placeholders).padEnd(4)}  ${String(row.errors.parameterMismatch).padEnd(6)}  ${String(row.errors.brokenIcu).padEnd(3)}  ${String(row.errors.htmlMismatch).padEnd(4)}  ${String(row.errors.mojibake).padEnd(8)}  ${String(row.warnings.identical).padEnd(9)}  ${String(row.warnings.extra).padEnd(5)}  ${row.warnings.missingPage}`
  );
}
lines.push('');
const summaryLineCount = lines.length;

for (const row of summary) {
  if (row.details.length === 0) continue;
  lines.push(`--- ${row.locale} ---`);
  for (const detail of row.details) {
    for (const [label, entries] of Object.entries(detail.errors)) {
      if (!entries.length) continue;
      lines.push(`  [${detail.file}] ${label.toUpperCase()} (${entries.length}):`);
      printEntries(lines, entries);
    }
    for (const [label, entries] of Object.entries(detail.warnings)) {
      if (!entries.length) continue;
      lines.push(`  [${detail.file}] ${label.toUpperCase()}, warn only (${entries.length}):`);
      printEntries(lines, entries, 20);
    }
  }
  lines.push('');
}

const totals = summary.reduce(
  (acc, row) => {
    for (const key of Object.keys(acc.errors)) acc.errors[key] += row.errors[key];
    for (const key of Object.keys(acc.warnings)) acc.warnings[key] += row.warnings[key];
    return acc;
  },
  {
    errors: { parse: 0, missing: 0, empty: 0, placeholders: 0, parameterMismatch: 0, brokenIcu: 0, htmlMismatch: 0, mojibake: 0 },
    warnings: { identical: 0, extra: 0, missingPage: 0 }
  }
);

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${lines.join('\n')}\n`);
// Machine-readable companion: full untruncated error/warning key lists per locale/file.
writeFileSync(
  reportPath.replace(/\.txt$/, '.json'),
  `${JSON.stringify(summary.map((row) => ({ locale: row.locale, details: row.details })), null, 2)}\n`
);
console.log((hasErrors ? lines : lines.slice(0, summaryLineCount)).join('\n'));
console.log(`Validation report written to ${path.relative(process.cwd(), reportPath)}`);

if (hasErrors) {
  const errorTotal = countTotals(totals.errors);
  console.error(`FAILED: ${errorTotal} strict i18n error(s) across ${locales.length} locale(s).`);
  process.exit(1);
}

console.log(`PASSED: no strict i18n errors across ${locales.length} locale(s).`);
