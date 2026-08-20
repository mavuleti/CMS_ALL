import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = 'out';
const nextStaticDir = join(outDir, '_next', 'static');
const publicAssetDir = join(outDir, 'assets');
const ALL_LOCALE_DIRS = [
  'en', 'fr', 'es', 'de', 'pt', 'it', 'nl', 'sv', 'no', 'pl', 'da', 'fi', 'cs', 'hu', 'ro', 'tr',
  'pt-BR', 'el', 'ar', 'uk', 'hr', 'sk', 'lt', 'lv', 'sl', 'id', 'ja', 'ko', 'ru', 'th', 'vi', 'az', 'fa'
];
// Mirrors app/[locale]/layout.tsx's localeToHtmlLang — the SSR-rendered
// <html lang> already carries the correct regional BCP-47 tag (e.g.
// fr -> fr-FR), so this script must reuse the same mapping rather than
// stomping it back down to the bare locale folder name.
const localeToHtmlLang = {
  az: 'az-AZ', en: 'en', fr: 'fr-FR', es: 'es', de: 'de-DE', pt: 'pt-PT', it: 'it-IT',
  nl: 'nl-NL', sv: 'sv-SE', no: 'no-NO', pl: 'pl-PL', da: 'da-DK', fi: 'fi-FI', cs: 'cs-CZ',
  hu: 'hu-HU', ro: 'ro-RO', tr: 'tr-TR', ar: 'ar', fa: 'fa-IR', 'pt-BR': 'pt-BR', el: 'el-GR',
  uk: 'uk-UA', hr: 'hr-HR', sk: 'sk-SK', lt: 'lt-LT', lv: 'lv-LV', sl: 'sl-SI', id: 'id-ID',
  ja: 'ja-JP', ko: 'ko-KR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN'
};

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
  const localeDirs = new Set(ALL_LOCALE_DIRS);

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
      sl: 'sl_SI'
    }[documentLocale];
    const dir = documentLocale.startsWith('ar') ? 'rtl' : 'ltr';
    const htmlLang = localeToHtmlLang[documentLocale] ?? documentLocale;
    let patched = html
      .replace(/<html([^>]*)\blang="[^"]*"/, `<html$1lang="${htmlLang}"`)
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

// Publishes app/[locale]/404-page's rendered output as a real 404.html per
// locale directory (out/{locale}/404.html), plus the English version at the
// site root (out/404.html and out/404/index.html). Firebase Hosting looks
// for a literal 404.html in the requested path's own directory, walking up
// to the root if none is found — so this makes /fr/xyz serve the French
// not-found page and /xyz (or any other locale with no 404-page of its own,
// e.g. a typo'd locale segment) fall back to the English one, both with a
// real HTTP 404 status. Previously this cloned the homepage HTML instead,
// which is a soft-404 (200-shaped content) Google flags and users find
// confusing — see the "Custom 404 page" work item.
async function publishNotFoundPages() {
  for (const locale of ALL_LOCALE_DIRS) {
    const sourceFile = join(outDir, locale, '404-page', 'index.html');
    if (!(await pathExists(join(outDir, locale, '404-page')))) continue;
    const html = await readFile(sourceFile, 'utf8');
    await writeFile(join(outDir, locale, '404.html'), html);
    await rm(join(outDir, locale, '404-page'), { recursive: true, force: true });
  }

  const englishHtml = await readFile(join(outDir, 'en', '404.html'), 'utf8');
  await writeFile(join(outDir, '404.html'), englishHtml);
  await mkdir(join(outDir, '404'), { recursive: true });
  await writeFile(join(outDir, '404', 'index.html'), englishHtml);
}

await publishStaticAssets();
await externalizeStylesheets();
await patchLocaleHtmlAttributes();
await publishNotFoundPages();
// Keep .txt RSC payload files: Next.js prefetches them for every link, and
// deleting them floods the browser console with 404s on each page.
await removeFiles(outDir, ['.map'], []);
