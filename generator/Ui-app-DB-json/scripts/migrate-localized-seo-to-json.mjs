import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { routing } from '../i18n/routing.ts';

const source = readFileSync('lib/localized-seo.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports });
const seo = module.exports;
const staticPages = ['about', 'contact', 'search', 'terms', 'privacy', 'blog'];
const collections = ['canada', 'circus', 'cute', 'dinosaurs', 'flowers', 'garden', 'ocean', 'playgrounds', 'space', 'uae', 'usa-250'];

for (const locale of routing.locales) {
  const directory = join('content', locale, 'seo');
  mkdirSync(directory, { recursive: true });
  const output = {
    homepage: seo.localizedSiteSeo(locale) ?? null,
    staticPages: Object.fromEntries(staticPages.map((page) => [page, seo.localizedStaticSeo(locale, page) ?? null])),
    collections: Object.fromEntries(collections.map((collection) => [collection, seo.localizedCollectionSeo(locale, collection) ?? null])),
    imageAlt: {
      social: seo.localizedSocialImageAlt(locale, '{{fallback}}'),
      card: seo.localizedPuzzleCardAlt(locale, '{{name}}'),
      preview: seo.localizedPuzzlePreviewAlt(locale, '{{name}}', 999)
    },
    puzzleFallback: {
      title: seo.localizedPuzzleTitle(locale, '{{name}}'),
      description: seo.localizedPuzzleDescription(locale, { name: '{{name}}', age: '91-92', dots: 999 })
    }
  };
  writeFileSync(join(directory, 'metadata.json'), `${JSON.stringify(output, null, 2)}\n`);
}
