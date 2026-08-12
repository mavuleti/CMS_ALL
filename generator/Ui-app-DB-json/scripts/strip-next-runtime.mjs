import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = 'out';
const nextStaticDir = join(outDir, '_next', 'static');
const publicAssetDir = join(outDir, 'assets');

async function matchingFiles(dir, extension) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory()
        ? matchingFiles(path, extension)
        : path.endsWith(extension)
          ? [path]
          : [];
    })
  );

  return files.flat();
}

function stripRuntime(html) {
  return html
    .replace(/\sdata-precedence="next"/g, '')
    .replace(/<link[^>]+rel="preload"[^>]+href="\/_next\/static\/chunks\/[^"]+"[^>]*>/g, '')
    .replace(/<link[^>]+href="\/_next\/static\/chunks\/[^"]+"[^>]+rel="preload"[^>]*>/g, '')
    .replace(/href="\/_next\/static\/css\/([^"]+)"/g, 'href="/assets/css/$1"')
    .replace(/<script[^>]+src="\/_next\/static\/chunks\/[^"]+"[^>]*><\/script>/g, '')
    .replace(/<script[^>]*>\s*self\.__next_[\s\S]*?<\/script>/g, '')
    .replace(/<script[^>]*>\s*\(self\.__next_[\s\S]*?<\/script>/g, '')
    .replace(/<div hidden id="S:0">[\s\S]*?<\/div><script[^>]*>[\s\S]*?<\/script>/g, '');
}

async function pathExists(path) {
  try {
    await readdir(path);
    return true;
  } catch {
    return false;
  }
}

async function publishStaticAssets() {
  if (!(await pathExists(nextStaticDir))) {
    return;
  }

  await mkdir(publicAssetDir, { recursive: true });

  const sourceCssDir = join(nextStaticDir, 'css');
  const sourceMediaDir = join(nextStaticDir, 'media');
  const targetCssDir = join(publicAssetDir, 'css');
  const targetMediaDir = join(publicAssetDir, 'media');

  if (await pathExists(sourceCssDir)) {
    await cp(sourceCssDir, targetCssDir, { recursive: true, force: true });

    for (const file of await matchingFiles(targetCssDir, '.css')) {
      const css = await readFile(file, 'utf8');
      const rewritten = css
        .replace(/\/_next\/static\/media\//g, '/assets/media/')
        .replace(/\/\*# sourceMappingURL=[\s\S]*?\*\//g, '')
        .replace(/\/\/# sourceMappingURL=.*/g, '');

      if (rewritten !== css) {
        await writeFile(file, rewritten);
      }
    }
  }

  if (await pathExists(sourceMediaDir)) {
    await cp(sourceMediaDir, targetMediaDir, { recursive: true, force: true });
  }
}

async function externalizeStylesheets() {
  const stylesheetPattern = /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="\/_next\/static\/css\/([^"]+)")[^>]*>/g;
  let updatedFiles = 0;

  for (const file of await matchingFiles(outDir, '.html')) {
    const html = await readFile(file, 'utf8');
    const externalized = html.replace(stylesheetPattern, (tag, stylesheet) =>
      tag
        .replace(`href="/_next/static/css/${stylesheet}"`, `href="/assets/css/${stylesheet}"`)
        .replace(/\sdata-precedence="next"/g, '')
    );

    if (externalized !== html) {
      await writeFile(file, externalized);
      updatedFiles += 1;
    }
  }

  console.log(`Externalized hashed stylesheets in ${updatedFiles} HTML file(s).`);
}

async function removeFiles(dir, extensions, preservedFiles = []) {
  const preserved = new Set(preservedFiles.map((file) => join(dir, file)));

  for (const extension of extensions) {
    for (const file of await matchingFiles(dir, extension)) {
      if (preserved.has(file)) {
        continue;
      }

      await rm(file, { force: true });
    }
  }
}

async function patchLocaleHtmlAttributes() {
  const localeDirs = new Set([
    'en', 'fr', 'es', 'de', 'pt', 'it', 'nl', 'sv', 'no', 'pl', 'da', 'fi', 'cs', 'hu', 'ro', 'tr',
    'pt-BR', 'el', 'ar', 'uk', 'hr', 'sk', 'lt', 'lv', 'sl', 'id', 'ja', 'ko', 'ru', 'th', 'vi',
    'ar-AE', 'ar-SA', 'ar-QA'
  ]);

  for (const file of await matchingFiles(outDir, '.html')) {
    const relative = file.slice(outDir.length + 1).split('\\').join('/');
    const locale = relative.split('/')[0];

    if (!localeDirs.has(locale)) {
      continue;
    }

    const html = await readFile(file, 'utf8');
    const canonicalLocale = html
      .match(/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="https:\/\/dottodotfreeprintables\.com\/([^/"]+))/)?.[1];
    const documentLocale = canonicalLocale === 'en' && locale !== 'en' ? 'en' : locale;
    const ogLocaleOverride = {
      en: 'en_US',
      uk: 'uk_UA',
      hr: 'hr_HR',
      sk: 'sk_SK',
      lt: 'lt_LT',
      lv: 'lv_LV',
      sl: 'sl_SI',
      'ar-AE': 'ar_AE',
      'ar-SA': 'ar_SA',
      'ar-QA': 'ar_QA'
    }[documentLocale];
    const dir = documentLocale.startsWith('ar') ? 'rtl' : 'ltr';
    let patched = html
      .replace(/<html([^>]*)\blang="[^"]*"/, `<html$1lang="${documentLocale}"`)
      .replace(/<html([^>]*)\bdir="[^"]*"/, `<html$1dir="${dir}"`)
      .replace(/<html(?![^>]*\bdir=)/, `<html dir="${dir}"`);
    if (ogLocaleOverride) {
      patched = patched.replace(
        /<meta property="og:locale" content="[^"]*"/,
        `<meta property="og:locale" content="${ogLocaleOverride}"`
      );
    }

    if (patched !== html) {
      await writeFile(file, patched);
      console.log(`Patched locale html attributes in ${file}`);
    }
  }
}

