import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#fff9f0"/>
  <circle cx="18" cy="20" r="7" fill="#c83f3a"/>
  <circle cx="34" cy="32" r="7" fill="#f7c84b"/>
  <circle cx="48" cy="44" r="7" fill="#087c73"/>
  <path d="M22 23 L31 30 M38 35 L45 41" stroke="#2c2520" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const sizes = [16, 32, 48, 180, 192, 512];
const pngs = new Map();

writeFileSync('public/favicon.svg', svg);

for (const size of sizes) {
  pngs.set(size, await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer());
}

writeFileSync('public/favicon-16x16.png', pngs.get(16));
writeFileSync('public/favicon-32x32.png', pngs.get(32));
writeFileSync('public/apple-touch-icon.png', pngs.get(180));
writeFileSync('public/icon-192.png', pngs.get(192));
writeFileSync('public/icon-512.png', pngs.get(512));

const icoSizes = [16, 32, 48];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);

const entries = [];
let offset = 6 + 16 * icoSizes.length;

for (const size of icoSizes) {
  const image = pngs.get(size);
  const entry = Buffer.alloc(16);
  entry[0] = size;
  entry[1] = size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(image.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += image.length;
}

writeFileSync('public/favicon.ico', Buffer.concat([
  header,
  ...entries,
  ...icoSizes.map((size) => pngs.get(size))
]));
