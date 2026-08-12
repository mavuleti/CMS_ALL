import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.join(process.cwd(), 'content');
const locales = fs.readdirSync(contentDir).filter((d) =>
  fs.existsSync(path.join(contentDir, d, 'messages.json'))
);

let changed = 0;
for (const locale of locales) {
  const file = path.join(contentDir, locale, 'messages.json');
  const raw = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(raw);

  const cuteLabel = json?.cutePage?.category || 'Cute';

  let fileChanged = false;

  function patchCategories(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (
      Object.prototype.hasOwnProperty.call(obj, 'Garden') &&
      Object.prototype.hasOwnProperty.call(obj, 'USA 250 Years') &&
      !Object.prototype.hasOwnProperty.call(obj, 'Cute')
    ) {
      const entries = Object.entries(obj);
      const gardenIdx = entries.findIndex(([k]) => k === 'Garden');
      entries.splice(gardenIdx + 1, 0, ['Cute', cuteLabel]);
      for (const k of Object.keys(obj)) delete obj[k];
      for (const [k, v] of entries) obj[k] = v;
      fileChanged = true;
    }
    for (const v of Object.values(obj)) {
      if (v && typeof v === 'object') patchCategories(v);
    }
  }

  patchCategories(json);

  if (fileChanged) {
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
    changed++;
    console.log(`Patched ${locale} (Cute -> "${cuteLabel}")`);
  }
}

console.log(`\nDone. ${changed}/${locales.length} locale files patched.`);
