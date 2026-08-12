/**
 * Deployment output validation.
 *
 * This runs after the static export is generated and sanitized. It prevents
 * accidental publication of repository, dependency, source map, test, archive,
 * and documentation files from the Firebase Hosting public directory.
 */

import fs from 'fs';
import path from 'path';

const OUT_DIR = 'out';

const FORBIDDEN_DIRS = new Set([
  '.git',
  '__tests__',
  'tests',
  'test',
  'playwright-report',
  'test-results',
  'node_modules'
]);

const FORBIDDEN_EXACT_FILES = new Set([
  'package.json',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'README',
  'README.md',
  'README.txt'
]);

const FORBIDDEN_EXTENSIONS = new Set([
  '.map',
  '.zip'
]);

const TEXT_EXTENSIONS_TO_SCAN = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.txt',
  '.xml'
]);

// Arabic-only third-party font hosts. Any locale other than ar/ar-AE/ar-SA/ar-QA
// must never reference these: a stray global @import or <link> here means a
// render-blocking third-party round-trip shipped to every non-Arabic locale
// (this happened once already with the Cairo font @import in rtl.css leaking
// into all 32 locales' CSS and tanking homepage LCP/FCP).
const ARABIC_ONLY_FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const ARABIC_LOCALES = new Set(['ar', 'ar-AE', 'ar-SA', 'ar-QA']);

function normalize(filePath) {
  return filePath.split(path.sep).join('/');
}

function isReadme(fileName) {
  return /^readme(?:\.[\w.-]+)?$/i.test(fileName);
}

function isTestFile(fileName) {
  return /\.(spec|test)\.[cm]?[jt]sx?$/i.test(fileName);
}

function shouldScanText(fileName) {
  return TEXT_EXTENSIONS_TO_SCAN.has(path.extname(fileName).toLowerCase());
}

function validateArabicFontScoping(relativePath, text, errors) {
  // Only check HTML/CSS: an actual font request comes from a <link> tag or an
  // @import, both of which only ever appear in those. Shared JS chunks (e.g.
  // Next's font-optimization runtime) can legitimately contain these domain
  // strings as generic library code without ever fetching them for a given page.
  const extension = path.extname(relativePath).toLowerCase();
  if (extension !== '.html' && extension !== '.css') {
    return;
  }

  const locale = relativePath.split('/')[0];
  if (ARABIC_LOCALES.has(locale)) {
    return;
  }

  for (const host of ARABIC_ONLY_FONT_HOSTS) {
    if (text.includes(host)) {
      errors.push(`${relativePath}: references ${host} outside the Arabic locales - font must be locale-scoped`);
    }
  }
}

function validateDownloadLinks(relativePath, text, errors) {
  if (path.extname(relativePath).toLowerCase() !== '.html') {
    return;
  }

  const downloadControls =
    text.match(/<(?:a|button)\b[^>]*class="[^"]*\bdownload-btn\b[^"]*"[^>]*>/gi) ?? [];

  for (const control of downloadControls) {
    if (/^<button\b/i.test(control)) {
      errors.push(`${relativePath}: active download control must be a link, not a button`);
      continue;
    }

    if (!/\bhref="[^"]+\.pdf"/i.test(control)) {
      errors.push(`${relativePath}: download link must have a direct PDF href`);
    }
  }
}

function validateStylesheetDelivery(relativePath, text, errors) {
  if (path.extname(relativePath).toLowerCase() !== '.html') {
    return;
  }

  const allStylesheetLinks = text.match(/<link\b(?=[^>]*\brel="stylesheet")[^>]*>/g) ?? [];
  const legacyLinks = allStylesheetLinks.filter((tag) => tag.includes('/_next/static/css/'));
  if (legacyLinks.length > 0) {
    errors.push(`${relativePath}: stylesheet still points at /_next/static/css/ instead of /assets/css/`);
  }

  const stylesheetLinks = allStylesheetLinks
    .map((tag) => tag.match(/href="\/assets\/css\/([^"]+\.css)"/))
    .filter(Boolean);

  for (const match of stylesheetLinks) {
    const stylesheet = path.join(OUT_DIR, 'assets', 'css', match[1]);
    if (!fs.existsSync(stylesheet)) {
      errors.push(`${relativePath}: referenced stylesheet does not exist: /assets/css/${match[1]}`);
    }
  }
}

function walk(dir, errors) {
  if (!fs.existsSync(dir)) {
    errors.push(`${OUT_DIR}: deployment output directory does not exist`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = normalize(path.relative(OUT_DIR, fullPath));
    const lowerName = entry.name.toLowerCase();

    if (entry.isDirectory()) {
      if (FORBIDDEN_DIRS.has(lowerName)) {
        errors.push(`${relativePath}/: forbidden directory must not be published`);
        continue;
      }

      walk(fullPath, errors);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (
      FORBIDDEN_EXACT_FILES.has(entry.name) ||
      FORBIDDEN_EXACT_FILES.has(lowerName) ||
      FORBIDDEN_EXTENSIONS.has(extension) ||
      isReadme(entry.name) ||
      isTestFile(entry.name)
    ) {
      errors.push(`${relativePath}: forbidden file must not be published`);
      continue;
    }

    if (shouldScanText(entry.name)) {
      const text = fs.readFileSync(fullPath, 'utf8');
      if (text.includes('sourceMappingURL')) {
        errors.push(`${relativePath}: sourceMappingURL reference must not be published`);
      }
      validateDownloadLinks(relativePath, text, errors);
      validateArabicFontScoping(relativePath, text, errors);
      validateStylesheetDelivery(relativePath, text, errors);
    }
  }
}

const errors = [];
walk(OUT_DIR, errors);

if (errors.length > 0) {
  console.error('\nDeploy output validation failed:\n');
  errors.forEach((error) => console.error('  -', error));
  console.error(`\n${errors.length} forbidden deploy artifact(s) found. Remove them before deploying.\n`);
  process.exit(1);
}

console.log('Deploy output validation passed.');
