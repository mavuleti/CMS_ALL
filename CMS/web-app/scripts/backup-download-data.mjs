import { writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Requires GOOGLE_APPLICATION_CREDENTIALS to point at a service account key
// with Firestore read access (or FIRESTORE_EMULATOR_HOST for local testing).
// Anonymous REST reads return 403 in this project even though firestore.rules
// says `allow read: if true` — App Check enforcement blocks unverified callers.
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { getApps, initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
if (!process.env.FIRESTORE_EMULATOR_HOST && !projectId) {
  throw new Error('Set GCLOUD_PROJECT to the target Firebase project id before running this backup.');
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to a service account key with Firestore read access.');
}

if (!getApps().length) {
  initializeApp({
    credential: process.env.FIRESTORE_EMULATOR_HOST ? undefined : applicationDefault(),
    projectId
  });
}

const db = getFirestore();

async function dumpCollection(name) {
  const snapshot = await db.collection(name).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = new URL(`../backups/${timestamp}/`, import.meta.url);
await mkdir(outDir, { recursive: true });

const [puzzles, distributionCounts, statsGlobalSnap] = await Promise.all([
  dumpCollection('puzzles'),
  dumpCollection('puzzleDistributionCounts'),
  db.doc('stats/global').get()
]);
const statsGlobal = statsGlobalSnap.exists ? { id: statsGlobalSnap.id, ...statsGlobalSnap.data() } : null;

await writeFile(new URL('puzzles.json', outDir), JSON.stringify(puzzles, null, 2));
await writeFile(new URL('puzzleDistributionCounts.json', outDir), JSON.stringify(distributionCounts, null, 2));
await writeFile(new URL('stats-global.json', outDir), JSON.stringify(statsGlobal, null, 2));

console.log(`Backed up ${puzzles.length} puzzles, ${distributionCounts.length} puzzleDistributionCounts docs, and stats/global to backups/${timestamp}/`);
