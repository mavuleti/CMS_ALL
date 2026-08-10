/**
 * Preflight check for `npm run prod-deploy`: fails the deploy before any
 * build runs if the Firebase env vars are set up in a way that would
 * silently break production. This is what would have caught
 * NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true leaking into a static-export
 * build and pointing every real visitor's browser at a localhost
 * emulator (download tracking stayed broken until this was noticed
 * from a live console error), plus a missing App Check key (recordDownload
 * has enforceAppCheck: true, so without it every call is rejected
 * server-side even though tracking looks wired up client-side).
 *
 * Checks process.env first — the same precedence Next.js itself uses, and
 * what a CI deploy supplying these as real environment variables (instead
 * of a checked-in .env.local) would rely on — falling back to .env.local
 * only for local convenience.
 */

import fs from 'node:fs';

const localEnv = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';

function readVar(name) {
  if (process.env[name] !== undefined) return process.env[name].trim();
  const matches = [...localEnv.matchAll(new RegExp(`^${name}=(.*)$`, 'gm'))];
  return matches.length ? matches[matches.length - 1][1].trim() : undefined;
}

const errors = [];

const emulatorFlag = readVar('NEXT_PUBLIC_USE_FIREBASE_EMULATOR');
if (emulatorFlag === 'true') {
  errors.push(
    'NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true.\n' +
    '  This is a static export: whatever value is present at `next build` time is\n' +
    '  permanently baked into the deployed HTML/JS. prod-deploy overrides this to\n' +
    '  "false" itself, but a "true" value here means any build NOT run through\n' +
    '  prod-deploy (plain `next build`, an ad-hoc `firebase deploy`, or a CI job\n' +
    '  with this set) will ship a bundle that points real visitors\' browsers at\n' +
    '  127.0.0.1. Set it to "false"; only override to "true" transiently for the\n' +
    '  *:emulator test scripts.'
  );
}

const projectId = readVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
const apiKey = readVar('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!projectId || !apiKey) {
  errors.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_API_KEY is not set (checked process.env and .env.local).');
}

const appCheckKey = readVar('NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY');
if (!appCheckKey) {
  errors.push(
    'NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY is not set (checked process.env and .env.local).\n' +
    '  Without it, the client never calls initializeAppCheck(), and recordDownload\n' +
    '  (enforceAppCheck: true) will reject every call server-side — download counts\n' +
    '  will not increment even though tracking looks wired up client-side.\n' +
    '  Register a reCAPTCHA v3 site in Firebase Console > App Check and set this var.'
  );
}

if (errors.length) {
  console.error('FAILED: Firebase production env check found blocking issues:\n');
  for (const message of errors) console.error(`- ${message}\n`);
  process.exitCode = 1;
} else {
  console.log('OK: Firebase production env checks passed.');
}
