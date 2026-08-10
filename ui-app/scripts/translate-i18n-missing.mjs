import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const contentDir = path.resolve('content');
const sourceLocale = 'en';
const defaultFiles = [
  'messages.json',
  'blog.json',
  'puzzles-dinosaurs.json',
  'puzzles-ocean.json',
  'puzzles-usa-250.json',
  'puzzles-playgrounds.json'
];

const googleTargetLocales = {
  ar: 'ar',
  az: 'az',
  cs: 'cs',
  da: 'da',
  de: 'de',
  el: 'el',
  es: 'es',
  fa: 'fa',
  fi: 'fi',
  fr: 'fr',
  hr: 'hr',
  hu: 'hu',
  id: 'id',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  lt: 'lt',
  lv: 'lv',
  nl: 'nl',
  no: 'no',
  pl: 'pl',
  pt: 'pt-PT',
  'pt-BR': 'pt-BR',
  ro: 'ro',
  ru: 'ru',
  sk: 'sk',
  sl: 'sl',
  sv: 'sv',
  th: 'th',
  tr: 'tr',
  uk: 'uk',
  vi: 'vi'
};

const deeplTargetLocales = {
  cs: 'CS',
  da: 'DA',
  de: 'DE',
  es: 'ES',
  fi: 'FI',
  fr: 'FR',
  hu: 'HU',
  it: 'IT',
  nl: 'NL',
  no: 'NB',
  pl: 'PL',
  pt: 'PT-BR',
  ro: 'RO',
  sv: 'SV',
  ar: 'AR',
  uk: 'UK'
};

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  args.set(key, rest.length ? rest.join('=') : 'true');
}

const dryRun = args.get('dry-run') === 'true';
const provider = args.get('provider') ?? 'auto';
const geminiModel = args.get('gemini-model') ?? 'gemini-2.0-flash';
const locales = (args.get('locales') ?? Object.keys(googleTargetLocales).join(','))
  .split(',')
  .map((locale) => locale.trim())
  .filter(Boolean);
const files = (args.get('files') ?? defaultFiles.join(','))
  .split(',')
  .map((file) => file.trim())
  .filter(Boolean);
const keyPrefix = (args.get('key-prefix') ?? '').split('.').filter(Boolean);
const forceTranslate = args.get('force') === 'true';
const envFiles = [
  args.get('env-file'),
  path.resolve('.env.local'),
  path.resolve('..', 'd2d-tool', '.env.local'),
  path.resolve('..', 'd2d-tool', '.env')
].filter(Boolean);

const keyFiles = [
  args.get('key-file'),
  path.resolve('.secrets', 'google-api-key.txt'),
  path.resolve('..', 'DOT-TO-DOT-YT', 'input', 'keys.txt')
].filter(Boolean);

const saKeyPath = args.get('sa-file') ?? path.resolve('.secrets', 'googel-traslation-api.json');
const serviceAccount = existsSync(saKeyPath) ? JSON.parse(readFileSync(saKeyPath, 'utf8')) : null;
let cachedToken = null;

function b64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken() {
  if (!serviceAccount) throw new Error('No Google service account credentials found');
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) return cachedToken.token;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-translation',
    aud: serviceAccount.token_uri,
    exp: now + 3600,
    iat: now
  };
  const unsigned = `${b64url(Buffer.from(JSON.stringify(header)))}.${b64url(Buffer.from(JSON.stringify(claim)))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key);
  const jwt = `${unsigned}.${b64url(signature)}`;

  const res = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Failed to get Google access token: ${JSON.stringify(data)}`);
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

let charsSent = 0;
let charsReceived = 0;
let apiRequests = 0;

const cachePath = path.resolve('temp', 'i18n-google-translate-cache.json');
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};

