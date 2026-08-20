import { randomInt } from 'node:crypto';
import { createRequire } from 'node:module';
import { buildDistributionMigrationPatch } from './lib/distribution-migration.mjs';

const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { getApps, initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const SOURCE_COLLECTION = 'puzzles';
const TARGET_COLLECTION = 'puzzleDistributionCounts';
const dryRun = process.argv.includes('--dry-run');

if (!getApps().length) {
  initializeApp({
    credential: process.env.FIRESTORE_EMULATOR_HOST ? undefined : applicationDefault(),
    projectId: process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT
  });
}

const db = getFirestore();
const [sourceSnapshot, targetSnapshot] = await Promise.all([
  db.collection(SOURCE_COLLECTION).get(),
  db.collection(TARGET_COLLECTION).get()
]);
const existing = new Map(targetSnapshot.docs.map((document) => [document.id, document.data()]));
let created = 0;
let repaired = 0;
let unchanged = 0;
let batch = db.batch();
let pending = 0;

async function flush() {
  if (!pending || dryRun) return;
  await batch.commit();
  batch = db.batch();
  pending = 0;
}

for (const sourceDocument of sourceSnapshot.docs) {
  const source = sourceDocument.data();
  const target = existing.get(sourceDocument.id);
  const patch = buildDistributionMigrationPatch(source, target, randomInt(0, 1000));

  if (!target) {
    created += 1;
  } else {
    if (Object.keys(patch).length) repaired += 1;
    else unchanged += 1;
  }

  if (!Object.keys(patch).length || dryRun) continue;
  batch.set(db.collection(TARGET_COLLECTION).doc(sourceDocument.id), patch, { merge: true });
  pending += 1;
  if (pending === 400) await flush();
}

await flush();
console.log(`${dryRun ? 'Would migrate' : 'Migrated'} ${sourceSnapshot.size} puzzles: ${created} create, ${repaired} repair, ${unchanged} unchanged.`);
