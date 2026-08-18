import path from 'node:path';
import { expect, test } from '@playwright/test';
// The production audit is intentionally plain ESM so Firebase gates can run it without transpilation.
// @ts-expect-error JavaScript module has no declaration file.
import { auditStaticHtml } from '../scripts/audit-static-html.mjs';

const outputRoot = path.resolve('out');
// GA is only baked into the export when the build set NEXT_PUBLIC_ENABLE_ANALYTICS=true
// (see the comment in app/[locale]/layout.tsx) — require it here iff the build did too,
// so this audit reflects what was actually built rather than assuming a prod build.
const requireGa = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
// auditStaticHtml() already calls inspectHtml() on every file once (it needs
// the full page shape to compute problems) — reuse that pass for both tests
// below instead of re-parsing all ~3,700 files a second time.
const auditedPages: Map<string, { problems: string[]; isErrorPage: boolean }> = new Map(
  auditStaticHtml({ root: outputRoot, requireGa }).map((page: { file: string; problems: string[]; isErrorPage: boolean }) => [page.file, page]),
);

test.describe('generated static HTML SEO and Google Analytics', () => {
  test('production export contains HTML pages', async ({}, testInfo) => {
    testInfo.skip(testInfo.project.name !== 'desktop-chrome', 'Static-file audit only needs one project — both projects use chromium, so skip the duplicate mobile-chrome run.');
    expect(auditedPages.size, 'Run the production build before this audit').toBeGreaterThan(0);
    const indexableCount = [...auditedPages.values()].filter((page) => !page.isErrorPage).length;
    expect(indexableCount, 'The export must contain at least one indexable page').toBeGreaterThan(0);
  });

  test('every generated page has SEO essentials, one H1, and GA', async ({}, testInfo) => {
    testInfo.skip(testInfo.project.name !== 'desktop-chrome', 'Static-file audit only needs one project — both projects use chromium, so skip the duplicate mobile-chrome run.');
    // One Playwright test per static HTML file (previously ~3,721 individual
    // tests) hit a Playwright harness bug at this scale on Windows: workers
    // started throwing `TypeError: Cannot read properties of undefined
    // (reading 'project')` partway through the run, unrelated to any actual
    // page content. inspectHtml/auditStaticHtml are plain in-process
    // functions with no browser dependency, so looping over them in a single
    // test avoids the per-test harness overhead entirely.
    const failures: string[] = [];
    for (const [relative, page] of auditedPages) {
      if (page.problems.length > 0) {
        failures.push(`${relative}:\n  - ${page.problems.join('\n  - ')}`);
      }
    }
    await testInfo.attach('audit-summary.json', {
      body: Buffer.from(JSON.stringify({ totalFiles: auditedPages.size, failingFiles: failures.length }, null, 2)),
      contentType: 'application/json',
    });
    expect(failures, `Static HTML audit failed for ${failures.length} of ${auditedPages.size} file(s)`).toEqual([]);
  });
});
