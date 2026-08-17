/**
 * Asset validation — runs before build/deploy.
 *
 * Image rules (per puzzle):
 *   [name]-puzzle.webp  → 800×679 px, WebP, ≤ 150 KB
 *   [name]-card.webp    → 420×315 px, WebP, ≤  60 KB
 *
 * PDF rules (per puzzle):
 *   [name]-printable.pdf → US Letter page (8.5×11 in = 612×792 pt),
 *                          ≤ 300 KB, content within safe zone enforced by designer
 *
 * Safe zone reminder: keep all dots/numbers within 7.5×9.5 in (540×684 pt)
 * centred on the page — prints correctly on both US Letter and A4.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = 'public/images';
const PDF_DIR    = 'public/dinosaurs';

// ── Thresholds ────────────────────────────────────────────────────────────────
const RULES = {
  puzzle: { width: 800, height: 679, maxKB: 150 },
  card:   { width: 420, height: 315, maxKB:  60 },
};
const PDF_MAX_KB     = 1500; // print-quality puzzle PDFs are typically 500KB–1.5MB
// US Letter in PDF points (1 pt = 1/72 in)
const PDF_PAGE_W_PT  = 612;   // 8.5 in
const PDF_PAGE_H_PT  = 792;   // 11 in
// A4 in PDF points (210 x 297 mm)
const A4_PAGE_W_PT   = 595.3;
const A4_PAGE_H_PT   = 841.9;
const PDF_TOL_PT     = 5;     // ±5 pt tolerance for rounding

// ── Helpers ───────────────────────────────────────────────────────────────────
const kb = bytes => (bytes / 1024).toFixed(1) + ' KB';

function fileSizeKB(filePath) {
  return fs.statSync(filePath).size / 1024;
}

/** Naively extract /MediaBox from PDF bytes — no full parser needed */
function parsePdfPageSize(filePath) {
  const buf = fs.readFileSync(filePath);
  const text = buf.toString('latin1', 0, Math.min(buf.length, 8192));
  const match = text.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
  if (!match) return null;
  return {
    w: parseFloat(match[3]) - parseFloat(match[1]),
    h: parseFloat(match[4]) - parseFloat(match[2]),
  };
}

// ── PNG metadata validation ───────────────────────────────────────────────────

/** Parse tEXt and iTXt chunks from a PNG buffer, return { keyword: value } map */
function parsePNGTextChunks(buf) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buf.slice(0, 8).equals(PNG_SIG)) return null;

  const chunks = {};
  let offset = 8;

  while (offset + 8 <= buf.length) {
    const length   = buf.readUInt32BE(offset);
    const type     = buf.toString('ascii', offset + 4, offset + 8);
    const data     = buf.slice(offset + 8, offset + 8 + length);
    offset += 12 + length; // length(4) + type(4) + data + crc(4)

    if (type === 'tEXt') {
      const nullIdx = data.indexOf(0);
      if (nullIdx < 0) continue;
      const keyword = data.toString('latin1', 0, nullIdx);
      const value   = data.toString('latin1', nullIdx + 1);
      chunks[keyword] = value;
    } else if (type === 'iTXt') {
      const nullIdx = data.indexOf(0);
      if (nullIdx < 0) continue;
      const keyword = data.toString('utf8', 0, nullIdx);
      // skip compression_flag(1) + compression_method(1) + lang\0 + translated_kw\0
      let pos = nullIdx + 3; // skip flags
      while (pos < data.length && data[pos] !== 0) pos++; pos++; // skip lang tag + null
      while (pos < data.length && data[pos] !== 0) pos++; pos++; // skip translated kw + null
      const value = data.toString('utf8', pos);
      chunks[keyword] = value;
    } else if (type === 'IEND') {
      break;
    }
  }

  return chunks;
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function validatePNGMetadata() {
  const errors = [];
  const pngDir = 'public/images';
  if (!fs.existsSync(pngDir)) return errors;

  const files = fs.readdirSync(pngDir).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(pngDir, file);
    const buf      = fs.readFileSync(filePath);
    const chunks   = parsePNGTextChunks(buf);

    if (!chunks) {
      errors.push(`${file}: not a valid PNG`);
      continue;
    }

    const stem         = path.basename(file, '.png');
    const expectedTitle   = `dot to dot printable ${stem}`;
    const expectedWebsite = 'https://www.dottodotfreeprintables.com/';

    if (chunks['Title'] !== expectedTitle) {
      errors.push(
        `${file}: PNG Title must be "${expectedTitle}" (got ${JSON.stringify(chunks['Title'] ?? '<missing>')})`
      );
    }
    if (chunks['Website'] !== expectedWebsite) {
      errors.push(
        `${file}: PNG Website must be "${expectedWebsite}" (got ${JSON.stringify(chunks['Website'] ?? '<missing>')})`
      );
    }
    if (!chunks['Creation Time'] || !ISO_RE.test(chunks['Creation Time'])) {
      errors.push(
        `${file}: PNG Creation Time must be an ISO datetime (got ${JSON.stringify(chunks['Creation Time'] ?? '<missing>')})`
      );
    }
  }

  return errors;
}

