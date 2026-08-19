import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { computeAvailability, findOrphanSlugs, sectionFiles, ARABIC_REGIONAL_ALIASES } from './lib/translation-availability.mjs';

const SITE = 'https://dottodotfreeprintables.com';
const DEFAULT_LOCALE = 'en';
const TODAY = new Date().toISOString().slice(0, 10);
const SITEMAP_PATH = path.join('public', 'sitemap.xml');
const STATE_PATH = path.join('data', 'sitemap-state.json');
const STATE_VERSION = 1;

// scripts/lib/translation-availability.mjs (backed by lib/section-locales.ts,
// which the app itself reads for generateStaticParams/CategoryGrid) is the
// single source of truth for which locale/page combinations are real
// translations vs. English fallback. The sitemap reads it directly — no
// intermediate tracker files — so it can never drift from what the app
// actually builds.
const { locales: allLocales, statusFor } = computeAvailability();

for (const orphan of findOrphanSlugs()) {
  console.warn(`WARNING: orphan slug "${orphan.slug}" in content/${orphan.locale}/${orphan.file} — not present in content/en/, likely a typo or stale rename.`);
}

// Only locales that are actually routed AND have at least one available page
// beyond the placeholder set go in the sitemap/hreflang output. A locale
// whose availability marks every page "missing" (a placeholder / in-progress
// module) isn't live yet.
const contentLocales = allLocales.filter(
  (locale) => locale === DEFAULT_LOCALE || statusFor(locale, '').status === 'available'
);
// Regional Arabic paths (ar-AE/ar-SA/ar-QA) no longer exist as pages at all
// — Firebase Hosting 301s them to /ar/ (see firebase.json) — so they were
// never routable locales here and never appear in the sitemap.
const locales = contentLocales;

function slugsFor(locale, file) {
  const p = path.join('content', locale, file);
  const data = JSON.parse(readFileSync(p, 'utf8'));
  return data.map((item) => item.slug);
}

const staticPaths = ['', 'dinosaurs/', 'ocean/', 'playgrounds/', 'circus/', 'garden/', 'flowers/', 'cute/', 'space/', 'usa-250/', 'uae/', 'canada/', 'blog/', 'about/', 'contact/', 'privacy-policy/', 'terms/'];

// Age/difficulty hub pages (lib/hub-content.ts) are English-only for now —
// they cross-cut section availability logic (isExcludedForLocale would treat
// them as an "available for every non-placeholder locale" plain static page,
// which is wrong here), so they're handled entirely separately below instead
// of going through `paths`/`isExcludedForLocale`/hreflang alternates.
// 'difficulty/easy-1-20-dots/' is deliberately excluded: the real catalog's
// dot counts (32-250 as of 2026-08-19) mean that tier has zero puzzles, so
// the route itself skips generating it (see generateStaticParams in
// app/[locale]/difficulty/[tier]/page.tsx) — listing it here would sitemap
// a 404.
const enOnlyPaths = [
  'ages/4-6/', 'ages/7-9/', 'ages/9-12/',
  'difficulty/medium-21-60-dots/', 'difficulty/hard-61-plus-dots/'
];

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const contentCache = new Map();
const sourceCache = new Map();

function readJsonIfPresent(file) {
  if (!existsSync(file)) return null;
  if (!contentCache.has(file)) contentCache.set(file, JSON.parse(readFileSync(file, 'utf8')));
  return contentCache.get(file);
}

function sourceText(file) {
  if (!existsSync(file)) return '';
  if (!sourceCache.has(file)) sourceCache.set(file, readFileSync(file, 'utf8'));
  return sourceCache.get(file);
}

function previousState() {
  if (!existsSync(STATE_PATH)) return { version: STATE_VERSION, urls: {} };
  try {
    const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    if (state.version === STATE_VERSION && state.urls && typeof state.urls === 'object') return state;
    console.warn(`WARNING: ${STATE_PATH} has an unsupported format; rebuilding sitemap state.`);
  } catch (error) {
    console.warn(`WARNING: could not read ${STATE_PATH}; rebuilding sitemap state (${error.message}).`);
  }
  return { version: STATE_VERSION, urls: {} };
}

