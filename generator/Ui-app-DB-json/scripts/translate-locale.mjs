import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const locale = process.argv[2];
if (!locale) {
  console.error('Usage: node scripts/translate-locale.mjs <locale>');
  console.error('Example: node scripts/translate-locale.mjs de');
  process.exit(1);
}

const credentialCandidates = [
  path.resolve('content/.secret/google-translation-service-account.json'),
  path.resolve('content/.secret/googel-traslation-api.json'),
  path.resolve('.secrets/google-translation-service-account.json'),
  path.resolve('.secrets/googel-traslation-api.json'),
];
const credentialPath = credentialCandidates.find((candidate) => existsSync(candidate));
if (!credentialPath) {
  throw new Error(`Google Cloud credential not found. Expected one of:\n${credentialCandidates.join('\n')}`);
}
const credentials = JSON.parse(readFileSync(credentialPath, 'utf8'));
if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
  throw new Error(`Invalid Google Cloud service-account credential: ${credentialPath}`);
}

let accessToken;
let accessTokenExpiresAt = 0;
async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt - 60_000) return accessToken;
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'RS256', typ: 'JWT' });
  const claim = encode({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-translation',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  });
  const signature = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(credentials.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!response.ok) throw new Error(`Google OAuth failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  accessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + data.expires_in * 1000;
  return accessToken;
}

const files = readdirSync(path.join('content', 'en'))
  .filter((file) => file.endsWith('.json'))
  .sort();

const skipPathParts = new Set(['slug', 'href', 'src']);
const skipExactValues = new Set([
  'Blog',
  'FAQ',
  '500+',
  '100%',
  'USA 250 Years',
  'USA 250',
  'T-Rex',
  'Triceratops',
  'Velociraptor'
]);

function shouldTranslate(keyPath, value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (skipExactValues.has(trimmed)) return false;
  if (/^\/|^https?:\/\//.test(trimmed)) return false;
  if (/^\d+[\d\s.,:+%–-]*$/.test(trimmed)) return false;
  if (/^\d+\s*(Min\.|min|dots?|puntos?|Punkte|stippen|stjerner|kropek)/i.test(trimmed)) return false;
  if (/^\d+[–-]\d+$/.test(trimmed)) return false;
  if (keyPath.some((part) => skipPathParts.has(part))) return false;
  if (keyPath.at(-1) === 'range') return false;
  return /[A-Za-z]/.test(trimmed);
}

// HTML tags (including <a href="...">) are left untouched here and sent to
// Google with mimeType: 'text/html' instead — the API parses real markup
// structurally and translates only text nodes, so hrefs/attributes can never
// be corrupted and link text never gets dropped. Only ICU placeholders like
// {count} still need manual protection, since those aren't HTML. The
// placeholder token itself uses no ASCII letters at its edges (⟦0⟧, not
// ZXQ0QXZ) so agglutinative target languages (e.g. Finnish) can't glue a
// grammatical case suffix onto it and break the exact-string restore.
function protectText(text) {
  const tokens = [];
  const protectedText = text.replace(/\{[^{}]+\}/g, (match) => {
    const token = `⟦${tokens.length}⟧`;
    tokens.push(match);
    return token;
  });
  return { protectedText, tokens };
}

function restoreText(text, tokens) {
  let restored = text;
  tokens.forEach((tokenValue, index) => {
    restored = restored.replaceAll(`⟦${index}⟧`, tokenValue);
    restored = restored.replaceAll(`⟦ ${index} ⟧`, tokenValue);
  });
  return restored;
}

function hasHtmlTags(text) {
  return /<[a-z][^>]*>/i.test(text);
}

async function translateOne(protectedText, targetLocale, mimeType, attempt = 1) {
  const res = await fetch(`https://translation.googleapis.com/v3/projects/${credentials.project_id}/locations/global:translateText`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourceLanguageCode: 'en',
      targetLanguageCode: targetLocale,
      mimeType,
      contents: [protectedText],
    }),
  });
  if (!res.ok) {
    if (attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      return translateOne(protectedText, targetLocale, mimeType, attempt + 1);
    }
    throw new Error(`translate ${targetLocale} failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data?.translations?.[0]?.translatedText ?? '';
}

async function translateBatch(texts, targetLocale) {
  const out = [];
  for (const text of texts) {
    const { protectedText, tokens } = protectText(text);
    const mimeType = hasHtmlTags(protectedText) ? 'text/html' : 'text/plain';
    const translated = await translateOne(protectedText, targetLocale, mimeType);
    out.push(restoreText(translated, tokens));
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  return out;
}

function walk(source, target, keyPath, jobs) {
  if (Array.isArray(source) && Array.isArray(target)) {
    source.forEach((sourceItem, index) => walk(sourceItem, target[index], [...keyPath, String(index)], jobs));
    return;
  }

  if (source && typeof source === 'object' && target && typeof target === 'object') {
    for (const key of Object.keys(source)) walk(source[key], target[key], [...keyPath, key], jobs);
    return;
  }

  if (source === target && shouldTranslate(keyPath, source)) {
    jobs.push({ keyPath, value: source });
  }
}

function setAt(root, keyPath, value) {
  let current = root;
  for (let i = 0; i < keyPath.length - 1; i++) current = current[keyPath[i]];
  current[keyPath.at(-1)] = value;
}

for (const file of files) {
  const sourcePath = path.join('content', 'en', file);
  const targetPath = path.join('content', locale, file);
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  if (!existsSync(path.dirname(targetPath))) mkdirSync(path.dirname(targetPath), { recursive: true });
  if (!existsSync(targetPath)) writeFileSync(targetPath, `${JSON.stringify(source, null, 2)}\n`);
  const target = JSON.parse(readFileSync(targetPath, 'utf8'));
  const jobs = [];
  walk(source, target, [], jobs);

  if (!jobs.length) continue;

  console.log(`${locale}/${file}: translating ${jobs.length} field(s)`);
  const translated = await translateBatch(jobs.map((job) => job.value), locale);
  jobs.forEach((job, index) => setAt(target, job.keyPath, translated[index] || job.value));
  writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
}

console.log(`Done translating ${locale}.`);
