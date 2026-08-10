import fs from 'node:fs';
import path from 'node:path';

const subDir = path.resolve('temp/sub');
const contentDir = path.resolve('content/fr');

const partFiles = fs.readdirSync(subDir)
  .filter((f) => /^fr-missing-part-\d+-translated\.txt$/.test(f));

function setByPath(obj, keyPath, value) {
  const parts = keyPath.split('.').map((p) => (/^\d+$/.test(p) ? Number(p) : p));
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
    if (cur === undefined) throw new Error(`Path not found: ${keyPath}`);
  }
  cur[parts[parts.length - 1]] = value;
}

const byFile = new Map(); // json filename -> entries[]
let currentFile = null;
let total = 0;
const errors = [];

for (const pf of partFiles.sort((a, b) => {
  const na = Number(a.match(/part-(\d+)/)[1]);
  const nb = Number(b.match(/part-(\d+)/)[1]);
  return na - nb;
})) {
  const text = fs.readFileSync(path.join(subDir, pf), 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const headerMatch = line.match(/^###\s+(\S+\.json)\s*$/);
    if (headerMatch) {
      currentFile = headerMatch[1];
      continue;
    }
    const m = line.match(/^([\w.-]+\.json)::([^:]+):\s(.*)$/);
    if (m) {
      const [, jsonFile, keyPath, value] = m;
      if (!byFile.has(jsonFile)) byFile.set(jsonFile, []);
      byFile.get(jsonFile).push({ keyPath, value });
      total++;
    }
  }
}

console.log(`Parsed ${total} translated entries from ${partFiles.length} files.`);

for (const [jsonFile, entries] of byFile) {
  const filePath = path.join(contentDir, jsonFile);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const { keyPath, value } of entries) {
    try {
      setByPath(data, keyPath, value);
    } catch (e) {
      errors.push(`${jsonFile}::${keyPath}: ${e.message}`);
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${jsonFile}: ${entries.length} field(s).`);
}

if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  errors.forEach((e) => console.log('  ' + e));
}
