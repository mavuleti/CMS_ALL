import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imagesDir = path.join('public', 'images');
const widths = [400, 600, 700];

const entries = await fs.readdir(imagesDir, { withFileTypes: true });
const responsiveEditorialImages = new Set([
  'girl-solving-dot-to-dot-dinosaur-printable.webp',
  'dot-to-dot-fine-motor-skills.webp',
  'best-of-2026-dot-to-dot-book-cover.webp'
]);
const sources = entries
  .filter((entry) => entry.isFile() && (entry.name.endsWith('-puzzle.webp') || responsiveEditorialImages.has(entry.name)))
  .map((entry) => entry.name);

for (const sourceName of sources) {
  const sourcePath = path.join(imagesDir, sourceName);
  const sourceStat = await fs.stat(sourcePath);
  const metadata = await sharp(sourcePath).metadata();

  for (const width of widths) {
    if (!metadata.width || metadata.width <= width) {
      continue;
    }

    const outputName = sourceName.replace(/\.webp$/, `-${width}.webp`);
    const outputPath = path.join(imagesDir, outputName);
    let current = false;

    try {
      const outputStat = await fs.stat(outputPath);
      current = outputStat.mtimeMs >= sourceStat.mtimeMs;
    } catch {
      // The variant does not exist yet.
    }

    if (current) {
      continue;
    }

    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(outputPath);

    console.log(`Generated ${outputPath}`);
  }
}
