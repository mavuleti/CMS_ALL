/**
 * Pre-deploy gate for `prod-deploy` / `prod-deploy-light`: fails BEFORE
 * `firebase deploy` runs if the just-built static export does not actually
 * contain the GA snippet. Analytics is compiled in/out at `next build` time
 * based on NEXT_PUBLIC_ENABLE_ANALYTICS — whatever value was present at build
 * time is permanently baked into the HTML, so checking the live site after
 * deploy (verify-ga-live.mjs) catches this only after the broken build is
 * already public. This checks the build artifact itself, so it fails
 * regardless of *how* the build was invoked (composite npm script, or a
 * manually split-out `next build` that forgot to set the env var).
 */

// Kept as a backwards-compatible command for existing deployment automation.
// The shared audit now checks every indexable HTML file, not only /en/.
const { auditStaticHtml, OUTPUT_DIR } = await import('./audit-static-html.mjs');
const pages = auditStaticHtml({ requireGa: true });
const failures = pages.filter((page) => page.problems.length > 0);
const indexableCount = pages.filter((page) => !page.isErrorPage).length;

if (pages.length === 0) {
  console.error(`FAILED: no static HTML files found under ${OUTPUT_DIR}. Run \`npm run build\` first.`);
  process.exitCode = 1;
} else if (indexableCount === 0) {
  console.error('FAILED: the export contains no indexable HTML pages. Refusing to deploy an empty/stale build.');
  process.exitCode = 1;
} else if (failures.length > 0) {
  for (const page of failures) console.error(`FAILED: ${page.file}\n  - ${page.problems.join('\n  - ')}`);
  process.exitCode = 1;
} else {
  console.log(`OK: all ${indexableCount} indexable pages include the GA snippet.`);
}
