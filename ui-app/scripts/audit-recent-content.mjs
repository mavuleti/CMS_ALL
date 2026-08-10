import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DEFAULT_MINUTES = 10;
const SELF_PATH = 'scripts/audit-recent-content.mjs';
const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ps1',
  '.sh',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
]);

const BLOCKING_RULES = [
  {
    label: 'hateful or discriminatory slur',
    pattern:
      /\b(?:nigg(?:er|a)|kike|spic|chink|gook|faggot|wetback|raghead|sandnigger|white\s*power|heil\s+hitler|neo[- ]?nazi|ethnic\s+cleansing|racial\s+superiority)\b/i,
  },
  {
    label: 'sexual or exploitative content',
    pattern:
      /(?<![\p{L}\p{N}_])(?:rape|rapist|porn(?:ography)?|sexual\s+abuse|child\s+sexual|explicit\s+sexual|bestiality)(?![\p{L}\p{N}_])/iu,
  },
  {
    label: 'self-harm or violent threat',
    pattern:
      /\b(?:kill\s+yourself|commit\s+suicide|suicide\s+instructions?|self[- ]?harm\s+instructions?|shoot\s+up|bomb\s+instructions?|how\s+to\s+(?:make|build)\s+(?:a\s+)?bomb)\b/i,
  },
  {
    label: 'targeted hateful statement',
    pattern:
      /\b(?:hate|exterminate|eliminate|deport|kill)\s+(?:all\s+)?(?:black|white|asian|jewish|muslim|christian|gay|lesbian|transgender|disabled)\s+(?:people|persons?|men|women|children)?\b/i,
  },
];

const ADVISORY_RULES = [
  {
    label: 'potentially harsh child-facing wording',
    pattern:
      /\b(?:fatal\s+to|deadly|bone[- ]crushing|killing\s+claw|seriously\s+injur\w*|struggling\s+prey|puncture\s+wounds?|nature['’]s\s+greatest\s+weapons?)\b/i,
  },
  {
    label: 'potentially frightening child-facing scenario',
    pattern:
      /\b(?:sinking\s+(?:sailors?|ships?)|blood\s+(?:enough\s+)?to\s+fill|bathtub\s+of\s+blood)\b/i,
  },
];

function parseMinutes() {
  const value = process.argv.find((arg) => arg.startsWith('--minutes='));
  if (!value) return DEFAULT_MINUTES;

  const minutes = Number(value.slice('--minutes='.length));
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error('--minutes must be a positive number');
  }
  return minutes;
}

function gitPaths(args) {
  const output = execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split(/\r?\n/).filter(Boolean);
}

function getUncommittedPaths() {
  const paths = new Set([
    ...gitPaths(['diff', '--name-only', '--diff-filter=ACMR']),
    ...gitPaths(['diff', '--cached', '--name-only', '--diff-filter=ACMR']),
    ...gitPaths(['ls-files', '--others', '--exclude-standard']),
  ]);
  paths.delete(SELF_PATH);
  return [...paths];
}

function isRecentTextFile(file, cutoff) {
  if (!TEXT_EXTENSIONS.has(extname(file).toLowerCase())) return false;

  try {
    return statSync(resolve(ROOT, file)).mtimeMs >= cutoff;
  } catch {
    return false;
  }
}

function auditText(file, text) {
  const failures = [];
  const warnings = [];
  const lines = text.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    for (const rule of BLOCKING_RULES) {
      if (rule.pattern.test(line)) {
        failures.push({ file, line: index + 1, label: rule.label });
      }
    }
    for (const rule of ADVISORY_RULES) {
      if (rule.pattern.test(line)) {
        warnings.push({ file, line: index + 1, label: rule.label });
      }
    }
  }

  return { failures, warnings };
}

function runSelfTest() {
  const clean = auditText('clean.ts', 'export const text = "Friendly puzzle for children";');
  const blocked = auditText('blocked.ts', 'const text = "how to make a bomb";');
  const advisory = auditText('advisory.ts', 'const text = "the killing claw";');

  if (clean.failures.length || clean.warnings.length) throw new Error('clean self-test failed');
  if (blocked.failures.length !== 1) throw new Error('blocking self-test failed');
  if (advisory.warnings.length !== 1) throw new Error('advisory self-test failed');
  console.log('Recent-content audit self-test passed.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const minutes = parseMinutes();
const cutoff = Date.now() - minutes * 60_000;
const files = getUncommittedPaths().filter((file) => isRecentTextFile(file, cutoff));

if (files.length === 0) {
  console.log(`Recent-content audit passed: no uncommitted text files changed in the last ${minutes} minutes.`);
  process.exit(0);
}

const failures = [];
const warnings = [];

for (const file of files) {
  const result = auditText(file, readFileSync(resolve(ROOT, file), 'utf8'));
  failures.push(...result.failures);
  warnings.push(...result.warnings);
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning.file}:${warning.line} - ${warning.label}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Blocked: ${failure.file}:${failure.line} - ${failure.label}`);
  }
  console.error(`\nRecent-content audit failed with ${failures.length} blocking finding(s).`);
  process.exit(1);
}

const relativeFiles = files.map((file) => relative(ROOT, resolve(ROOT, file)) || file);
console.log(
  `Recent-content audit passed: checked ${relativeFiles.length} uncommitted text file(s) changed in the last ${minutes} minutes.`
);
