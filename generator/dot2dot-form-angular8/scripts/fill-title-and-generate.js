// Playwright script: opens the CMS form, types "Example" into the
// Title tag field (header.title), clicks "Generate JSON", and reports
// what happened (output JSON produced, or validation errors shown —
// expected here since only one field is filled).
//
// Usage:
//   npm install --save-dev playwright
//   npx playwright install chromium
//   node scripts/fill-title-and-generate.js [url]
//
// Defaults to http://localhost:4300 — the app must already be running
// there (e.g. `ng build` then `npx http-server dist/dot-to-dot-cms -p 4300`).

const { chromium } = require('playwright');

const url = process.argv[2] || 'http://localhost:4300';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);

  // header.title is the only field on the page with id="header-title"
  // (other title fields share the same data-testid but different ids).
  const titleField = page.locator('#header-title');
  await titleField.fill('Example');

  await page.locator('[data-testid="generate-btn"]').click();

  const outputCard = page.locator('[data-testid="output-card"]');
  const formStatus = page.locator('[data-testid="form-status"]');

  if (await outputCard.isVisible().catch(() => false)) {
    const json = await page.locator('[data-testid="output-json"]').textContent();
    console.log('Generate succeeded. Output JSON:\n' + json);
  } else if (await formStatus.isVisible().catch(() => false)) {
    console.log('Generate blocked by validation (expected — only the title field was filled).');
    console.log('Title field value:', await titleField.inputValue());
  } else {
    console.log('Unexpected state — neither output nor validation message appeared.');
  }

  await page.screenshot({ path: 'scripts/fill-title-and-generate.png', fullPage: true });

  await browser.close();
})();