// ── Collect images actually referenced in data files ─────────────────────────
function referencedImages() {
  const sources = ['lib/dinosaurs-data.ts', 'lib/site-data.ts'];
  const images  = new Set();
  for (const src of sources) {
    if (!fs.existsSync(src)) continue;
    const text = fs.readFileSync(src, 'utf8');
    for (const m of text.matchAll(/['"]\/images\/([\w.-]+\.webp)['"]/g)) {
      images.add(m[1]);
    }
  }
  return images;
}

// ── Image validation ──────────────────────────────────────────────────────────
async function validateImages() {
  const errors = [];
  const files  = referencedImages();

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);

    if (!fs.existsSync(filePath)) {
      errors.push(`${file}: file not found in ${IMAGES_DIR}`);
      continue;
    }

    const sizeKB = fileSizeKB(filePath);

    let type = null;
    if (file.includes('-puzzle'))  type = 'puzzle';
    else if (file.includes('-card')) type = 'card';
    if (!type) continue; // og/hero images — no strict size rule

    const rule = RULES[type];
    const meta = await sharp(filePath).metadata();

    if (meta.format !== 'webp') {
      errors.push(`${file}: must be WebP (got ${meta.format})`);
    }
    if (meta.width !== rule.width || meta.height !== rule.height) {
      errors.push(
        `${file}: expected ${rule.width}×${rule.height} px, got ${meta.width}×${meta.height} px`
      );
    }
    if (sizeKB > rule.maxKB) {
      errors.push(`${file}: ${kb(sizeKB * 1024)} exceeds ${rule.maxKB} KB limit`);
    }
  }

  return errors;
}

// ── PDF Info dictionary helpers ───────────────────────────────────────────────

/** Decode a PDF literal string: handles \n \r \t \\ \( \) and octal \ddd */
function decodePdfLiteralString(raw) {
  return raw.replace(/\\([nrtbf\\()]|[0-7]{1,3})/g, (_, esc) => {
    if (esc === 'n')  return '\n';
    if (esc === 'r')  return '\r';
    if (esc === 't')  return '\t';
    if (esc === 'b')  return '\b';
    if (esc === 'f')  return '\f';
    if (esc === '\\') return '\\';
    if (esc === '(')  return '(';
    if (esc === ')')  return ')';
    return String.fromCharCode(parseInt(esc, 8));
  });
}

/** Decode a PDF hex string <AABB...> */
function decodePdfHexString(hex) {
  const h = hex.replace(/\s/g, '').padEnd(hex.replace(/\s/g, '').length + (hex.replace(/\s/g, '').length % 2), '0');
  let out = '';
  for (let i = 0; i < h.length; i += 2) out += String.fromCharCode(parseInt(h.slice(i, i + 2), 16));
  return out;
}

/**
 * Extract key→value pairs from a PDF Info dictionary.
 * Searches the entire file for /Key (literal) or /Key <hex> patterns.
 * Returns null if the file doesn't look like a PDF.
 */
