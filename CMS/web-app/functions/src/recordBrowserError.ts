import { createHash } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';

if (!getApps().length) initializeApp();
const db = getFirestore();

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGE = 1_000;
const MAX_STACK = 8_000;
const MAX_SHORT = 500;
const ALLOWED_TYPES = new Set(['error', 'unhandledrejection', 'resource']);
const SECRET_PATTERN = /([?&](?:token|key|secret|auth|code|email)=)[^&\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/gi;

function text(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(SECRET_PATTERN, '$1[redacted]').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max)
    : '';
}

function urlWithoutPrivateParts(value: unknown): string {
  const raw = text(value, MAX_SHORT);
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return raw.split(/[?#]/, 1)[0];
  }
}

export const recordBrowserError = onRequest(
  { region: 'us-central1', cors: false, maxInstances: 10, timeoutSeconds: 10 },
  async (request, response) => {
    response.set('Cache-Control', 'no-store');
    if (request.method !== 'POST') {
      response.status(405).set('Allow', 'POST').send('Method not allowed');
      return;
    }
    const contentLength = Number(request.get('content-length') ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      response.status(413).send('Payload too large');
      return;
    }

    const body = request.body && typeof request.body === 'object' ? request.body : {};
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
      response.status(413).send('Payload too large');
      return;
    }
    const type = text(body.type, 40);
    const message = text(body.message, MAX_MESSAGE);
    if (!ALLOWED_TYPES.has(type) || !message) {
      response.status(400).send('Invalid error report');
      return;
    }

    const page = urlWithoutPrivateParts(body.page);
    const source = urlWithoutPrivateParts(body.source);
    const stack = text(body.stack, MAX_STACK);
    const line = Number.isSafeInteger(body.line) ? Math.max(0, Math.min(body.line, 10_000_000)) : null;
    const column = Number.isSafeInteger(body.column) ? Math.max(0, Math.min(body.column, 100_000)) : null;
    const fingerprint = createHash('sha256')
      .update([type, message, source, line ?? '', column ?? ''].join('|'))
      .digest('hex')
      .slice(0, 32);

    const errorRef = db.collection('browserErrors').doc(fingerprint);
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(errorRef);
      transaction.set(errorRef, {
        fingerprint,
        type,
        message,
        stack,
        page,
        source,
        line,
        column,
        userAgent: text(body.userAgent, MAX_SHORT),
        language: text(body.language, 40),
        viewport: text(body.viewport, 40),
        firstSeenAt: existing.exists ? existing.get('firstSeenAt') : FieldValue.serverTimestamp(),
        lastSeenAt: FieldValue.serverTimestamp(),
        count: FieldValue.increment(1),
        status: 'open'
      }, { merge: true });
    });

    response.status(202).json({ accepted: true, fingerprint });
  }
);
