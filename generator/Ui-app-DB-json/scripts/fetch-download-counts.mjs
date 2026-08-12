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
  const [puzzles, global, top] = await Promise.all([
    fetchCollection('puzzles'),
    fetchDocument('stats/global'),
    fetchDocument('stats/top_puzzles')
  ]);
  const counts = {
    global: {
      totalUniqueDevices: numberField(global, 'totalUniqueDevices'),
      totalUniqueDownloads: numberField(global, 'totalUniqueDownloads')
    },
    top: top.fields?.top?.arrayValue?.values?.map((entry) => ({
      puzzleId: entry.mapValue?.fields?.puzzleId?.stringValue ?? '',
      totalClickCount: Number(entry.mapValue?.fields?.totalClickCount?.integerValue ?? 0)
    })) ?? [],
    puzzles: Object.fromEntries((puzzles.documents ?? []).map((document) => [
      document.name.split('/').pop(), numberField(document, 'totalClickCount')
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
