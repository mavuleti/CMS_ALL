/**
 * Post-deploy check: confirms the live site's shipped JS does NOT point
 * download tracking at the Firebase emulator. This is the test that would
 * have caught NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true leaking into a
 * production build — every download-record call and badge refresh failing
 * silently because the browser tried to reach 127.0.0.1. Run this AFTER a
 * real deploy, not against a local build; it fetches the live site over
 * the network.
 */

const SITE_URL = 'https://dottodotfreeprintables.com/en/cute/cute-puppy-dot-to-dot-puzzle/';
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage() {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    try {
      const response = await fetch(SITE_URL, { headers: { 'User-Agent': 'download-tracking-live-check' } });
      if (!response.ok) throw new Error(`Page responded with HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_COUNT) {
        console.log(`  Attempt ${attempt} failed (${error.message}), retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  throw lastError;
}

async function findChunkUrls(html) {
  const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]);
  const absolute = scriptSrcs.map((src) => new URL(src, SITE_URL).toString());
  return [...new Set(absolute)];
}

async function fetchChunk(url) {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_COUNT) await sleep(RETRY_DELAY_MS);
    }
  }
  throw lastError;
}

async function main() {
  console.log(`Verifying download tracking is NOT pointed at an emulator on ${SITE_URL} ...`);
  const html = await fetchPage();
  const scripts = await findChunkUrls(html);

  let foundEmulatorReference = false;
  const uncheckedChunks = [];
  for (const url of scripts) {
    let body;
    try {
      body = await fetchChunk(url);
    } catch (error) {
      // Can't prove this chunk is clean — treat as inconclusive, not a pass.
      uncheckedChunks.push(`${url} (${error.message})`);
      continue;
    }
    if (body.includes('127.0.0.1:8080') || body.includes('127.0.0.1:9099') || body.includes('127.0.0.1:5001')) {
      foundEmulatorReference = true;
      console.error(`  Emulator host string found in: ${url}`);
    }
  }

  if (foundEmulatorReference) {
    console.error('');
    console.error('FAILED: the deployed bundle references a Firebase emulator host.');
    console.error('This means NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true was set at build time.');
    console.error('Real visitors\' browsers will try to reach 127.0.0.1 and every download');
    console.error('record / badge refresh will silently fail. Check that .env.local has');
    console.error('NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false and that "prod-deploy" (package.json)');
    console.error('still forces it to "false" before `next build`.');
    process.exitCode = 1;
    return;
  }

  if (uncheckedChunks.length) {
    console.error('');
    console.error('FAILED: could not fetch every script chunk, so a clean scan cannot be confirmed:');
    for (const entry of uncheckedChunks) console.error(`  - ${entry}`);
    process.exitCode = 1;
    return;
  }

  console.log(`OK: no emulator host references found across ${scripts.length} shipped chunk(s).`);
}

main().catch((error) => {
  console.error('FAILED: could not verify download tracking on the live site.');
  console.error(error.message);
  process.exitCode = 1;
});