const puzzleImages = new Map();
const dataFiles = {
  'dinosaurs/': 'dinosaurs-data.ts',
  'ocean/': 'ocean-data.ts',
  'playgrounds/': 'playgrounds-data.ts',
  'circus/': 'circus-data.ts',
  'garden/': 'garden-data.ts',
  'flowers/': 'flowers-data.ts',
  'cute/': 'cute-data.ts',
  'space/': 'space-data.ts',
  'usa-250/': 'usa-250-data.ts',
  'uae/': 'uae-data.ts',
  'canada/': 'canada-data.ts'
};
for (const [prefix, file] of Object.entries(sectionFiles)) {
  if (prefix === 'blog/') continue;
  const source = readFileSync(path.join('lib', dataFiles[prefix]), 'utf8');
  for (const match of source.matchAll(/slug:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g)) {
    if (match[2].startsWith('/images/')) {
      const item = JSON.parse(readFileSync(path.join('content', DEFAULT_LOCALE, file), 'utf8'))
        .find((candidate) => candidate.slug === match[1]);
      puzzleImages.set(`${prefix}${match[1]}/`, { image: match[2], title: item?.name ?? match[1] });
    }
  }
}

const paths = [...staticPaths];
for (const [prefix, file] of Object.entries(sectionFiles)) {
  for (const slug of slugsFor(DEFAULT_LOCALE, file)) {
    paths.push(`${prefix}${slug}/`);
  }
}

// Whether locale should get a URL/hreflang for path p, per
// scripts/lib/translation-availability.mjs. Regional Arabic aliases share
// 'ar' availability since they share its content (see contentLocaleFor in
// lib/section-locales.ts).
function isExcludedForLocale(locale, p) {
  if (locale === DEFAULT_LOCALE) return false;
  const availabilityLocale = ARABIC_REGIONAL_ALIASES.includes(locale) ? 'ar' : locale;
  return statusFor(availabilityLocale, p).status !== 'available';
}

function routeSourceFor(p) {
  if (p === '') return sourceText(path.join('app', '[locale]', 'page.tsx'));
  const segments = p.replace(/\/$/, '').split('/');
  const exact = path.join('app', '[locale]', ...segments, 'page.tsx');
  if (existsSync(exact)) return sourceText(exact);
  const dynamic = path.join('app', '[locale]', segments[0], '[slug]', 'page.tsx');
  return sourceText(dynamic);
}

function localizedPageContent(locale, p) {
  for (const [prefix, file] of Object.entries(sectionFiles)) {
    if (p !== prefix && !p.startsWith(prefix)) continue;
    const availabilityLocale = ARABIC_REGIONAL_ALIASES.includes(locale) ? 'ar' : locale;
    const localizedFile = path.join('content', availabilityLocale, file);
    const fallbackFile = path.join('content', DEFAULT_LOCALE, file);
    const items = readJsonIfPresent(localizedFile) ?? readJsonIfPresent(fallbackFile) ?? [];
    if (p === prefix) return items;
    const slug = p.slice(prefix.length).replace(/\/$/, '');
    return items.find((item) => item.slug === slug) ?? null;
  }
  return null;
}

function entryMetadata(localePath) {
  const alternates = locales
    .filter((l) => !isExcludedForLocale(l, localePath.path))
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/${l}/${localePath.path}"/>`)
    .join('\n');
  const puzzleImage = puzzleImages.get(localePath.path);
  const imageEntry = puzzleImage
    ? `\n    <image:image>\n      <image:loc>${SITE}${puzzleImage.image}</image:loc>\n      <image:title>${escapeXml(puzzleImage.title)}</image:title>\n    </image:image>`
    : '';
  return { alternates, imageEntry };
}

function urlEntry(localePath, lastModified, metadata) {
  const { alternates, imageEntry } = metadata;
  return `  <url>
    <loc>${SITE}/${localePath.locale}/${localePath.path}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/${DEFAULT_LOCALE}/${localePath.path}"/>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${localePath.path === '' ? '1.0' : '0.8'}</priority>
${imageEntry}
  </url>`;
}

