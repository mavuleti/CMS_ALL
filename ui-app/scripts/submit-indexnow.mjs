import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const SITE = 'https://dottodotfreeprintables.com';
const HOST = 'dottodotfreeprintables.com';

const keyFile = readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.warn('[indexnow] No IndexNow key file found in public/ — skipping submission.');
  process.exit(0);
}
const key = keyFile.replace('.txt', '');
const keyLocation = `${SITE}/${keyFile}`;

const sitemapPath = path.join('public', 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.warn('[indexnow] public/sitemap.xml not found — skipping submission.');
  process.exit(0);
}

const xml = readFileSync(sitemapPath, 'utf8');
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.warn('[indexnow] No URLs found in sitemap — skipping submission.');
  process.exit(0);
}

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList })
  });

  if (res.ok) {
    console.log(`[indexnow] Submitted ${urlList.length} URLs (status ${res.status}).`);
  } else {
    console.warn(`[indexnow] Submission returned status ${res.status} — not failing the build.`);
  }
} catch (err) {
  console.warn('[indexnow] Submission failed (network unavailable?) — not failing the build.', err.message);
}
