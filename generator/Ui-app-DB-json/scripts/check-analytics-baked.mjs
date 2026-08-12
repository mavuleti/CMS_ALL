/**
 * Pre-deploy gate for `prod-deploy` / `prod-deploy-light`: fails BEFORE
 * `firebase deploy` runs if the just-built static export does not actually
 * contain the GA snippet. Analytics is compiled in/out at `next build` time
 * based on NEXT_PUBLIC_ENABLE_ANALYTICS — whatever value was present at build
 * time is permanently baked into the HTML, so checking the live site after
 * deploy (verify-ga-live.mjs) catches this only after the broken build is
 * already public. This checks the build artifact itself, so it fails
 * regardless of *how* the build was invoked (composite npm script, or a
 * manually split-out `next build` that forgot to set the env var).
 */

import fs from 'node:fs';

const GA_ID = 'G-RCRTCLP0CF';
const HOMEPAGE_PATH = 'out/en/index.html';

if (!fs.existsSync(HOMEPAGE_PATH)) {
  console.error(`FAILED: ${HOMEPAGE_PATH} does not exist — run \`npm run build\` first.`);
  process.exitCode = 1;
} else {
  const html = fs.readFileSync(HOMEPAGE_PATH, 'utf8');
  const hasGaLoader = html.includes('googletagmanager.com/gtag/js');
  const hasGaId = html.includes(GA_ID);

  if (!hasGaLoader || !hasGaId) {
    console.error('FAILED: GA snippet missing from the build output that is about to be deployed.');
    console.error(`  ${HOMEPAGE_PATH}`);
    console.error(`  googletagmanager.com/gtag/js present: ${hasGaLoader}`);
    console.error(`  ${GA_ID} present: ${hasGaId}`);
    console.error('');
    console.error('This build was not run with NEXT_PUBLIC_ENABLE_ANALYTICS=true before `next build`.');
    console.error('If you split prod-deploy/prod-deploy-light into manual steps (e.g. to skip tests),');
    console.error('make sure `next build` is still invoked with:');
    console.error('  NEXT_PUBLIC_ENABLE_ANALYTICS=true NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false');
    console.error('Re-run the build with those vars set, then retry the deploy.');
    process.exitCode = 1;
  } else {
    console.log('OK: build output about to be deployed includes the GA snippet.');
  }
}
