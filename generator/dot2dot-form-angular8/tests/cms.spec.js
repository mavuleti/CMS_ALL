const { test, expect } = require('@playwright/test');

async function clearDrafts(page) {
  await page.goto('/');
  await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('dot-to-dot-cms', 2);
    request.onsuccess = () => {
      const database = request.result;
      const stores = ['versions', 'audit-log'].filter(name => database.objectStoreNames.contains(name));
      const transaction = database.transaction(stores, 'readwrite');
      transaction.objectStore('versions').clear();
      if (stores.includes('audit-log')) transaction.objectStore('audit-log').clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    request.onerror = () => reject(request.error);
  }));
  await page.reload();
}

async function loadPuppy(page) {
  await page.getByTestId('menu-category-cute').click();
  await page.getByTestId('menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle').click();
  await expect(page.locator('#slug')).toHaveValue('cute-puppy-dot-to-dot-puzzle');
}

test.beforeEach(async ({ page }) => {
  await clearDrafts(page);
});

test('derives read-only hex values from the Crayola color dropdown', async ({ page }) => {
  await loadPuppy(page);
  const firstMapping = page.getByTestId('mapping-0-0');
  const color = firstMapping.getByTestId('field-color');
  const hex = firstMapping.getByTestId('field-hex');

  await expect(color).toHaveValue('Raw Sienna');
  await expect(hex).toHaveValue('#D68A59');
  await expect(hex).toBeDisabled();
  const importedBlack = page.getByTestId('mapping-1-0');
  await expect(importedBlack.getByTestId('field-color')).toHaveValue('Crayola Black');
  await expect(importedBlack.getByTestId('field-hex')).toHaveValue('#232323');
  await expect(importedBlack.locator('.custom-hex')).toHaveCount(0);
  await color.selectOption('Blue');
  await expect(hex).toHaveValue('#1F75FE');
});

test('tree search and language-aware loading remain functional', async ({ page }) => {
  await expect(page.getByTestId('menu-tree')).toBeVisible();
  await page.getByTestId('menu-search').fill('puppy');
  await expect(page.getByTestId('menu-search-status')).toHaveText('1 match');
  await page.getByTestId('menu-search').fill('');
  await loadPuppy(page);
  await expect(page.locator('#header-title')).toContainText('');
  await expect(page.locator('#header-title')).toHaveValue(/Cute Puppy/);
  await page.getByTestId('menu-lang-select').selectOption('ar');
  await page.getByTestId('menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle').click();
  await expect(page.locator('#header-title')).not.toHaveValue(/Cute Puppy/);
});

test('renders every puzzle and collection FAQ and blocks invalid FAQ text', async ({ page }) => {
  await loadPuppy(page);
  await expect(page.getByTestId('puzzle-faqs').locator('.repeat-block')).toHaveCount(6);
  const firstPuzzleFaq = page.getByTestId('puzzle-faq-0');
  await firstPuzzleFaq.getByTestId('faq-question').fill('No');
  await page.getByTestId('validate-btn').click();
  await expect(firstPuzzleFaq.locator('.error')).toContainText('at least 5 characters');
  await expect(page.getByTestId('version-empty')).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.getByTestId('menu-collection-edit-flowers').click();
  await expect(page.getByTestId('collection-faqs').locator('.repeat-block')).toHaveCount(20);
  const firstCollectionFaq = page.getByTestId('collection-faq-0');
  await firstCollectionFaq.getByTestId('faq-answer').fill('Too short');
  await page.getByTestId('validate-btn').click();
  await expect(firstCollectionFaq.locator('.error')).toContainText('at least 20 characters');
});

