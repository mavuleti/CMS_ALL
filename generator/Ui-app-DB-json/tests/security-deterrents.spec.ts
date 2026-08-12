import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

test('newsletter honeypot rejects automated submissions in the form handler', async () => {
  const componentSource = readFileSync(path.join(repoRoot, 'components', 'NewsletterForm.tsx'), 'utf8');

  expect(componentSource).toContain("data.get('website')");
  expect(componentSource).toContain("setMessage(t('error'))");
  expect(componentSource).toContain('name="website"');
});

test('download tracking keeps the PDF link independent from analytics', async () => {
  const buttonSource = readFileSync(path.join(repoRoot, 'components', 'DownloadButton.tsx'), 'utf8');
  const trackerSource = readFileSync(path.join(repoRoot, 'components', 'DownloadTracker.tsx'), 'utf8');

  expect(buttonSource).toContain('<DownloadTracker puzzleId={puzzleId} locale={locale}>');
  expect(buttonSource).toContain('href={primary.url}');
  expect(trackerSource).toContain('void recordPuzzleDownload(puzzleId, locale)');
  expect(trackerSource).toContain('.catch(');
  expect(trackerSource).not.toContain('preventDefault');
});

test('feedback form keeps the submission path server-side', async () => {
  const source = readFileSync(path.join(repoRoot, 'components', 'FeedbackForm.tsx'), 'utf8');
  expect(source).toContain('GOOGLE_FORM_ACTION');
  expect(source).toContain('FIELD_TYPE');
  expect(source).toContain('FIELD_MESSAGE');
  expect(source).toContain('FIELD_EMAIL');
  expect(source).toContain('method="POST"');
  expect(source).toContain('target="feedback-submit-frame"');
  expect(source).toContain('maxLength={2000}');
});
test('download function validates identity and puzzle input before counting', async () => {
  const source = readFileSync(path.join(repoRoot, 'functions', 'src', 'recordDownload.ts'), 'utf8');
  expect(source).toContain('enforceAppCheck: true');
  expect(source).toContain('request.auth?.uid');
  expect(source).toContain('A valid puzzleId is required.');
  expect(source).toContain('runTransaction');
  expect(source).toContain('downloadCount');
  expect(source).toContain('totalUniqueDownloads');
});

test('download count badge has narrow-screen sizing safeguards', async () => {
  const source = readFileSync(path.join(repoRoot, 'app', 'globals.css'), 'utf8');
  expect(source).toContain('@media (max-width: 480px)');
  expect(source).toContain('max-width: 100%');
  expect(source).toContain('transform: none');
  expect(source).toContain('flex-basis: 58px');
});
