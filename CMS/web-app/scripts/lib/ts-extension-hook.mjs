// scripts/lib/ts-extension-hook.mjs
//
// The app's lib/*.ts files rely on two things Next.js's/webpack's module
// resolution accepts but plain Node ESM doesn't:
//
// 1. Extensionless relative imports, e.g. `from './puzzle-i18n'`. Node ESM
//    requires an explicit extension for relative specifiers.
// 2. A static `import enContent from '../content/en/x.json'` (in
//    lib/usa-250-data.ts) with no `with { type: 'json' }` import attribute.
//    Node ESM requires that attribute to be present in the source itself
//    for JSON imports, so it can't be fixed by just tagging format in a
//    resolve hook -- the fix has to bypass Node's built-in JSON handling.
//
// Rather than modify the app's source, this loader hook handles both so
// scripts/generate-search-index.mjs can import the real lib/*-data.ts
// modules unmodified and reuse their exact merge/availability logic.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const isRelative = specifier.startsWith('.') || specifier.startsWith('/');
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(specifier);
    if (isRelative && !hasExtension) {
      for (const ext of ['.ts', '.tsx', '.mts']) {
        try {
          return await nextResolve(specifier + ext, context);
        } catch {
          // try next extension
        }
      }
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    // Serve JSON files as a synthetic ES module (`export default {...}`)
    // instead of going through Node's native JSON-module handling, which
    // demands a `with { type: 'json' }` attribute at the import site.
    const parsed = JSON.parse(readFileSync(fileURLToPath(url), 'utf8'));
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(parsed)};`
    };
  }
  return nextLoad(url, context);
}