const skipPathParts = new Set(['slug', 'href', 'src']);
const skipExactValues = new Set([
  'Blog',
  'FAQ',
  '500+',
  '100%',
  'USA 250',
  'USA 250 Years',
  'T-Rex',
  'Triceratops',
  'Velociraptor',
  'Brontosaurus',
  'Stegosaurus',
  'Spinosaurus',
  'Brachiosaurus',
  'Ankylosaurus',
  'Allosaurus',
  'USA 250 Astronaut',
  'Video',
  'Feedback',
  'Sitemap',
  'Deutsch',
  'Español',
  'Italiano',
  'Norsk',
  'Dansk',
  'Čeština',
  'Send feedback'
]);

function loadEnvFile(filePath) {
  if (!filePath || !existsSync(filePath)) return;
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

for (const envFile of envFiles) loadEnvFile(envFile);

function loadKeyCandidates(filePath) {
  if (!filePath || !existsSync(filePath)) return [];
  const candidates = [];
  for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.includes('=')) {
      const [key, ...rest] = line.split('=');
      if (['GOOGLE_TRANSLATE_API_KEY', 'GOOGLE_CLOUD_TRANSLATE_API_KEY', 'GOOGLE_CLOUD_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY', 'DEEPL_API_KEY', 'API_KEY'].includes(key.trim().toUpperCase())) {
        candidates.push(rest.join('=').trim().replace(/^['"]|['"]$/g, ''));
      }
      continue;
    }
    // Handle "Label: value" lines (e.g. "DeepL: xxxxx:fx") that aren't KEY=value pairs.
    const labelMatch = line.match(/^[A-Za-z][A-Za-z0-9 _-]*:\s+(\S.*)$/);
    const value = labelMatch ? labelMatch[1] : line;
    candidates.push(value.replace(/^['"]|['"]$/g, ''));
  }
  return candidates;
}

const allKeyCandidates = keyFiles.flatMap(loadKeyCandidates);
const deeplKeyCandidate = allKeyCandidates.find((key) => /:fx$/i.test(key) || /^[0-9a-f-]{36,39}(:fx)?$/i.test(key));

const rawKey =
  process.env.GOOGLE_TRANSLATE_API_KEY ||
  process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY ||
  process.env.GOOGLE_CLOUD_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.DEEPL_API_KEY ||
  allKeyCandidates[0] ||
  '';

// DeepL keys are recognizable by their trailing ":fx" (free tier) suffix or plain UUID-style format.
const looksLikeDeepLKey = typeof rawKey === 'string' && (/:fx$/i.test(rawKey.trim()) || /^[0-9a-f-]{36,39}(:fx)?$/i.test(rawKey.trim()));
const wantsDeepL = provider === 'deepl' || (provider === 'auto' && Boolean(deeplKeyCandidate));
const apiKey = wantsDeepL ? (process.env.DEEPL_API_KEY || deeplKeyCandidate || rawKey) : rawKey;

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function shouldTranslate(keyPath, value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (skipExactValues.has(trimmed)) return false;
  if (/^\/|^https?:\/\//.test(trimmed)) return false;
  if (/^\d+[\d\s.,:+%–-]*$/.test(trimmed)) return false;
  if (/^\d+[–-]\d+$/.test(trimmed)) return false;
  if (keyPath.some((part) => skipPathParts.has(part))) return false;
  if (keyPath.at(-1) === 'range') return false;
  return /[A-Za-z]/.test(trimmed);
}

function protectText(text) {
  // Balanced-brace matcher so nested ICU (e.g. `{count, plural, one {# a} other {# b}}`)
  // is protected as a single unit rather than only its innermost segments.
  const tokens = [];
  let protectedText = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '{') {
      let depth = 1;
      let j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      const match = text.slice(i, j);
      protectedText += `<span translate="no">${tokens.length}</span>`;
      tokens.push(match);
      i = j;
    } else {
      protectedText += text[i];
      i++;
    }
  }
  return { protectedText, tokens };
}

function restoreText(text, tokens) {
  let restored = text;
  tokens.forEach((tokenValue, index) => {
    restored = restored.replace(new RegExp(`<span translate="no">\\s*${index}\\s*</span>`, 'g'), tokenValue);
  });
  return restored;
}

function walk(source, target, keyPath, jobs) {
  if (Array.isArray(source)) {
    source.forEach((sourceItem, index) => walk(sourceItem, Array.isArray(target) ? target[index] : undefined, [...keyPath, String(index)], jobs));
    return;
  }

  if (source && typeof source === 'object') {
    for (const key of Object.keys(source)) {
      walk(source[key], target && typeof target === 'object' ? target[key] : undefined, [...keyPath, key], jobs);
    }
    return;
  }

  const isInPrefix = !keyPrefix.length || keyPrefix.every((part, index) => keyPath[index] === part);
  if (!isInPrefix) return;

  if ((forceTranslate || target === undefined || source === target) && shouldTranslate(keyPath, source)) {
    jobs.push({ keyPath, value: source, translate: true });
    return;
  }

  // A leaf that's entirely missing from the target but isn't translatable
  // (a URL, a numeric range, a brand term) still needs to exist - copy the
  // source value through verbatim rather than leaving the key absent.
  if (target === undefined && source !== '' && source !== null && source !== undefined) {
    jobs.push({ keyPath, value: source, translate: false });
  }
}

function setAt(root, keyPath, value) {
  let current = root;
  for (let i = 0; i < keyPath.length - 1; i++) {
    if (!current[keyPath[i]] || typeof current[keyPath[i]] !== 'object') {
      current[keyPath[i]] = /^\d+$/.test(keyPath[i + 1]) ? [] : {};
    }
    current = current[keyPath[i]];
  }
  current[keyPath.at(-1)] = value;
}

async function translateTexts(texts, targetLocale, locale) {
  if (provider === 'gtx') return translateTextsWithGtx(texts, targetLocale);
  if (provider === 'deepl') return translateTextsWithDeepL(texts, locale);
  if (provider === 'gemini') return translateTextsWithGemini(texts, targetLocale);
  if (provider === 'google') return translateTextsWithGoogleCloud(texts, targetLocale);
  if (provider === 'auto' && looksLikeDeepLKey) return translateTextsWithDeepL(texts, locale);
  try {
    return await translateTextsWithGoogleCloud(texts, targetLocale);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('403') && !message.includes('Cloud Translation API')) throw error;
    console.warn(`Google Cloud Translation unavailable for ${targetLocale}; falling back to Gemini.`);
    return translateTextsWithGemini(texts, targetLocale);
  }
}

async function translateTextsWithGtx(texts, targetLocale) {
  const translated = [];
  for (let start = 0; start < texts.length; start += 8) {
    const batch = texts.slice(start, start + 8);
    const results = await Promise.all(batch.map(async (text) => {
      const { protectedText, tokens } = protectText(text);
      const cacheKey = `gtx:${targetLocale}\u0000${protectedText}`;
      if (!cache[cacheKey]) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLocale)}&dt=t&q=${encodeURIComponent(protectedText)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Google GTX translation failed for ${targetLocale}: ${res.status} ${res.statusText}`);
        const data = await res.json();
        cache[cacheKey] = (data?.[0] ?? []).map((part) => part?.[0] ?? '').join('') || protectedText;
      }
      return restoreText(cache[cacheKey], tokens);
    }));
    translated.push(...results);
  }
  return translated;
}

async function translateTextsWithDeepL(texts, locale) {
  const deeplLocale = deeplTargetLocales[locale];
  if (!deeplLocale) throw new Error(`Unsupported DeepL locale: ${locale}`);

  const translated = [];
  let batch = [];
  let batchLength = 0;
  const apiBase = /:fx$/i.test(apiKey.trim()) ? 'https://api-free.deepl.com' : 'https://api.deepl.com';

  async function flush() {
    if (!batch.length) return;

    const missing = batch.filter((item) => !cache[item.cacheKey]);
    if (missing.length) {
      const res = await fetch(`${apiBase}/v2/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `DeepL-Auth-Key ${apiKey}`
        },
        body: JSON.stringify({
          text: missing.map((item) => item.protectedText),
          source_lang: 'EN',
          target_lang: deeplLocale
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DeepL translation failed for ${locale}: ${res.status} ${res.statusText}\n${text.slice(0, 800)}`);
      }

      const data = await res.json();
      const results = data?.translations ?? [];
      missing.forEach((item, index) => {
        cache[item.cacheKey] = results[index]?.text ?? item.protectedText;
      });
    }

    for (const item of batch) translated.push(restoreText(cache[item.cacheKey], item.tokens));
    batch = [];
    batchLength = 0;
  }

  for (const text of texts) {
    const { protectedText, tokens } = protectText(text);
    const cacheKey = `deepl:${deeplLocale} ${protectedText}`;
    const itemLength = protectedText.length + 10;
    if (batch.length && (batch.length >= 50 || batchLength + itemLength > 24000)) await flush();
    batch.push({ protectedText, tokens, cacheKey });
    batchLength += itemLength;
  }

  await flush();
  return translated;
}

async function translateTextsWithGoogleCloud(texts, targetLocale) {
  const translated = [];
  let batch = [];
  let batchLength = 0;

  async function flush() {
    if (!batch.length) return;

    const missing = batch.filter((item) => !cache[item.cacheKey]);
    if (missing.length) {
      if (serviceAccount) {
        const token = await getAccessToken();
        const res = await fetch(`https://translation.googleapis.com/v3/projects/${serviceAccount.project_id}:translateText`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: missing.map((item) => item.protectedText),
            sourceLanguageCode: 'en',
            targetLanguageCode: targetLocale,
            mimeType: 'text/html'
          })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Google Translate v3 failed for ${targetLocale}: ${res.status} ${res.statusText}\n${text.slice(0, 800)}`);
        }

        const data = await res.json();
        const results = data?.translations ?? [];
        apiRequests += 1;
        const sentLen = missing.reduce((sum, item) => sum + item.protectedText.length, 0);
        const receivedLen = results.reduce((sum, r) => sum + (r?.translatedText?.length ?? 0), 0);
        charsSent += sentLen;
        charsReceived += receivedLen;
        console.log(`  [google v3] ${targetLocale}: sent ${sentLen} chars, received ${receivedLen} chars (${missing.length} items)`);
        missing.forEach((item, index) => {
          cache[item.cacheKey] = results[index]?.translatedText ?? item.protectedText;
        });
      } else {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: missing.map((item) => item.protectedText),
            source: 'en',
            target: targetLocale,
            format: 'html'
          })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Google Translate failed for ${targetLocale}: ${res.status} ${res.statusText}\n${text.slice(0, 800)}`);
        }

        const data = await res.json();
        const results = data?.data?.translations ?? [];
        missing.forEach((item, index) => {
          cache[item.cacheKey] = results[index]?.translatedText ?? item.protectedText;
        });
      }
    }

    for (const item of batch) translated.push(restoreText(cache[item.cacheKey], item.tokens));
    batch = [];
    batchLength = 0;
  }

  for (const text of texts) {
    const { protectedText, tokens } = protectText(text);
    const cacheKey = `${targetLocale}\u0000${protectedText}`;
    const itemLength = protectedText.length + 10;
    if (batch.length && batchLength + itemLength > 24000) await flush();
    batch.push({ protectedText, tokens, cacheKey });
    batchLength += itemLength;
  }

  await flush();
  return translated;
}

