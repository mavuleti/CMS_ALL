// Generates a real (non-upscaled) 1200px-wide webp variant for every puzzle
// preview image, sourced from the embedded 300dpi JPEG inside that puzzle's
// print PDF — not from upscaling the 800px web original.
//
// Each PDF page also contains page margins, a "Color this picture" footer,
// QR code, and site branding that the web preview crop excludes. This script
// re-derives the same crop by comparing the tight ink-bounding-box of the
// existing 800px webp against the tight ink-bounding-box of the PDF's
// artwork region (isolated by scanning for the first big vertical gap after
// the artwork, which separates it from the footer block), then scales that
// relationship up to compute the equivalent full-canvas crop in PDF-pixel
// space. See TODO-seo.md for background — this was previously blocked
// because `generate-responsive-images.mjs` refuses to upscale the 800px
// source, and no higher-resolution art was known to exist anywhere.
import fs from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const imagesDir = path.join('public', 'images');
const publicDir = 'public';
const TARGET_WIDTH = 1200;
const WHITE_THRESHOLD = 240;
const MIN_MATCH_RATIO = 0.9; // width-scale vs height-scale must agree within this tolerance

// The "Color this picture" / QR-code / brand footer sits at a fixed pixel
// row on every PDF page of a given orientation — verified identical (2298
// for landscape, 3048 for portrait) across multiple unrelated puzzles'
// PDFs, regardless of how much room the artwork itself takes up. A
// blank-row-gap heuristic isn't reliable here: tall artwork (e.g. a
// standing dinosaur) can leave only ~15px between its lowest dot and the
// footer, which a gap scan can't distinguish from noise.
const FOOTER_TOP_BY_PAGE_SIZE = {
  '3300x2550': 2298,
  '2550x3300': 3048
};

function extractEmbeddedJpeg(pdfBuffer) {
  const soi = pdfBuffer.indexOf(Buffer.from([0xff, 0xd8, 0xff]));
  if (soi === -1) return null;
  const eoi = pdfBuffer.indexOf(Buffer.from([0xff, 0xd9]), soi);
  if (eoi === -1) return null;
  return pdfBuffer.subarray(soi, eoi + 2);
}