function aliasArabicHtml(html, alias) {
  // Alias pages are full self-canonical members of the Arabic hreflang
  // cluster (ar / ar-AE / ar-SA / ar-QA all reciprocally reference each
  // other's own URL — see MERGE_PLAN.md and tests/i18n-layout.spec.ts).
  // The source /ar/ page's <link rel="alternate"> tags already carry
  // absolute URLs for the full cluster (including this alias's own URL,
  // via lib/seo.ts buildAlternates), so copying them verbatim is correct —
  // only the lang/dir attributes, the self-referencing canonical link, and
  // relative in-page nav links need to move onto this alias's path.
  const canonicalMatch = html.match(/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="([^"]+)")[^>]*>/);
  const pathSuffix =
    canonicalMatch?.[1].match(/^https:\/\/dottodotfreeprintables\.com\/ar(\/.*)?$/)?.[1] ?? '/';

  const rewritten = html
    .replace(/<html([^>]*)\blang="[^"]*"/, `<html$1lang="${alias}"`)
    .replace(/<html([^>]*)\bdir="[^"]*"/, '<html$1dir="rtl"')
    .replace(/<html(?![^>]*\bdir=)/, '<html dir="rtl"')
    .replace(/(["'])\/ar(?=\/|#|")/g, `$1/${alias}`)
    .replace(
      /<meta property="og:locale" content="[^"]*"/,
      `<meta property="og:locale" content="${alias.replace('-', '_')}"`
    )
    .replace(
      /<link\b(?=[^>]*\brel="canonical")[^>]*>/,
      (tag) => tag.replace(/\bhref="[^"]*"/, `href="https://dottodotfreeprintables.com/${alias}${pathSuffix}"`)
    );

  // The rewrites above only touch the static, server-rendered <head> tags.
  // Next's App Router also embeds the *original* (unrewritten) metadata as
  // an RSC flight payload inside `self.__next_f.push(...)` <script> tags,
  // which client-side hydration reads to reconcile <head> — left running,
  // hydration re-inserts the original /ar/ canonical (and other
  // self-referential fields) alongside our rewritten one, producing
  // duplicate <link rel="canonical"> elements (caught by
  // tests/i18n-layout.spec.ts "home pages are self-canonical"). Since these
  // alias pages exist purely for hreflang/SEO — not for interactive client
  // features — stripping their runtime scripts (via the same stripRuntime()
  // used elsewhere in this file) removes hydration entirely, so the
  // rewritten static HTML is the final, single source of truth.
  return stripRuntime(rewritten);
}

async function publishArabicRegionalAliases() {
  const sourceDir = join(outDir, 'ar');
  const aliases = ['ar-AE', 'ar-SA', 'ar-QA'];

  if (!(await pathExists(sourceDir))) {
    return;
  }

  for (const alias of aliases) {
    const targetDir = join(outDir, alias);
    await rm(targetDir, { recursive: true, force: true });
    await cp(sourceDir, targetDir, { recursive: true, force: true });

    for (const file of await matchingFiles(targetDir, '.html')) {
      const html = await readFile(file, 'utf8');
      await writeFile(file, aliasArabicHtml(html, alias));
    }

    console.log(`Published Arabic regional alias in ${targetDir}`);
  }
}

await publishStaticAssets();
await externalizeStylesheets();
await patchLocaleHtmlAttributes();
await publishArabicRegionalAliases();
// Keep .txt RSC payload files: Next.js prefetches them for every link, and
// deleting them floods the browser console with 404s on each page.
await removeFiles(outDir, ['.map'], []);

const homeHtml = await readFile(join(outDir, 'en', 'index.html'), 'utf8');
await writeFile(join(outDir, '404.html'), homeHtml);
await mkdir(join(outDir, '404'), { recursive: true });
await writeFile(join(outDir, '404', 'index.html'), homeHtml);
