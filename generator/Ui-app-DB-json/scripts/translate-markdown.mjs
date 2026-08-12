import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Translates a standalone markdown file with Google's free unofficial
// translate endpoint (same one used by scripts/translate-locale.mjs).
// Usage: node scripts/translate-markdown.mjs <inputFile> <targetLocale> [outputFile]

const [inputFile, targetLocale, outputFileArg] = process.argv.slice(2);
if (!inputFile || !targetLocale) {
  console.error('Usage: node scripts/translate-markdown.mjs <inputFile> <targetLocale> [outputFile]');
  console.error('Example: node scripts/translate-markdown.mjs extranal-blogs/article-medium-FINAL.md ar');
  process.exit(1);
}

const outputFile = outputFileArg || inputFile.replace(/\.md$/, `.${targetLocale}.md`);

function protectText(text) {
  const tokens = [];
  // Protect markdown links [text](url), inline code, and bold/italic markers'
  // URL portions so Google Translate can't touch them.
  const protectedText = text.replace(/\(https?:\/\/[^)]+\)/g, (match) => {
    const token = `ZXQ${tokens.length}QXZ`;
    tokens.push(match);
    return token;
  });
  return { protectedText, tokens };
}

function restoreText(text, tokens) {
  let restored = text;
  tokens.forEach((tokenValue, index) => {
    restored = restored.replaceAll(`ZXQ${index}QXZ`, tokenValue);
    restored = restored.replaceAll(`ZXQ ${index} QXZ`, tokenValue);
  });
  return restored;
}

async function translateOne(text, attempt = 1) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', targetLocale);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url);
  if (!res.ok) {
    if (attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      return translateOne(text, attempt + 1);
    }
    throw new Error(`translate ${targetLocale} failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data?.[0] ?? []).map((entry) => entry?.[0] ?? '').join('');
}

async function translateBlock(block) {
  if (!block.trim()) return block;
  const { protectedText, tokens } = protectText(block);
  const translated = await translateOne(protectedText);
  await new Promise((resolve) => setTimeout(resolve, 120));
  return restoreText(translated, tokens);
}

const source = readFileSync(inputFile, 'utf8');
// Split on blank lines so headings/paragraphs are translated as separate
// units (keeps translation quality high and avoids the API's per-request
// size limits on a long article).
const blocks = source.split(/\n{2,}/);

console.log(`Translating ${blocks.length} block(s) from ${inputFile} to ${targetLocale}...`);
const translatedBlocks = [];
for (let i = 0; i < blocks.length; i++) {
  translatedBlocks.push(await translateBlock(blocks[i]));
  console.log(`  [${i + 1}/${blocks.length}] done`);
}

// Google Translate sometimes inserts a space between the link text and the
// URL parenthesis (e.g. "[text] (url)"), breaking markdown link syntax.
const result = translatedBlocks.join('\n\n').replace(/\]\s+\(/g, '](');

writeFileSync(outputFile, `${result}\n`);
console.log(`Wrote ${outputFile}`);