test('validation reports details and creates validated/submitted workflow versions', async ({ page }) => {
  await page.getByTestId('validate-btn').click();
  await expect(page.getByTestId('validation-summary')).toBeVisible();
  await loadPuppy(page);
  await page.locator('#ld-image').fill('/images/cute/cute-puppy.webp');
  await page.locator('#ld-age').fill('5-9');
  await page.getByTestId('validate-btn').click();
  await expect(page.locator('.version-status').first()).toHaveText('Validated');
  await page.getByTestId('generate-btn').click();
  await expect(page.locator('.version-status').first()).toHaveText('Submitted');
  const json = JSON.parse(await page.getByTestId('output-json').textContent());
  expect(json._cms.status).toBe('submitted');
  const savedPuzzle = json.puzzles.find(puzzle => puzzle.slug === 'cute-puppy-dot-to-dot-puzzle');
  expect(savedPuzzle.body.faqs.length).toBeGreaterThan(0);
  expect(savedPuzzle.body.faqs[0].q).toBeTruthy();
  expect(savedPuzzle.body.faqs[0].a).toBeTruthy();
});

test('keeps live validation active after generation', async ({ page }) => {
  await loadPuppy(page);
  await page.locator('#ld-image').fill('/images/cute/cute-puppy.webp');
  await page.getByTestId('generate-btn').click();
  await expect(page.getByTestId('output-card')).toBeVisible();
  await page.locator('#header-title').fill('');
  await page.locator('#body-h1').focus();
  await expect(page.getByTestId('sidebar-validation')).toContainText('header.title');
  await expect(page.getByTestId('form-status')).toContainText('invalid');
});

test('range consistency errors navigate to the offending section', async ({ page }) => {
  await loadPuppy(page);
  const offendingRange = page.getByTestId('section-1').getByTestId('field-range');
  await offendingRange.fill('10–30');
  await page.getByTestId('validate-btn').click();
  const issue = page.getByTestId('sidebar-validation').getByRole('button', { name: /sections\[1\]\.range/ });
  await expect(issue).toContainText('overlaps');
  await issue.click();
  await expect(offendingRange).toBeFocused();
});

test('keeps five versions per puzzle and restores latest', async ({ page }) => {
  await loadPuppy(page);
  let latestVersionId = '';
  for (let index = 1; index <= 6; index++) {
    await page.locator('#body-tagline').fill(`Draft version ${index}`);
    await page.getByTestId('save-draft-btn').click();
    const firstVersion = page.locator('.version-button').first();
    await expect(firstVersion).toBeVisible();
    if (latestVersionId) {
      await expect(firstVersion).not.toHaveAttribute('data-testid', latestVersionId);
    }
    latestVersionId = await firstVersion.getAttribute('data-testid');
  }
  await expect(page.locator('.version-list li')).toHaveCount(5);
  await page.reload();
  await expect(page.locator('#body-tagline')).toHaveValue('Draft version 6');
  await expect(page.getByTestId('version-message')).toContainText('Latest saved version restored');
});

test('protects unsaved edits before loading another puzzle', async ({ page }) => {
  await loadPuppy(page);
  await page.locator('#body-tagline').fill('Unsaved editorial change');
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Discard unsaved changes');
    await dialog.dismiss();
  });
  await page.getByTestId('menu-puzzle-cute-cute-little-car-dot-to-dot-puzzle').click();
  await expect(page.locator('#body-tagline')).toHaveValue('Unsaved editorial change');
});

test('supports pinning, comparing, renaming, deleting and translation reporting', async ({ page }) => {
  await loadPuppy(page);
  await page.getByTestId('save-draft-btn').click();
  await page.locator('#body-tagline').fill('Changed for comparison');
  await page.getByTestId('save-draft-btn').click();
  await expect(page.locator('.version-list li')).toHaveCount(2);
  await page.locator('.version-tools').first().getByText('Compare').click();
  await expect(page.getByTestId('version-diff')).toContainText('body.tagline');
  await page.locator('.version-tools').first().getByText('Pin', { exact: true }).click();
  await expect(page.locator('.version-button').first()).toHaveClass(/pinned/);
  page.once('dialog', dialog => dialog.accept('Editorial checkpoint'));
  await page.locator('.version-tools').first().getByText('Rename').click();
  await expect(page.locator('.version-name').first()).toContainText('Editorial checkpoint');
  await page.getByTestId('translation-dashboard').click();
  await expect(page.getByTestId('translation-dashboard')).toContainText('English');
  await expect(page.getByTestId('translation-dashboard')).toContainText('85/85');
});