function parseGeminiJsonArray(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error(`Gemini response was not a JSON array: ${cleaned.slice(0, 500)}`);
  }
}

async function translateTextsWithGemini(texts, targetLocale) {
  const translated = [];
  let batch = [];
  let batchLength = 0;

  async function flush() {
    if (!batch.length) return;

    const missing = batch.filter((item) => !cache[item.cacheKey]);
    if (missing.length) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const input = missing.map((item) => item.protectedText);
      const prompt = [
        `Translate this JSON array of English UI/content strings into locale "${targetLocale}".`,
        'Return only a valid JSON array of strings in the same order.',
        'Preserve tokens like ZXQ0QXZ exactly. Preserve punctuation, HTML entity intent, and placeholders.',
        'Do not translate URLs, code-like tokens, or brand names inside the strings.',
        JSON.stringify(input)
      ].join('\n');

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini translation failed for ${targetLocale}: ${res.status} ${res.statusText}\n${text.slice(0, 800)}`);
      }

      const data = await res.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
      const results = parseGeminiJsonArray(responseText);
      if (!Array.isArray(results) || results.length !== missing.length) {
        throw new Error(`Gemini returned ${Array.isArray(results) ? results.length : 'non-array'} translations for ${missing.length} inputs.`);
      }
      missing.forEach((item, index) => {
        cache[item.cacheKey] = String(results[index] ?? item.protectedText);
      });
    }

    for (const item of batch) translated.push(restoreText(cache[item.cacheKey], item.tokens));
    batch = [];
    batchLength = 0;
  }

  for (const text of texts) {
    const { protectedText, tokens } = protectText(text);
    const cacheKey = `gemini:${geminiModel}:${targetLocale}\u0000${protectedText}`;
    const itemLength = protectedText.length + 10;
    if (batch.length && (batch.length >= 40 || batchLength + itemLength > 12000)) await flush();
    batch.push({ protectedText, tokens, cacheKey });
    batchLength += itemLength;
  }

  await flush();
  return translated;
}

if (!dryRun && !apiKey && !serviceAccount) {
  console.error('Missing translation API key. Set GOOGLE_TRANSLATE_API_KEY, GOOGLE_CLOUD_TRANSLATE_API_KEY, GOOGLE_CLOUD_API_KEY, GOOGLE_API_KEY, or DEEPL_API_KEY.');
  console.error('The script also reads .env.local, .secrets/google-api-key.txt, and ../DOT-TO-DOT-YT/input/keys.txt when present.');
  process.exit(1);
}

let total = 0;

for (const locale of locales) {
  const targetLocale = googleTargetLocales[locale];
  if (!targetLocale) throw new Error(`Unsupported locale: ${locale}`);

  for (const file of files) {
    const sourcePath = path.join(contentDir, sourceLocale, file);
    const targetPath = path.join(contentDir, locale, file);
    const source = readJson(sourcePath);
    const target = readJson(targetPath);
    const jobs = [];

    walk(source, target, [], jobs);
    if (!jobs.length) continue;

    total += jobs.length;
    const translateJobs = jobs.filter((job) => job.translate);
    const copyJobs = jobs.filter((job) => !job.translate);
    console.log(
      `${locale}/${file}: ${dryRun ? 'would translate' : 'translating'} ${translateJobs.length} field(s)`
      + (copyJobs.length ? `, copying ${copyJobs.length} non-translatable field(s)` : '')
    );
    if (dryRun) continue;

    const translated = await translateTexts(translateJobs.map((job) => job.value), targetLocale, locale);
    translateJobs.forEach((job, index) => setAt(target, job.keyPath, translated[index] || job.value));
    copyJobs.forEach((job) => setAt(target, job.keyPath, job.value));
    writeFileSync(targetPath, `${JSON.stringify(target, null, 2)}\n`);
  }
}

if (!dryRun) writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`${dryRun ? 'Found' : 'Translated'} ${total} field(s).`);
if (!dryRun) {
  console.log(`API requests: ${apiRequests}`);
  console.log(`Characters sent: ${charsSent}`);
  console.log(`Characters received: ${charsReceived}`);
}
