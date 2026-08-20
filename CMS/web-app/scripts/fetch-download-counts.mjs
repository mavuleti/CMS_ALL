import { readFile, writeFile } from 'node:fs/promises';
import fs from 'node:fs';

const outputPath = new URL('../lib/download-counts.json', import.meta.url);

// This runs as a plain `node` prebuild script, not through `next build`, so
// it doesn't get Next.js's automatic .env.local loading. Without this, the
// fetch below silently no-ops on every local/CI build that doesn't export
// the var directly, and the SSR-baked download count never updates.
const localEnv = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
function readVar(name) {
  if (process.env[name] !== undefined) return process.env[name].trim();
  const matches = [...localEnv.matchAll(new RegExp(`^${name}=(.*)$`, 'gm'))];
  return matches.length ? matches[matches.length - 1][1].trim() : undefined;
}

const projectId = readVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
const base = projectId
  ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`
  : null;

async function fetchDocument(path) {
  const response = await fetch(`${base}/${path}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchCollection(path) {
  const documents = [];
  let pageToken = '';
  do {
    const suffix = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
    const response = await fetch(`${base}/${path}${suffix}`);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const page = await response.json();
    documents.push(...(page.documents ?? []));
    pageToken = page.nextPageToken ?? '';
  } while (pageToken);
  return { documents };
}

function numberField(document, name) {
  const value = document?.fields?.[name];
  return Number(value?.integerValue ?? value?.doubleValue ?? 0);
}

try {
  if (!base) throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured');
  const [puzzles, global] = await Promise.all([
    fetchCollection('puzzleDistributionCounts'),
    fetchDocument('stats/global')
  ]);
  const puzzleCounts = (puzzles.documents ?? []).map((document) => ({
    puzzleId: document.name.split('/').pop(),
    offlineDistributionCount: numberField(document, 'offlineDistributionCount'),
    onlineDistributionCount: numberField(document, 'onlineDistributionCount')
  }));
  const counts = {
    global: {
      totalUniqueDevices: numberField(global, 'totalUniqueDevices'),
      totalUniqueDownloads: numberField(global, 'totalUniqueDownloads')
    },
    // Popularity is intentionally based only on current online activity.
    top: [...puzzleCounts]
      .sort((left, right) => right.onlineDistributionCount - left.onlineDistributionCount)
      .slice(0, 10),
    puzzles: Object.fromEntries(puzzleCounts.map(({ puzzleId, ...distribution }) => [
      puzzleId, distribution
    ]))
  };
  await writeFile(outputPath, `${JSON.stringify(counts, null, 2)}\n`);
  console.log(`Wrote download counts for ${Object.keys(counts.puzzles).length} puzzles.`);
} catch (error) {
  console.warn(`Download counts unavailable; keeping last-known-good file. ${error.message}`);
  try {
    await readFile(outputPath);
  } catch {
    await writeFile(outputPath, '{}\n');
  }
}
