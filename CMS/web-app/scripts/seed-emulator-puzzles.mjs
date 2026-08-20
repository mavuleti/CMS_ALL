import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!getApps().length) initializeApp({ projectId: 'demo-project' });
const db = getFirestore();
const seeds = [
  ['trex-61-dot-to-dot-puzzle', 1247],
  ['brontosaurus-dot-to-dot-puzzle', 1088],
  ['mermaid-dot-to-dot-puzzle', 1031]
];

for (const [puzzleId, totalClickCount] of seeds) {
  await db.doc(`puzzles/${puzzleId}`).set({ totalClickCount }, { merge: true });
}

console.log(`Seeded ${seeds.length} legacy emulator puzzle documents. Run npm run migrate:distribution-counts to create the new collection.`);
