#!/usr/bin/env node
/**
 * Google Search Console indexing audit + sitemap submission.
 *
 * What the Search Console API can and cannot do:
 *   CAN:  submit the sitemap, and inspect URLs one by one to report Google's
 *         verdict, coverage state, and chosen canonical.
 *   CANNOT: force indexing or trigger "Validate fix" — those have no API.
 *
 * Setup (one time):
 *   1. Google Cloud Console -> create a service account, download its JSON key.
 *   2. Enable "Google Search Console API" on that project.
 *   3. Search Console -> Settings -> Users and permissions -> add the service
 *      account email as a Full user (Owner needed only for sitemap submission
 *      on some property types).
 *   4. Set GSC_KEY_FILE to the JSON key path (or GOOGLE_APPLICATION_CREDENTIALS).
 *
 * Usage:
 *   node scripts/gsc-audit.mjs sitemap            # submit sitemap.xml
 *   node scripts/gsc-audit.mjs inspect [limit]    # inspect sitemap URLs (default 200)
 *   node scripts/gsc-audit.mjs inspect-file urls.txt   # inspect an explicit URL list
 *
 * Env:
 *   GSC_SITE_URL  Search Console property. Default: sc-domain:dottodotfreeprintables.com
 *                 (use "https://dottodotfreeprintables.com/" for a URL-prefix property)
 *   GSC_KEY_FILE  Path to the service-account JSON key.
 *
 * Output: reports/gsc-inspection.json + reports/gsc-inspection.csv, grouped
 * summary printed to stdout. URL Inspection quota is 2,000 calls/day.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:dottodotfreeprintables.com';
const BASE_URL = 'https://dottodotfreeprintables.com';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const KEY_FILE = process.env.GSC_KEY_FILE || process.env.GOOGLE_APPLICATION_CREDENTIALS;
const CONCURRENCY = 10; // stay well under the ~600 QPM API cap

if (!KEY_FILE) {
  console.error('Set GSC_KEY_FILE (or GOOGLE_APPLICATION_CREDENTIALS) to a service-account JSON key path.');
  process.exit(1);
}

const auth = new GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

async function api(url, options = {}) {
  const client = await auth.getClient();
  const res = await client.request({ url, ...options });
  return res.data;
}

async function submitSitemap() {
  const enc = encodeURIComponent(SITE_URL);
  await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`, { method: 'PUT' });
  console.log(`Submitted ${SITEMAP_URL} to property ${SITE_URL}`);
  const list = await api(`https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`);
  for (const s of list.sitemap || []) {
    console.log(`  ${s.path}  lastSubmitted=${s.lastSubmitted}  errors=${s.errors}  warnings=${s.warnings}`);
  }
}

function sitemapUrls() {
  const xml = readFileSync('public/sitemap.xml', 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function inspectOne(url) {
  try {
    const data = await api('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      data: { inspectionUrl: url, siteUrl: SITE_URL }
    });
    const r = data.inspectionResult?.indexStatusResult || {};
    return {
      url,
      verdict: r.verdict || '',
      coverageState: r.coverageState || '',
      indexingState: r.indexingState || '',
      robotsTxtState: r.robotsTxtState || '',
      userCanonical: r.userCanonical || '',
      googleCanonical: r.googleCanonical || '',
      canonicalMismatch: Boolean(r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical),
      lastCrawlTime: r.lastCrawlTime || '',
      pageFetchState: r.pageFetchState || ''
    };
  } catch (e) {
    return { url, verdict: 'ERROR', coverageState: e.message };
  }
}

async function inspect(urls) {
  const results = [];
  let done = 0;
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      results.push(await inspectOne(url));
      done += 1;
      if (done % 25 === 0) {
        console.log(`  inspected ${done}/${urls.length}`);
        mkdirSync('reports', { recursive: true });
        writeFileSync('reports/gsc-inspection.json', JSON.stringify(results, null, 2));
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/gsc-inspection.json', JSON.stringify(results, null, 2));
  const cols = ['url', 'verdict', 'coverageState', 'googleCanonical', 'userCanonical', 'canonicalMismatch', 'lastCrawlTime', 'pageFetchState'];
  const csv = [cols.join(','), ...results.map((r) => cols.map((c) => `"${String(r[c] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
  writeFileSync('reports/gsc-inspection.csv', csv);

  const byState = {};
  for (const r of results) {
    const key = r.coverageState || r.verdict;
    (byState[key] ||= []).push(r);
  }
  console.log('\n=== Coverage summary ===');
  for (const [state, rows] of Object.entries(byState).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`${String(rows.length).padStart(5)}  ${state}`);
  }
  const mismatches = results.filter((r) => r.canonicalMismatch);
  if (mismatches.length) {
    console.log(`\n=== Google chose a different canonical (${mismatches.length}) ===`);
    for (const r of mismatches.slice(0, 30)) console.log(`  ${r.url}\n    -> ${r.googleCanonical}`);
  }
  console.log('\nFull report: reports/gsc-inspection.json / .csv');
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'sitemap') {
  await submitSitemap();
} else if (cmd === 'inspect') {
  const limit = Number(arg || 200);
  // Sample evenly across the sitemap so every locale is represented.
  const all = sitemapUrls();
  const step = Math.max(1, Math.floor(all.length / limit));
  const urls = all.filter((_, i) => i % step === 0).slice(0, limit);
  console.log(`Inspecting ${urls.length} sitemap URLs (quota: 2000/day)...`);
  await inspect(urls);
} else if (cmd === 'inspect-file') {
  const urls = readFileSync(arg, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  console.log(`Inspecting ${urls.length} URLs from ${arg}...`);
  await inspect(urls);
} else {
  console.log('Usage: node scripts/gsc-audit.mjs <sitemap | inspect [limit] | inspect-file <path>>');
  process.exit(1);
}