function parsePdfInfoDict(filePath) {
  const buf  = fs.readFileSync(filePath);
  const text = buf.toString('latin1');

  if (!text.startsWith('%PDF-')) return null;

  const info = {};
  // Match /Key followed by a literal string (...)  or hex string <...>
  const re = /\/([A-Za-z]+)\s*(?:\(([^)]*(?:\\.[^)]*)*)\)|<([0-9A-Fa-f\s]*)>)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const key = m[1];
    const val = m[2] !== undefined
      ? decodePdfLiteralString(m[2])
      : decodePdfHexString(m[3]);
    // Keep first occurrence (Info dict appears before xref in well-formed PDFs)
    if (!(key in info)) info[key] = val;
  }
  return info;
}

// PDF date format: D:YYYYMMDDHHmmSS followed by optional timezone
const PDF_DATE_RE = /^D:\d{14}/;

function validatePDFMetadata() {
  const errors = [];
  if (!fs.existsSync(PDF_DIR)) return errors;

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    const info     = parsePdfInfoDict(filePath);

    if (!info) {
      errors.push(`${file}: not a valid PDF`);
      continue;
    }

    const stem            = path.basename(file, '.pdf');
    const expectedTitle   = `dot to dot printable ${stem}`;
    const expectedWebsite = 'https://www.dottodotfreeprintables.com/';

    if (info['Title'] !== expectedTitle) {
      errors.push(
        `${file}: PDF Title must be "${expectedTitle}" (got ${JSON.stringify(info['Title'] ?? '<missing>')})`
      );
    }
    if (info['Website'] !== expectedWebsite) {
      errors.push(
        `${file}: PDF Website must be "${expectedWebsite}" (got ${JSON.stringify(info['Website'] ?? '<missing>')})`
      );
    }
    if (!info['CreationDate'] || !PDF_DATE_RE.test(info['CreationDate'])) {
      errors.push(
        `${file}: PDF CreationDate must be PDF date format D:YYYYMMDDHHmmSS… (got ${JSON.stringify(info['CreationDate'] ?? '<missing>')})`
      );
    }
  }

  return errors;
}

// ── PDF validation ────────────────────────────────────────────────────────────
function validatePDFs() {
  const errors = [];
  if (!fs.existsSync(PDF_DIR)) return errors;

  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    const sizeKB   = fileSizeKB(filePath);

    if (sizeKB > PDF_MAX_KB) {
      errors.push(`${file}: ${kb(sizeKB * 1024)} exceeds ${PDF_MAX_KB} KB limit`);
    }

    const size = parsePdfPageSize(filePath);
    if (!size) {
      errors.push(`${file}: could not read MediaBox — is this a valid PDF?`);
      continue;
    }

    const isA4         = file.endsWith('_A4.pdf');
    const stemFile      = isA4 ? file.slice(0, -'_A4.pdf'.length) + '.pdf' : file;
    const isHorizontal = stemFile.endsWith('-horizontal.pdf');
    const [baseW, baseH] = isA4 ? [A4_PAGE_W_PT, A4_PAGE_H_PT] : [PDF_PAGE_W_PT, PDF_PAGE_H_PT];
    const expectedW = isHorizontal ? baseH : baseW;
    const expectedH = isHorizontal ? baseW : baseH;
    const pageLabel = isA4 ? 'A4' : 'US Letter';
    const wOk = Math.abs(size.w - expectedW) <= PDF_TOL_PT;
    const hOk = Math.abs(size.h - expectedH) <= PDF_TOL_PT;
    if (!wOk || !hOk) {
      errors.push(
        `${file}: page must be ${pageLabel} ${isHorizontal ? 'landscape' : 'portrait'} ` +
        `(${expectedW}×${expectedH} pt), ` +
        `got ${size.w.toFixed(1)}×${size.h.toFixed(1)} pt — ` +
        `redesign on US Letter; keep content inside 540×684 pt safe zone so A4 users can print too`
      );
    }
  }

  return errors;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const imgErrors  = await validateImages();
const pdfErrors  = validatePDFs();
const pdfMetaErr = validatePDFMetadata();
const pngErrors  = validatePNGMetadata();
const all = [...imgErrors, ...pdfErrors, ...pdfMetaErr, ...pngErrors];

if (all.length === 0) {
  console.log('✓ All assets passed validation.');
} else {
  console.error('\n✗ Asset validation failed:\n');
  all.forEach(e => console.error('  •', e));
  console.error(`\n${all.length} error(s) found. Fix before building.\n`);
  process.exit(1);
}