test('exports and imports portable version history', async ({ page }) => {
  await loadPuppy(page);
  await page.getByTestId('save-draft-btn').click();
  await expect(page.locator('.version-list li')).toHaveCount(1);
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-history').click();
  const download = await downloadPromise;
  const historyPath = await download.path();
  page.once('dialog', dialog => dialog.accept());
  await page.getByTestId('clear-history').click();
  await expect(page.getByTestId('version-empty')).toBeVisible();
  await page.getByTestId('import-history').setInputFiles(historyPath);
  await expect(page.locator('.version-list li')).toHaveCount(1);
  await expect(page.getByTestId('version-message')).toContainText('versions imported');
});

test('edits, validates, and saves the Flowers collection document without losing sibling puzzles', async ({ page }) => {
  await expect(page.getByTestId('menu-collection-edit-flowers')).toBeVisible();
  await page.getByTestId('menu-collection-edit-flowers').click();
  await expect(page.getByTestId('collection-form')).toBeVisible();
  await expect(page.locator('#slug')).toBeHidden();
  await expect(page.locator('#header-title')).toBeHidden();
  await expect(page.getByTestId('collection-title')).toHaveValue('Flower Dot to Dot Printables for Kids — Free PDF Worksheets');

  await page.getByTestId('collection-title').fill('');
  await page.getByTestId('validate-btn').click();
  await expect(page.getByTestId('collection-form').locator('.error').filter({ hasText: 'required' }).first()).toBeVisible();
  await expect(page.getByTestId('version-empty')).toBeVisible();
  await page.getByTestId('collection-title').fill('Free Flower Dot to Dot Puzzles to Print');

  await page.getByTestId('collection-meta-description').fill('Browse free flower dot to dot puzzles for kids, with printable blooms ranging from approachable outlines to detailed petal challenges.');
  const conciseDescription = 'Explore free flower dot-to-dot printables featuring petals, patterns, and numbered paths that build calm pencil practice, counting confidence, and creativity.';
  await page.locator('#collection-ld-description').fill(conciseDescription);
  await page.locator('#collection-description').fill(conciseDescription);
  await page.getByTestId('validate-btn').click();
  await expect(page.locator('.version-status').first()).toHaveText('Validated');
  await page.getByTestId('generate-btn').click();

  const document = JSON.parse(await page.getByTestId('output-json').textContent());
  expect(document.collection.body.slug).toBe('flowers');
  expect(document.collection.header.meta_description).toContain('Browse free flower');
  expect(document.puzzles).toHaveLength(20);
  expect(document.collection.body.faqs.length).toBeGreaterThan(0);
  expect(document.puzzles.every(puzzle => puzzle.body.faqs.length > 0)).toBe(true);
  expect(document.puzzles[0].header.json_ld.image).toBe('');
  expect(document._cms.entrySlug).toBe('flowers');
});

test('creates deterministic automation audit diffs and keeps dry runs non-persistent', async ({ page }) => {
  await loadPuppy(page);
  const title = page.locator('#header-title');
  const original = await title.inputValue();
  await title.fill(`${original} Updated`);

  const dryRun = await page.evaluate(() => window.submitAsAutomation({ action: 'save', dryRun: true }));
  expect(dryRun.trigger).toBe('automated');
  expect(dryRun.entry_type).toBe('puzzle');
  expect(dryRun.changes).toEqual([{ field: 'header.title', old: original, new: `${original} Updated` }]);

  const countAfterDryRun = await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('dot-to-dot-cms', 2);
    request.onsuccess = () => {
      const count = request.result.transaction('audit-log', 'readonly').objectStore('audit-log').count();
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    };
    request.onerror = () => reject(request.error);
  }));
  expect(countAfterDryRun).toBe(0);

  await page.evaluate(() => window.submitAsAutomation({ action: 'save' }));
  await expect(page.locator('.version-list li')).toHaveCount(1);
  await page.getByTestId('menu-puzzle-cute-cute-puppy-dot-to-dot-puzzle').click();
  const empty = await page.evaluate(() => window.submitAsAutomation({ action: 'validate', dryRun: true }));
  expect(empty.changes).toEqual([]);
});