const oldState = previousState();
const newState = { version: STATE_VERSION, urls: {} };
const entriesBySitemap = new Map();
let added = 0;
let changed = 0;
for (const locale of locales) {
  const sitemapFile = `sitemap-${locale}.xml`;
  entriesBySitemap.set(sitemapFile, []);
  for (const p of paths) {
    if (isExcludedForLocale(locale, p)) continue;
    const localePath = { locale, path: p };
    const url = `${SITE}/${locale}/${p}`;
    const metadata = entryMetadata(localePath);
    const hash = sha256(JSON.stringify({
      localePath,
      metadata,
      content: localizedPageContent(locale, p),
      routeSource: routeSourceFor(p)
    }));
    const previous = oldState.urls[url];
    const lastModified = previous?.hash === hash ? previous.lastModified : TODAY;
    if (!previous) added += 1;
    else if (previous.hash !== hash) changed += 1;
    newState.urls[url] = { hash, lastModified };
    entriesBySitemap.get(sitemapFile).push(urlEntry(localePath, lastModified, metadata));
  }
}
const enSitemapFile = `sitemap-${DEFAULT_LOCALE}.xml`;
if (entriesBySitemap.has(enSitemapFile)) {
  for (const p of enOnlyPaths) {
    const localePath = { locale: DEFAULT_LOCALE, path: p };
    const url = `${SITE}/${DEFAULT_LOCALE}/${p}`;
    // No cross-locale alternates — this page only exists in English.
    const metadata = { alternates: '', imageEntry: '' };
    const hash = sha256(JSON.stringify({ localePath, metadata, enOnly: true }));
    const previous = oldState.urls[url];
    const lastModified = previous?.hash === hash ? previous.lastModified : TODAY;
    if (!previous) added += 1;
    else if (previous.hash !== hash) changed += 1;
    newState.urls[url] = { hash, lastModified };
    entriesBySitemap.get(enSitemapFile).push(urlEntry(localePath, lastModified, metadata));
  }
}

const deleted = Object.keys(oldState.urls).filter((url) => !newState.urls[url]).length;

function urlSetXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${entries.join('\n\n')}

</urlset>
`;
}

function writeIfChanged(file, contents) {
  const previous = existsSync(file) ? readFileSync(file, 'utf8') : null;
  if (previous === contents) return false;
  writeFileSync(file, contents);
  return true;
}

const sitemapFiles = locales.map((locale) => `sitemap-${locale}.xml`);
let generatedUrlCount = 0;
for (const file of sitemapFiles) {
  const entries = entriesBySitemap.get(file);
  generatedUrlCount += entries.length;
  const changedFile = writeIfChanged(path.join('public', file), urlSetXml(entries));
  const bytes = Buffer.byteLength(urlSetXml(entries), 'utf8');
  if (entries.length > 50_000 || bytes > 50 * 1024 * 1024) {
    throw new Error(`${file} exceeds the sitemap protocol limit (${entries.length} URLs, ${bytes} bytes).`);
  }
  console.log(`${changedFile ? 'Updated' : 'Unchanged'} ${file}: ${entries.length} URLs, ${(bytes / 1024).toFixed(1)} KB`);
}

const expectedFiles = new Set(sitemapFiles);
for (const file of readdirSync('public')) {
  if (/^sitemap-.+\.xml$/.test(file) && !expectedFiles.has(file)) {
    unlinkSync(path.join('public', file));
    console.log(`Removed stale ${file}`);
  }
}

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map((file) => `  <sitemap>\n    <loc>${SITE}/${escapeXml(file)}</loc>\n  </sitemap>`).join('\n')}
</sitemapindex>
`;
const indexChanged = writeIfChanged(SITEMAP_PATH, sitemapIndexXml);
console.log(`${indexChanged ? 'Updated' : 'Unchanged'} sitemap.xml index: ${sitemapFiles.length} files; ${added} added, ${changed} changed, ${deleted} deleted; ${generatedUrlCount} URLs total`);

const serializedState = `${JSON.stringify(newState, null, 2)}\n`;
const oldSerializedState = existsSync(STATE_PATH) ? readFileSync(STATE_PATH, 'utf8') : null;
if (oldSerializedState !== serializedState) writeFileSync(STATE_PATH, serializedState);

// ---------------------------------------------------------------------------
// llms.txt / llms-full.txt — machine-readable site guides for AI crawlers
// (GPTBot, ClaudeBot, PerplexityBot, etc.). Regenerated at build time from the
// same English content the sitemap uses, so they never drift from the catalog.
// URLs use the canonical /en/ prefix (trailingSlash) to avoid redirect hops.
// ---------------------------------------------------------------------------

