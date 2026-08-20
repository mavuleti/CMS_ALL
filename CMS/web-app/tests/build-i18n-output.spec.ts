import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const buildDirectory = path.join(process.cwd(), 'out');
const contentDirectory = path.join(process.cwd(), 'content');

function flattenMessageKeys(value: unknown, parentKey = ''): string[] {
  if (typeof value === 'string') return [parentKey];
  if (!value || typeof value !== 'object') return [];

  return Object.entries(value).flatMap(([key, child]) =>
    flattenMessageKeys(child, parentKey ? `${parentKey}.${key}` : key),
  );
}

function getJsonFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return getJsonFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.json') ? [entryPath] : [];
  });
}

const allTranslationKeys = new Set(
  getJsonFiles(contentDirectory).flatMap((filePath) =>
    flattenMessageKeys(JSON.parse(fs.readFileSync(filePath, 'utf8'))),
  ),
);
const i18nNamespaces = new Set([...allTranslationKeys].map((key) => key.split('.')[0]));

function getHtmlFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return getHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function lineNumber(content: string, characterIndex: number): number {
  return content.slice(0, characterIndex).split('\n').length;
}

function replaceWithWhitespace(value: string): string {
  return value.replace(/[^\n]/g, ' ');
}

test('static HTML contains no untranslated i18n keys', () => {
  expect(fs.existsSync(buildDirectory), 'Run npm run build before this test.').toBe(true);

  // Matches dotted key paths. The full locale key catalog below also catches
  // every known key, while namespaces catch typoed/missing leaf keys.
  const i18nKeyPattern = /\b[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+\b/g;
  const occurrences: Array<{ filePath: string; line: number; key: string }> = [];

  for (const filePath of getHtmlFiles(buildDirectory)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Scan only rendered text nodes. This excludes URLs, asset names, and the
    // Next.js payload in attributes/scripts while retaining original offsets.
    const visibleText = content
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, replaceWithWhitespace)
      .replace(/<!--(?:[\s\S]*?)-->/g, replaceWithWhitespace)
      .replace(/<[^>]*>/g, replaceWithWhitespace);

    for (const match of visibleText.matchAll(i18nKeyPattern)) {
      const key = match[0];
      if (!allTranslationKeys.has(key) && !i18nNamespaces.has(key.split('.')[0])) continue;

      occurrences.push({
        filePath: path.relative(process.cwd(), filePath),
        line: lineNumber(content, match.index ?? 0),
        key,
      });
    }
  }

  const report = occurrences
    .map(({ filePath, line, key }) => `${filePath}:${line} — ${key}`)
    .join('\n');

  expect(occurrences, `Untranslated i18n keys found:\n${report}`).toEqual([]);
});

// Reverse scan: instead of matching against the known key catalog, flag ANY
// dotted key-shaped token in visible text that is not an allowlisted piece of
// real content. This catches keys from namespaces that don't exist in
// content/ at all (e.g. a typoed namespace or a missing JSON file).
const allowedTokens = new Set([
  'U.S', // "U.S. 250th anniversary" copy
  'f.eks', // Danish "for eksempel"
  'H.C', // H.C. Andersen
  'q.b', // Portuguese "quanto baste"
]);
// Domains, file names, and other URL-ish tokens rendered as text. 'ca' covers
// real Canadian citation domains in the canada category's fun-fact links
// (canada.ca, thecanadianencyclopedia.ca), same URL/domain identically across
// every locale — not a translation gap.
const urlLikePattern = /\.(?:com|org|net|gov|edu|io|co|uk|ca|html)$/i;

test('static HTML visible text contains no key-shaped tokens (reverse scan)', () => {
  expect(fs.existsSync(buildDirectory), 'Run npm run build before this test.').toBe(true);

  const dottedTokenPattern = /\b[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+\b/g;
  const occurrences: Array<{ filePath: string; line: number; token: string }> = [];

  for (const filePath of getHtmlFiles(buildDirectory)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const visibleText = content
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, replaceWithWhitespace)
      .replace(/<!--(?:[\s\S]*?)-->/g, replaceWithWhitespace)
      .replace(/<[^>]*>/g, replaceWithWhitespace);

    for (const match of visibleText.matchAll(dottedTokenPattern)) {
      const token = match[0];
      if (allowedTokens.has(token) || urlLikePattern.test(token)) continue;
      occurrences.push({
        filePath: path.relative(process.cwd(), filePath),
        line: lineNumber(content, match.index ?? 0),
        token,
      });
    }
  }

  const report = occurrences
    .map(({ filePath, line, token }) => `${filePath}:${line} — ${token}`)
    .join('\n');

  expect(
    occurrences,
    `Key-shaped tokens found in visible text (add real content to the allowlist in this file if legitimate):\n${report}`,
  ).toEqual([]);
});
