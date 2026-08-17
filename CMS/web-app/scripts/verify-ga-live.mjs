/**
 * Post-deploy check: confirms the live homepage actually shipped the GA
 * snippet. This is the test that would have caught the original bug — GA
 * being silently compiled out of every build because NEXT_PUBLIC_ENABLE_ANALYTICS
 * was never true at build time. Run this AFTER a real deploy, not against
 * a local build; it fetches the live site over the network.
 */

const SITE_URL = 'https://dottodotfreeprintables.com/';
const GA_ID = 'G-RCRTCLP0CF';
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHomepage() {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt += 1) {
    try {
      const response = await fetch(SITE_URL, { headers: { 'User-Agent': 'ga-live-check' } });
      if (!response.ok) {
        throw new Error(`Homepage responded with HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_COUNT) {
        console.log(`  Attempt ${attempt} failed (${error.message}), retrying in ${RETRY_DELAY_MS / 1000}s (Firebase Hosting can take a moment to propagate)...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  throw lastError;
}

async function main() {
  console.log(`Verifying GA is live on ${SITE_URL} ...`);
  const html = await fetchHomepage();

  const hasGaLoader = html.includes('googletagmanager.com/gtag/js');
  const hasGaId = html.includes(GA_ID);
  const hasAnalyticsGate = html.includes('navigator.webdriver');

  if (!hasGaLoader || !hasGaId) {
    console.error('FAILED: GA snippet is missing from the live homepage.');
    console.error(`  googletagmanager.com/gtag/js present: ${hasGaLoader}`);
    console.error(`  ${GA_ID} present: ${hasGaId}`);
    console.error('');
    console.error('This almost always means the build that shipped was NOT built with');
    console.error('NEXT_PUBLIC_ENABLE_ANALYTICS=true. Check that "npm run prod-deploy"');
    console.error('(package.json) still sets that flag before `next build`, and that');
    console.error('deploy.sh/deploy.ps1 call prod-deploy rather than building separately.');
    process.exitCode = 1;
    return;
  }

  if (!hasAnalyticsGate) {
    console.error('WARNING: GA snippet is present but the automated-browser guard');
    console.error('(navigator.webdriver check) was not found — verify layout.tsx was not');
    console.error('changed in a way that would also send hits from test runners.');
  }

  console.log('OK: live homepage includes the GA loader and measurement ID.');
}

main().catch((error) => {
  console.error('FAILED: could not verify GA on the live homepage.');
  console.error(error.message);
  process.exitCode = 1;
});