const firstSentence = (text) => {
  const s = String(text).replace(/<[^>]+>/g, '').trim();
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

const CATEGORY_INFO = {
  'dinosaurs/': { file: 'puzzles-dinosaurs.json', label: 'Dinosaur dot-to-dot printables' },
  'ocean/': { file: 'puzzles-ocean.json', label: 'Ocean dot-to-dot printables' },
  'playgrounds/': { file: 'puzzles-playgrounds.json', label: 'Playground dot-to-dot printables' },
  'garden/': { file: 'puzzles-garden.json', label: 'Garden dot-to-dot printables' },
  'flowers/': { file: 'puzzles-flowers.json', label: 'Flower dot-to-dot printables' },
  'cute/': { file: 'puzzles-cute.json', label: 'Cute dot-to-dot printables' },
  'usa-250/': { file: 'puzzles-usa-250.json', label: 'America 250th anniversary dot-to-dot printables' },
  'uae/': { file: 'puzzles-uae.json', label: 'UAE-themed dot-to-dot printables' },
  'canada/': { file: 'puzzles-canada.json', label: 'Canada-themed dot-to-dot printables' }
};

const enUrl = (p) => `${SITE}/${DEFAULT_LOCALE}/${p}`;

const intro = `# Dot to Dot Free Printables

> Free printable connect-the-dots (dot-to-dot) worksheets for kids ages 2-12. Every puzzle is a print-ready PDF in US Letter and A4, portrait and landscape, 100% free to download with no sign-up, account, or payment required. Free for personal and classroom use. Content is available in ${locales.length} languages via /{locale}/ URL prefixes (English at /en/ is canonical).

## Other languages
- [Español](${SITE}/es/llms.txt): Spanish-language site guide with localized URLs and descriptions.
- [العربية](${SITE}/ar/llms.txt): Arabic-language site guide with localized URLs and descriptions.
- [Deutsch](${SITE}/de/llms.txt): German-language site guide with localized URLs and descriptions.

## Categories
${Object.entries(CATEGORY_INFO).map(([p, c]) => `- [${c.label}](${enUrl(p)})`).join('\n')}
- [Blog: guides for parents and teachers](${enUrl('blog/')})
`;

let llms = intro;
let llmsFull = intro;

for (const [prefix, cat] of Object.entries(CATEGORY_INFO)) {
  const items = JSON.parse(readFileSync(path.join('content', DEFAULT_LOCALE, cat.file), 'utf8'));
  llms += `\n## ${cat.label}\n\n`;
  llmsFull += `\n## ${cat.label}\n\n`;
  for (const item of items) {
    const url = enUrl(`${prefix}${item.slug}/`);
    llms += `- [${item.name}](${url}): ${firstSentence(item.description)}\n`;
    llmsFull += `- [${item.name}](${url}): ${String(item.description).trim()}${item.funFact ? ` Fun fact: ${item.funFact}` : ''}\n`;
  }
}

const blogPosts = JSON.parse(readFileSync(path.join('content', DEFAULT_LOCALE, 'blog.json'), 'utf8'));
llms += `\n## Blog articles\n\n`;
llmsFull += `\n## Blog articles\n\n`;
for (const post of blogPosts) {
  const url = enUrl(`blog/${post.slug}/`);
  llms += `- [${post.title}](${url}): ${firstSentence(post.description)}\n`;
  llmsFull += `- [${post.title}](${url}): ${String(post.description).trim()}\n`;
}

const outro = `\n## Notes for AI assistants\n\n- All worksheets are free (isAccessibleForFree: true in page schema) and require no registration.\n- PDFs print on standard US Letter (8.5" x 11") and A4 paper; both sizes and both orientations (portrait/landscape) are offered on every puzzle page.\n- Difficulty is indicated by dot count: 10-20 dots (toddler/preschool), 20-50 (kindergarten-1st grade), 50-200+ (grades 2-6).\n- Every puzzle page includes: a kid-friendly fun fact, a step-by-step dot guide (HowTo schema), a page-specific FAQ (FAQPage schema), and CreativeWork/LearningResource schema with age range and skills taught.\n- The homepage, every category page, every puzzle page, and every blog post carry a visible FAQ section with matching FAQPage JSON-LD; answers may be quoted with attribution to DotToDotFreePrintables.com.\n- Worksheets are free for personal, homeschool, and classroom use; resale or republication of the files is not permitted.\n- Sitemap: ${SITE}/sitemap.xml\n`;
llms += outro;
llmsFull += outro;

const MAX_LLMS_BYTES = 50 * 1024;
for (const [file, content] of [['public/llms.txt', llms], ['public/llms-full.txt', llmsFull]]) {
  let body = content;
  if (Buffer.byteLength(body, 'utf8') > MAX_LLMS_BYTES) {
    console.warn(`WARNING: ${file} exceeds ${MAX_LLMS_BYTES} bytes; truncating at section boundary.`);
    while (Buffer.byteLength(body, 'utf8') > MAX_LLMS_BYTES && body.includes('\n## ')) {
      body = body.slice(0, body.lastIndexOf('\n## '));
    }
  }
  writeFileSync(file, body);
  console.log(`Generated ${file}: ${Buffer.byteLength(body, 'utf8')} bytes`);
}
