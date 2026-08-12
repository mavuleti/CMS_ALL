// Bypasses Stripe entirely (mocks "payment always succeeds") to test the
// download half of the purchase flow: sign a URL for the private PDF in
// Storage and fetch it, the same way functions/src/getDownloadLink.ts does
// once it has decided a Checkout session is paid.
//
// Requires local Google credentials with Storage access, e.g.:
//   gcloud auth application-default login
//
// Usage: node scripts/test-pdf-download.mjs

import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { initializeApp, getApps } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const PROJECT_ID = 'dottodot-7ab01';
const STORAGE_PATH = 'premium/best-of-2026-dot-to-dot-free-printables-com.pdf';

if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID, storageBucket: `${PROJECT_ID}.firebasestorage.app` });
}

const file = getStorage().bucket().file(STORAGE_PATH);

const [exists] = await file.exists();
if (!exists) {
  throw new Error(`Object not found at gs://${PROJECT_ID}.firebasestorage.app/${STORAGE_PATH}. Upload the PDF first.`);
}

const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 5 * 60 * 1000 });
console.log(`Signed URL (5 min): ${url}`);

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Download failed: HTTP ${response.status}`);
}
const contentType = response.headers.get('content-type');
const buffer = Buffer.from(await response.arrayBuffer());
const isPdf = buffer.subarray(0, 5).toString('ascii') === '%PDF-';

console.log(`HTTP ${response.status}, Content-Type: ${contentType}, bytes: ${buffer.length}, starts with %PDF-: ${isPdf}`);
if (!isPdf) throw new Error('Downloaded content is not a valid PDF.');

console.log('PDF download test passed: the private file is reachable and downloadable via a signed URL.');
