// Every image in public/images/completed/ must carry the clean XMP block written by
// TOOLS/image/process_completed_puzzle.py (dc:title, dc:creator, xmpRights:Owner set to
// SITE_NAME, no EXIF/IPTC/ICC) -- see completed-cute-car-dot-to-dot-printable.webp as the
// reference pattern. This only reads embedded metadata; it never re-encodes or edits image
// bytes. Wired into `prebuild` so a "completed puzzle" image dropped in without running that
// tool fails the build loudly instead of shipping camera/device metadata or an empty title.
import { readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SITE_NAME = 'DotToDotFreePrintables.com';
const DIR = path.resolve('public/images/completed');

function xmpField(xmp, tag) {
  const match = xmp.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<rdf:li[^>]*>([^<]*)</rdf:li>`));
  return match?.[1]?.trim() ?? '';
}

async function main() {
  const files = readdirSync(DIR).filter((f) => /\.(webp|jpe?g|png)$/i.test(f));
  const problems = [];

  for (const file of files) {
    const meta = await sharp(path.join(DIR, file)).metadata();
    if (meta.exif) problems.push(`${file}: has EXIF data (should be stripped)`);
    if (meta.iptc) problems.push(`${file}: has IPTC data (should be stripped)`);
    if (meta.hasProfile) problems.push(`${file}: has an ICC profile (should be stripped)`);
    if (!meta.xmp) {
      problems.push(`${file}: missing XMP metadata entirely`);
      continue;
    }
    const xmp = meta.xmp.toString('utf8');
    const title = xmpField(xmp, 'dc:title');
    const creator = xmpField(xmp, 'dc:creator');
    const owner = xmpField(xmp, 'xmpRights:Owner');
    if (!title) problems.push(`${file}: missing dc:title`);
    if (creator !== SITE_NAME) problems.push(`${file}: dc:creator is "${creator}", expected "${SITE_NAME}"`);
    if (owner !== SITE_NAME) problems.push(`${file}: xmpRights:Owner is "${owner}", expected "${SITE_NAME}"`);
  }

  if (problems.length > 0) {
    console.error(`FAILED: ${problems.length} problem(s) in public/images/completed/:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error('\nRun TOOLS/image/process_completed_puzzle.py on the offending file(s) with a real --title, then rebuild.');
    process.exit(1);
  }

  console.log(`OK: all ${files.length} image(s) in public/images/completed/ have clean, correctly-attributed metadata.`);
}

main();
