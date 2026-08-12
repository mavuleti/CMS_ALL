import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const rows = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  try {
    const r = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
    const c = r.categories;
    rows.push({
      page: file.replace(/\.json$/, '').replace(/_/g, '/'),
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
    });
  } catch (e) {
    rows.push({ page: file, error: String(e.message) });
  }
}
rows.sort((a, b) => a.page.localeCompare(b.page));
console.log('page,performance,accessibility,best-practices,seo');
for (const r of rows) {
  if (r.error) console.log(`${r.page},ERROR,${r.error}`);
  else console.log(`${r.page},${r.performance},${r.accessibility},${r.bestPractices},${r.seo}`);
}