function findCandidatePdfs(basename) {
  const dirs = readdirSync(publicDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const matches = [];
  for (const dir of dirs) {
    const dirPath = path.join(publicDir, dir);
    for (const file of readdirSync(dirPath)) {
      if (!file.endsWith('.pdf') || file.includes('_A4')) continue;
      if (!file.startsWith(`${basename}-dot-to-dot`)) continue;
      matches.push(path.join(dirPath, file));
    }
  }
  // Prefer the "-horizontal" page: it packs the same artwork into a
  // landscape page with far less wasted margin, so more of the 300dpi
  // source actually lands on the puzzle instead of white space.
  matches.sort((a, b) => Number(b.includes('-horizontal')) - Number(a.includes('-horizontal')));
  return matches;
}

async function trimBox(input) {
  const { data, info } = await sharp(input)
    .trim({ background: '#ffffff', threshold: 10 })
    .toBuffer({ resolveWithObject: true });
  const trimOffsetLeft = info.trimOffsetLeft ?? 0;
  const trimOffsetTop = info.trimOffsetTop ?? 0;
  return {
    left: -trimOffsetLeft,
    top: -trimOffsetTop,
    width: info.width,
    height: info.height,
    buffer: data
  };
}

async function isolateArtworkFromPage(jpegBuffer) {
  const img = sharp(jpegBuffer).rotate();
  const { data, info } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rowHasInk = new Array(height).fill(false);
  for (let y = 0; y < height; y++) {
    const rowStart = y * width;
    for (let x = 0; x < width; x++) {
      if (data[rowStart + x] < WHITE_THRESHOLD) {
        rowHasInk[y] = true;
        break;
      }
    }
  }
  const firstInk = rowHasInk.indexOf(true);
  if (firstInk === -1) return null;
  const boundary = FOOTER_TOP_BY_PAGE_SIZE[`${width}x${height}`] ?? height;
  const rowSliceBuffer = await img
    .clone()
    .extract({ left: 0, top: firstInk, width, height: boundary - firstInk })
    .toBuffer();
  const box = await trimBox(rowSliceBuffer);
  return {
    left: box.left,
    top: firstInk + box.top,
    width: box.width,
    height: box.height,
    pageWidth: width,
    pageHeight: height,
    footerTop: boundary
  };
}

async function processOne(webpName) {
  const basename = webpName.replace(/-puzzle\.webp$/, '');
  const webpPath = path.join(imagesDir, webpName);
  const outPath = path.join(imagesDir, `${basename}-puzzle-1200.webp`);

  if (existsSync(outPath)) {
    const [srcStat, outStat] = await Promise.all([fs.stat(webpPath), fs.stat(outPath)]);
    if (outStat.mtimeMs >= srcStat.mtimeMs) return { basename, status: 'current' };
  }

  const candidates = findCandidatePdfs(basename);
  if (candidates.length === 0) return { basename, status: 'no-pdf' };

  const webpMeta = await sharp(webpPath).metadata();
  const webpBox = await trimBox(webpPath);

  for (const pdfPath of candidates) {
    const pdfBuffer = await fs.readFile(pdfPath);
    const jpeg = extractEmbeddedJpeg(pdfBuffer);
    if (!jpeg) continue;

    const artworkBox = await isolateArtworkFromPage(jpeg);
    if (!artworkBox) continue;

    const scaleW = artworkBox.width / webpBox.width;
    const scaleH = artworkBox.height / webpBox.height;
    const agreement = Math.min(scaleW, scaleH) / Math.max(scaleW, scaleH);
    if (agreement < MIN_MATCH_RATIO) continue; // this PDF's artwork doesn't match this webp's proportions — wrong file

    const scale = (scaleW + scaleH) / 2;
    let canvasLeft = Math.round(artworkBox.left - webpBox.left * scale);
    let canvasTop = Math.round(artworkBox.top - webpBox.top * scale);
    let canvasWidth = Math.round(webpMeta.width * scale);
    let canvasHeight = Math.round(webpMeta.height * scale);

    // Clamp to the page bounds — the derived canvas can slightly overshoot
    // a page edge by a few px due to rounding.
    if (canvasLeft < 0) { canvasWidth += canvasLeft; canvasLeft = 0; }
    if (canvasTop < 0) { canvasHeight += canvasTop; canvasTop = 0; }
    canvasWidth = Math.min(canvasWidth, artworkBox.pageWidth - canvasLeft);
    // Clamp to the footer's fixed top row, not the raw page height — the
    // scaled canvas (which includes the webp's own below-content padding)
    // can otherwise overshoot back down into the footer/QR block.
    canvasHeight = Math.min(canvasHeight, artworkBox.footerTop - canvasTop);
    if (canvasWidth <= 0 || canvasHeight <= 0) continue;

    await sharp(jpeg)
      .rotate()
      .extract({ left: canvasLeft, top: canvasTop, width: canvasWidth, height: canvasHeight })
      .resize({ width: TARGET_WIDTH })
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(outPath);

    return { basename, status: 'generated', pdf: path.basename(pdfPath) };
  }

  return { basename, status: 'no-match' };
}

const entries = readdirSync(imagesDir).filter(
  (f) => f.endsWith('-puzzle.webp') && !/-puzzle-(400|600|700|1200)\.webp$/.test(f)
);

const results = [];
for (const name of entries) {
  results.push(await processOne(name));
}

const byStatus = results.reduce((acc, r) => {
  (acc[r.status] ??= []).push(r.basename);
  return acc;
}, {});

for (const [status, names] of Object.entries(byStatus)) {
  console.log(`${status}: ${names.length}`);
  if (status !== 'generated' && status !== 'current') console.log('  ', names.join(', '));
}

// ResponsiveImage.tsx is also used by client components, so it can't do a
// filesystem existence check itself to decide whether to add a 1200w
// srcset candidate (not every puzzle has one — a few PDFs use an older
// template our crop heuristic doesn't handle, see the no-match/no-pdf
// lists above). Ship the coverage as a plain JSON manifest instead, which
// is safe to import from both server and client bundles.
const manifestPath = path.join('lib', 'puzzle-1200-manifest.json');
const available = entries
  .filter((name) => existsSync(path.join(imagesDir, name.replace(/-puzzle\.webp$/, '-puzzle-1200.webp'))))
  .map((name) => `/images/${name}`)
  .sort();
await fs.writeFile(manifestPath, `${JSON.stringify(available, null, 2)}\n`);
console.log(`wrote ${manifestPath} (${available.length} entries)`);
