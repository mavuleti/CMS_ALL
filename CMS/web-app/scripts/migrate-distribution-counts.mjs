import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { buildDistributionMigrationPatch } from './lib/distribution-migration.mjs';

const OFFLINE_DISTRIBUTION_SEED = 1000;

// Content is the real source of truth for which puzzles exist — the legacy
// `puzzles` collection only has a doc for puzzles that received at least one
// download under the old tracking system, so puzzles added since then (or
// never downloaded) would otherwise be silently skipped by this migration.
function allContentPuzzleSlugs() {
  const contentDir = new URL('../content/en/', import.meta.url);
  const files = readdirSync(contentDir).filter((name) => name.startsWith('puzzles-') && name.endsWith('.json'));
  const slugs = new Set();
  for (const file of files) {
    const data = JSON.parse(readFileSync(new URL(file, contentDir), 'utf8'));
    for (const puzzle of data.puzzles ?? []) slugs.add(puzzle.slug);
  }
  return slugs;
}

const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { getApps, initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const SOURCE_COLLECTION = 'puzzles';
const TARGET_COLLECTION = 'puzzleDistributionCounts';
const dryRun = process.argv.includes('--dry-run');
const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;

if (!process.env.FIRESTORE_EMULATOR_HOST && !projectId) {
  throw new Error(
    'Set GCLOUD_PROJECT (or GOOGLE_CLOUD_PROJECT) to the target Firebase project id before running this migration. ' +
    'Refusing to rely on ambient Application Default Credentials, which may point at the wrong project.'
  );
}

if (!getApps().length) {
  initializeApp({
    credential: process.env.FIRESTORE_EMULATOR_HOST ? undefined : applicationDefault(),
    projectId
  });
}

const db = getFirestore();
const [sourceSnapshot, targetSnapshot] = await Promise.all([
  db.collection(SOURCE_COLLECTION).get(),
  db.collection(TARGET_COLLECTION).get()
]);
const sourceById = new Map(sourceSnapshot.docs.map((document) => [document.id, document.data()]));
const existing = new Map(targetSnapshot.docs.map((document) => [document.id, document.data()]));
const puzzleIds = new Set([...allContentPuzzleSlugs(), ...sourceById.keys()]);

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

for (const puzzleId of puzzleIds) {
  const source = sourceById.get(puzzleId) ?? {};
  const target = existing.get(puzzleId);
  const patch = buildDistributionMigrationPatch(source, target, OFFLINE_DISTRIBUTION_SEED);

  if (!target) {
    created += 1;
  } else {
    if (Object.keys(patch).length) repaired += 1;
    else unchanged += 1;
  }

  if (!Object.keys(patch).length || dryRun) continue;
  batch.set(db.collection(TARGET_COLLECTION).doc(puzzleId), patch, { merge: true });
  pending += 1;
  if (pending === 400) await flush();
}

await flush();
console.log(`${dryRun ? 'Would migrate' : 'Migrated'} ${puzzleIds.size} puzzles: ${created} create, ${repaired} repair, ${unchanged} unchanged.`);
