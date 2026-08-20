import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { routing } from '../i18n/routing.ts';

const contentDir = path.resolve('content');
const sourceLocale = 'en';
const sourceFiles = readdirSync(path.join(contentDir, sourceLocale))
  .filter((file) => file.endsWith('.json'))
  .sort();

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function isPlaceholderLocale(locale) {
  // UI message strings (including plurals) aren't a standalone messages.json —
  // i18n/request.ts builds them by merging content/en/common.json with each
  // locale's content/{locale}/home.json `body`, so that's where translated
  // content actually lives.
  const home = readJson(path.join(contentDir, locale, 'home.json'));
  if (Object.keys(home.body ?? {}).length > 0) return false;

  return sourceFiles
    .filter((file) => file !== 'home.json')
    .every((file) => {
      const data = readJson(path.join(contentDir, locale, file));
      return Array.isArray(data) && data.length === 0;
    });
}

function readListArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));
  if (!arg) return null;
  return arg.slice(prefix.length).split(',').map((value) => value.trim()).filter(Boolean);
}

const requestedLocales = readListArg('locales') ?? (process.env.ALIGNMENT_LOCALES
  ? process.env.ALIGNMENT_LOCALES.split(',').map((locale) => locale.trim()).filter(Boolean)
  : null);

const requestedProjects = readListArg('projects') ?? (process.env.ALIGNMENT_PROJECTS
  ? process.env.ALIGNMENT_PROJECTS.split(',').map((project) => project.trim()).filter(Boolean)
  : null);

// Only locales that are actually routed (i18n/routing.ts) are eligible for the
// default sweep — a content/<locale> directory can exist (e.g. an in-progress
// module scaffold) without being live. Explicit --locales=/ALIGNMENT_LOCALES
// still bypasses this, same as before.
const locales = requestedLocales ?? readdirSync(contentDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .filter((locale) => routing.locales.includes(locale))
  .filter((locale) => !isPlaceholderLocale(locale));

const playwrightCli = path.resolve('node_modules/@playwright/test/cli.js');
const projects = requestedProjects ?? ['pixel-7'];

// A run that stops producing output (a hung page load, a webServer that never
// becomes ready, etc.) will otherwise sit silently until someone notices. We
// watch for output activity and kill+fail fast instead of hanging forever.
const PROGRESS_CHECK_INTERVAL_MS = 60_000;
const STALL_THRESHOLD_MS = 5 * 60_000;

function runPlaywright(args, label) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [playwrightCli, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      // tests/i18n-layout.spec.ts only builds describe blocks for non-en/ar
      // locales when this is set — without it, --grep for any other locale
      // matches zero tests and Playwright exits with "No tests found".
      env: { ...process.env, I18N_FULL_LOCALE_SWEEP: '1' }
    });

    let lastActivity = Date.now();
    let killedForStall = false;

    child.stdout.on('data', (chunk) => {
      lastActivity = Date.now();
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      lastActivity = Date.now();
      process.stderr.write(chunk);
    });

    const watchdog = setInterval(() => {
      const idleMs = Date.now() - lastActivity;
      const idleMin = (idleMs / 60_000).toFixed(1);
      if (idleMs > STALL_THRESHOLD_MS) {
        console.error(`\n[watchdog] ${label}: no output for ${idleMin} min — treating as stuck, killing.`);
        killedForStall = true;
        clearInterval(watchdog);
        child.kill('SIGKILL');
      } else {
        console.log(`[watchdog] ${label}: progressing (last output ${idleMin} min ago)`);
      }
    }, PROGRESS_CHECK_INTERVAL_MS);
    watchdog.unref();

    child.on('error', (error) => {
      clearInterval(watchdog);
      resolve({ status: 1, error, killedForStall });
    });

    child.on('close', (code) => {
      clearInterval(watchdog);
      resolve({ status: killedForStall ? 1 : code, killedForStall });
    });
  });
}

for (const locale of locales) {
  for (const project of projects) {
    console.log(`\nRunning mobile alignment for ${locale} on ${project}...`);

    const args = [
      'test',
      '--config=playwright.i18n.config.ts',
      '--project',
      project,
      '--grep',
      `${locale} all pages alignment`,
      '--reporter=list',
      '--workers=1'
    ];

    const result = await runPlaywright(args, `${locale} on ${project}`);

    if (result.error) {
      console.error(`Failed to start Playwright for ${locale} on ${project}: ${result.error.message}`);
      process.exit(1);
    }

    if (result.killedForStall) {
      console.error(`\nMobile alignment for ${locale} on ${project} was stuck (no progress for ${STALL_THRESHOLD_MS / 60_000} min) and was killed.`);
      process.exit(1);
    }

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

console.log(`\nMobile alignment passed for ${locales.length} locale(s) on ${projects.length} project(s): ${locales.join(', ')}`);
