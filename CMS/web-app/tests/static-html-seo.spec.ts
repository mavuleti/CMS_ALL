import path from 'node:path';
import { expect, test } from '@playwright/test';
// The production audit is intentionally plain ESM so Firebase gates can run it without transpilation.
// @ts-expect-error JavaScript module has no declaration file.
import { auditStaticHtml, findHtmlFiles, inspectHtml } from '../scripts/audit-static-html.mjs';

const outputRoot = path.resolve('out');
const htmlFiles = findHtmlFiles(outputRoot);
// GA is only baked into the export when the build set NEXT_PUBLIC_ENABLE_ANALYTICS=true
// (see the comment in app/[locale]/layout.tsx) — require it here iff the build did too,
// so this audit reflects what was actually built rather than assuming a prod build.
const requireGa = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
const auditedPages: Map<string, { problems: string[] }> = new Map(
  auditStaticHtml({ root: outputRoot, requireGa }).map((page: { file: string; problems: string[] }) => [page.file, page]),
);

test.describe('generated static HTML SEO and Google Analytics', () => {
  test.skip(({ browserName }, testInfo) => browserName !== 'chromium' || testInfo.project.name !== 'desktop-chrome', 'Static-file audit only needs one project — both projects use chromium, so skip the duplicate mobile-chrome run.');

  test('production export contains HTML pages', async () => {
    expect(htmlFiles.length, 'Run the production build before this audit').toBeGreaterThan(0);
    const indexableCount = htmlFiles
      .map((file: string) => inspectHtml(file, outputRoot))
      .filter((page: { isErrorPage: boolean }) => !page.isErrorPage).length;
    expect(indexableCount, 'The export must contain at least one indexable page').toBeGreaterThan(0);
  });

  for (const file of htmlFiles as string[]) {
    const relative = path.relative(outputRoot, file).replaceAll(path.sep, '/');
    test(`${relative} has SEO essentials, one H1, and GA`, async ({}, testInfo) => {
      const page = inspectHtml(file, outputRoot);
      await testInfo.attach('meta-tags.json', {
        body: Buffer.from(JSON.stringify({
          file: page.file,
          locale: page.locale,
          declaredLanguage: page.declaredLanguage,
          localizedCopy: page.localizedCopy,
          title: page.title,
          h1: page.h1,
          canonical: page.canonical,
          meta: page.meta,
        }, null, 2)),
        contentType: 'application/json',
      });
      expect(auditedPages.get(relative)?.problems, `Static HTML audit failed for ${relative}`).toEqual([]);
    });
  }
});
