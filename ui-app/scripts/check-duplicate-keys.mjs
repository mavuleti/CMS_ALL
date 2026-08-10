import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const locale = process.argv[2];
const fix = process.argv.includes('--fix');

if (!locale) {
  console.error('Usage: node scripts/check-duplicate-keys.mjs <locale> [--fix]');
  process.exit(1);
}

const dir = path.join('content', locale);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

function mergeSpaceDupes(obj, stats) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => mergeSpaceDupes(item, stats));
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const spaceKey = `${key} `;
      if (Object.prototype.hasOwnProperty.call(obj, spaceKey)) {
        obj[key] = obj[spaceKey];
        delete obj[spaceKey];
        stats.fixed++;
      }
    }
    for (const value of Object.values(obj)) mergeSpaceDupes(value, stats);
  }
}

let totalFound = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  const raw = readFileSync(filePath, 'utf8');
  const matches = raw.match(/"[a-zA-Z]+ +":/g);
  if (!matches) continue;

  totalFound += matches.length;
  console.log(`${file}: found ${matches.length} trailing-space duplicate key(s)`);

  if (fix) {
    const data = JSON.parse(raw);
    const stats = { fixed: 0 };
    mergeSpaceDupes(data, stats);
    writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`${file}: fixed ${stats.fixed}`);
  }
}

if (totalFound === 0) {
  console.log(`${locale}: no duplicate-key corruption found.`);
} else if (!fix) {
  console.log(`\nRun with --fix to merge these into their correct keys.`);
}
