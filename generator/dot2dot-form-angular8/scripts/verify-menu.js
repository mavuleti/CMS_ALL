// Verifies the CMS sidebar menu: tree renders, search filters, category
// expand/collapse, and clicking a puzzle loads it into the form via the
// existing import pipeline.
//
// Usage: node scripts/verify-menu.js [url]

const { chromium } = require('playwright');
const assert = require('node:assert');

const url = process.argv[2] || 'http://localhost:4300';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') { errors.push(msg.text()); } });

  page.on('request', r => { if (r.url().includes('puzzles-')) { console.log('REQ', r.method(), r.url()); } });
  page.on('response', r => { if (r.url().includes('puzzles-')) { console.log('RES', r.status(), r.url()); } });

  await page.goto(url);

  // Tree renders with categories collapsed initially
  await page.waitForSelector('[data-testid="menu-tree"]');
  const localeOptions = await page.locator('[data-testid="menu-lang-select"] option').count();
  assert.equal(localeOptions, 33, 'language selector should include every copied content language');
  const cuteCategoryBtn = page.locator('[data-testid="menu-category-cute"]');
  console.log('cute category visible:', await cuteCategoryBtn.isVisible());
  assert.equal(await cuteCategoryBtn.isVisible(), true);
  console.log('cute category aria-expanded (collapsed):', await cuteCategoryBtn.getAttribute('aria-expanded'));

  // Expand it, puzzle should appear
  await cuteCategoryBtn.click();
  console.log('cute category aria-expanded (after click):', await cuteCategoryBtn.getAttribute('aria-expanded'));
  const puppyBtn = page.locator('[data-testid="menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle"]');
  console.log('puppy item visible after expand:', await puppyBtn.isVisible());

  // Search filtering
  await page.locator('[data-testid="menu-search"]').fill('puppy');
  await page.waitForTimeout(150);
  console.log('search status:', await page.locator('[data-testid="menu-search-status"]').textContent());
  const dinosaursCategoryDuringSearch = page.locator('[data-testid="menu-category-dinosaurs"]');
  console.log('dinosaurs category hidden while searching "puppy":', !(await dinosaursCategoryDuringSearch.isVisible().catch(() => false)));
  assert.equal(await dinosaursCategoryDuringSearch.isVisible().catch(() => false), false);

  // Clear search, click the puzzle to load it
  await page.locator('[data-testid="menu-search"]').fill('');
  await page.waitForTimeout(150);
  await page.locator('[data-testid="menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle"]').click();

  const titleField = page.locator('#header-title');
  await page.waitForFunction(() => {
    const el = document.getElementById('header-title');
    return el && el.value.length > 0;
  }).catch(() => {});
  console.log('header-title after click-to-load:', await titleField.inputValue());
  console.log('loadError:', await page.locator('[data-testid="menu-error"]').textContent().catch(() => '(none)'));

  const activePuzzleBtn = page.locator('[data-testid="menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle"]');
  console.log('active class present:', (await activePuzzleBtn.getAttribute('class') || '').includes('active'));
  console.log('aria-selected:', await activePuzzleBtn.getAttribute('aria-selected'));
  assert.equal(await activePuzzleBtn.getAttribute('aria-selected'), 'true');

  // Switch language to Arabic, load the same puzzle again (still English label)
  await page.selectOption('[data-testid="menu-lang-select"]', 'ar');
  console.log('label still English after lang switch:', await activePuzzleBtn.textContent());
  const beforeAr = await titleField.inputValue();
  await activePuzzleBtn.click();
  await page.waitForFunction((prev) => {
    const el = document.getElementById('header-title');
    return el && el.value !== prev;
  }, beforeAr).catch(() => {});
  console.log('header-title after AR click-to-load:', await titleField.inputValue());

  // Arabic has no production space file. Keep the English tree stable and
  // expose availability instead of issuing a doomed request.
  await page.locator('[data-testid="menu-category-space"]').click();
  const unavailableSpacePuzzle = page.locator('[data-testid^="menu-puzzle-space-"]').first();
  assert.equal(await unavailableSpacePuzzle.getAttribute('aria-disabled'), 'true');

  console.log('console/page errors:', errors);
  assert.deepEqual(errors, []);

  await page.screenshot({ path: 'scripts/menu-verify.png', fullPage: true });
  await browser.close();
})();
