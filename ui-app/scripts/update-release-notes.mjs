import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const notesPath = resolve('RELEASE_NOTES.md');
const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const dryRun = process.argv.includes('--dry-run');

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function incrementPatch(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Cannot increment invalid release version: ${version}`);
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function newerVersion(first, second) {
  const parts = (version) => version.split('.').map(Number);
  const [a, b] = [parts(first), parts(second)];
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? first : second;
  }
  return first;
}

function bulletSummary(range) {
  const subjects = git('log', '--reverse', '--format=%s', range)
    .split('\n')
    .map((subject) => subject.trim())
    .filter(Boolean);

  if (subjects.length === 0) {
    return ['- Production redeploy with no new committed changes.'];
  }

  return subjects.map((subject) => `- ${subject.replace(/[.!?]?$/, '.')}`);
}

function significantNotes(range) {
  const commits = git('log', '--format=%s%n%b', range).toLowerCase();
  const notes = [];
  if (/\b(fix|bug|repair|regression|security)\b/.test(commits)) notes.push('Includes significant fixes or hardening.');
  if (/\b(add|feature|launch|introduc|support)\b/.test(commits)) notes.push('Includes new features or expanded functionality.');
  return notes.length ? notes.join(' ') : 'Routine production release.';
}

const head = git('rev-parse', 'HEAD');
const existing = existsSync(notesPath) ? readFileSync(notesPath, 'utf8') : '';
const latest = existing.match(/^## v(\d+\.\d+\.\d+) - \d{4}-\d{2}-\d{2}\n\n- Commit(?: range)?: `([^`]+)`/m);

const version = latest
  ? newerVersion(incrementPatch(latest[1]), packageJson.version)
  : packageJson.version;
const previousHead = latest?.[2].split('..').at(-1);
const commitRef = previousHead ? `${previousHead}..${head}` : head;
const summary = previousHead ? bulletSummary(commitRef) : [];
const notes = previousHead ? significantNotes(commitRef) : 'Initial automated release record.';
const entry = [
  `## v${version} - ${today}`,
  '',
  `- Commit${previousHead ? ' range' : ''}: \`${commitRef}\``,
  ...(previousHead ? ['', '### Changes', '', ...summary] : []),
  '',
  '### Notes',
  '',
  notes,
].join('\n');

const header = '# Release Notes\n\nAutomated production deployment history. The latest release appears first.\n';
const previousEntries = existing.replace(/^# Release Notes\r?\n\r?\nAutomated production deployment history\. The latest release appears first\.\r?\n*/m, '').trim();
const updatedNotes = `${header}\n${entry}${previousEntries ? `\n\n${previousEntries}` : ''}\n`;
if (dryRun) {
  console.log(entry);
  console.log('Dry run: RELEASE_NOTES.md was not changed.');
  process.exit(0);
}

writeFileSync(notesPath, updatedNotes);

console.log(`Recorded production release v${version} (${commitRef}) in RELEASE_NOTES.md.`);
