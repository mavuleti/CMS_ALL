import fs from 'node:fs';

const rules = fs.readFileSync('firestore.rules', 'utf8');
const firebase = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
const tracker = fs.readFileSync('components/DownloadTracker.tsx', 'utf8');
const badge = fs.readFileSync('components/DownloadBadge.tsx', 'utf8');

const requiredRules = [
  'match /puzzles/{puzzleId}',
  'match /puzzleDistributionCounts/{puzzleId}',
  'match /users/{uid}',
  'match /users/{uid}/downloads/{puzzleId}',
  'match /stats/{doc}',
  'allow write: if false'
];
for (const entry of requiredRules) {
  if (!rules.includes(entry)) throw new Error(`Firestore contract missing: ${entry}`);
}
for (const deniedPath of ['puzzles/{puzzleId}', 'puzzleDistributionCounts/{puzzleId}', 'users/{uid}', 'users/{uid}/downloads/{puzzleId}', 'stats/{doc}']) {
  const block = rules.slice(rules.indexOf(`match /${deniedPath}`));
  if (!block.includes('allow write: if false')) throw new Error(`Direct writes are not denied for ${deniedPath}`);
}

const csp = firebase.hosting?.headers?.flatMap((header) => header.headers ?? [])
  .find((header) => header.key === 'Content-Security-Policy')?.value ?? '';
for (const origin of ['firestore.googleapis.com', 'identitytoolkit.googleapis.com', 'firebaseappcheck.googleapis.com', '*.cloudfunctions.net']) {
  if (!csp.includes(origin)) throw new Error(`CSP missing Firebase origin: ${origin}`);
}
if (tracker.includes('preventDefault')) throw new Error('Download tracking must never cancel the PDF link');
if (!tracker.includes('recordPuzzleDownload')) throw new Error('Download tracker is not wired');
if (!badge.includes('PUZZLE_BADGE_MIN_COUNT')) throw new Error('Download badge threshold is not centralized');

console.log('Download tracking contract is valid.');
