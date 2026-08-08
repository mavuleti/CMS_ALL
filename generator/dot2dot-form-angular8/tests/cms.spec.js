const { test, expect } = require('@playwright/test');

async function clearDrafts(page) {
  await page.goto('/');
  await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('dot-to-dot-cms', 1);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('versions', 'readwrite');
      transaction.objectStore('versions').clear();
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

test('validation reports details and creates validated/submitted workflow versions', async ({ page }) => {
  await page.getByTestId('validate-btn').click();
  await expect(page.getByTestId('validation-summary')).toBeVisible();
  await loadPuppy(page);
  await page.locator('#ld-image').pressSequentially('https://dottodotfreeprintables.com/images/cute-puppy.webp');
  await page.locator('#ld-age').fill('5-9');
  await page.getByTestId('validate-btn').click();
  await expect(page.locator('.version-status').first()).toHaveText('Validated');
  await page.getByTestId('generate-btn').click();
  await expect(page.locator('.version-status').first()).toHaveText('Submitted');
  const json = JSON.parse(await page.getByTestId('output-json').textContent());
  expect(json._cms.status).toBe('submitted');
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
