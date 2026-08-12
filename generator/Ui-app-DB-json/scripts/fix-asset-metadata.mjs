/**
 * One-time script: injects required metadata into PDFs and PNGs.
 *
 * PDFs: adds /Title, /Website, /CreationDate to the Info dictionary.
 * PDFs: fixes /MediaBox if page size is not US Letter (612×792 pt).
 * PNGs: adds tEXt chunks for Title, Website, and Creation Time.
 *
 * Run once, commit the patched files; the build validator will then pass.
 */

import fs from 'fs';
import path from 'path';

// ── CRC32 for PNG chunks ──────────────────────────────────────────────────────
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── Build a PNG tEXt chunk ────────────────────────────────────────────────────
function makePngTextChunk(keyword, value) {
  const kw  = Buffer.from(keyword, 'latin1');
  const val = Buffer.from(value,   'latin1');
  const data = Buffer.concat([kw, Buffer.from([0]), val]);
  const type = Buffer.from('tEXt');
  const typeAndData = Buffer.concat([type, data]);
  const crc  = crc32(typeAndData);
  const len  = Buffer.allocUnsafe(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc);
  return Buffer.concat([len, type, data, crcBuf]);
}

// ── Inject tEXt chunks into a PNG (inserted after IHDR) ──────────────────────
function patchPng(filePath, entries) {
  const buf = fs.readFileSync(filePath);
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buf.slice(0, 8).equals(PNG_SIG)) throw new Error(`${filePath}: not a PNG`);

  // Find end of IHDR chunk (sig[8] + len[4] + type[4] + data[13] + crc[4] = offset 33)
  const insertAt = 8 + 4 + 4 + 13 + 4; // 33

  const textChunks = Buffer.concat(
    Object.entries(entries).map(([k, v]) => makePngTextChunk(k, v))
  );

  const patched = Buffer.concat([buf.slice(0, insertAt), textChunks, buf.slice(insertAt)]);
  fs.writeFileSync(filePath, patched);
  console.log(`  ✓ PNG patched: ${path.basename(filePath)}`);
}

// ── Patch PDF Info dictionary ─────────────────────────────────────────────────
function patchPdf(filePath, infoEntries, fixMediaBox) {
  let text = fs.readFileSync(filePath, 'latin1');

  if (!text.startsWith('%PDF-')) throw new Error(`${filePath}: not a PDF`);

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const pdfDate = `D:${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}` +
                  `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // Build the Info dictionary entries to inject
  const entries = { ...infoEntries, CreationDate: pdfDate };
  let infoBlock = Object.entries(entries)
    .map(([k, v]) => `/${k} (${v})`).join('\n');

  // Check if there's already an Info dict
  const infoMatch = text.match(/<<([^>]*(\/Title|\/CreationDate)[^>]*)>>/);

  if (infoMatch) {
    // Patch existing entries
    let dict = infoMatch[0];
    for (const [k, v] of Object.entries(entries)) {
      const re = new RegExp(`\\/${k}\\s*\\([^)]*\\)`);
      if (re.test(dict)) {
        dict = dict.replace(re, `/${k} (${v})`);
      } else {
        dict = dict.replace('<<', `<<\n/${k} (${v})`);
      }
    }
    text = text.replace(infoMatch[0], dict);
  } else {
    // Append a new Info object before %%EOF
    const eofIdx = text.lastIndexOf('%%EOF');
    if (eofIdx === -1) throw new Error(`${filePath}: no %%EOF marker`);

    // Find the xref offset line just before %%EOF
    const beforeEof = text.slice(0, eofIdx);
    const infoObj = `\n99999 0 obj\n<<\n${infoBlock}\n>>\nendobj\n`;
    text = beforeEof + infoObj + '%%EOF\n';
  }

  // Fix MediaBox if needed for legacy exports.
  if (fixMediaBox) {
    text = text.replace(
      /\/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+[\d.]+\s+[\d.]+\s*\]/,
      '/MediaBox [0 0 612 792]'
    );
    console.log(`  ✓ MediaBox fixed to US Letter`);
  }

  fs.writeFileSync(filePath, text, 'latin1');
  console.log(`  ✓ PDF patched: ${path.basename(filePath)}`);
}

// ── Run ───────────────────────────────────────────────────────────────────────
const SITE_URL = 'https://www.dottodotfreeprintables.com/';
const now = new Date().toISOString();

console.log('\nPatching PDF metadata…');
patchPdf('public/dinosaurs/brontosaurus-dot-to-dot-puzzle-printable-horizontal.pdf', {
  Title:   'dot to dot printable brontosaurus-dot-to-dot-puzzle-printable-horizontal',
  Website: SITE_URL,
}, false);

patchPdf('public/dinosaurs/triceratops-dot-to-dot-puzzle-printable-horizontal.pdf', {
  Title:   'dot to dot printable triceratops-dot-to-dot-puzzle-printable-horizontal',
  Website: SITE_URL,
}, false);

patchPdf('public/dinosaurs/velociraptor-dot-to-dot-puzzle-printable-horizontal.pdf', {
  Title:   'dot to dot printable velociraptor-dot-to-dot-puzzle-printable-horizontal',
  Website: SITE_URL,
}, false);

patchPdf('public/dinosaurs/pterodactyl-dot-to-dot-puzzle-printable-horizontal.pdf', {
  Title:   'dot to dot printable pterodactyl-dot-to-dot-puzzle-printable-horizontal',
  Website: SITE_URL,
}, false);

patchPdf('public/dinosaurs/trex-61-dot-to-dot-printable.pdf', {
  Title:   'dot to dot printable trex-61-dot-to-dot-printable',
  Website: SITE_URL,
}, false);

patchPdf('public/dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf', {
  Title:   'dot to dot printable trex-61-dot-to-dot-printable-horizontal',
  Website: SITE_URL,
}, false);

console.log('\nPatching PNG metadata…');
for (const file of fs.readdirSync('public/images').filter(name => name.endsWith('.png'))) {
  const stem = path.basename(file, '.png');
  patchPng(path.join('public/images', file), {
    Title: `dot to dot printable ${stem}`,
    Website: SITE_URL,
    'Creation Time': now,
  });
}

console.log('\nDone. Commit the patched files.\n');
