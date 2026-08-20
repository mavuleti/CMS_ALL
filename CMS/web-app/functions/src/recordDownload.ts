import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

if (!getApps().length) initializeApp();
const db = getFirestore();
const PUZZLE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE = /^[a-z]{2}(?:-[A-Za-z]{2})?$/;
const COUNTRY = /^[A-Z]{2}$/;
const RATE_LIMIT_MS = 1000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_CALLS = 60;

export const recordDownload = onCall({ enforceAppCheck: true }, async (request) => {
  const uid = request.auth?.uid;
  const puzzleId = typeof request.data?.puzzleId === 'string' ? request.data.puzzleId.trim() : '';
  const rawLocale = typeof request.data?.locale === 'string' ? request.data.locale.trim() : '';
  const locale = LOCALE.test(rawLocale) ? rawLocale : 'unknown';
  // Set by Firebase Hosting when the call is routed through the /api rewrite.
  const rawCountry = String(request.rawRequest?.headers?.['x-country-code'] ?? '').toUpperCase();
  const country = COUNTRY.test(rawCountry) ? rawCountry : 'ZZ';

  if (!uid) throw new HttpsError('unauthenticated', 'Anonymous authentication is required.');
  if (!PUZZLE_ID.test(puzzleId) || puzzleId.length > 120) {
    throw new HttpsError('invalid-argument', 'A valid puzzleId is required.');
  }

  const userRef = db.doc(`users/${uid}`);
  const downloadRef = userRef.collection('downloads').doc(puzzleId);
  const distributionRef = db.doc(`puzzleDistributionCounts/${puzzleId}`);
  const globalRef = db.doc('stats/global');

  await db.runTransaction(async (transaction) => {
    const [userSnap, downloadSnap, distributionSnap] = await Promise.all([
      transaction.get(userRef),
      transaction.get(downloadRef),
      transaction.get(distributionRef)
    ]);
    const now = Date.now();
    const lastDownloadAt = userSnap.get('lastDownloadAt')?.toMillis?.() ?? 0;
    const windowStartedAt = userSnap.get('rateLimitWindowStartedAt')?.toMillis?.() ?? now;
    const callsInWindow = Number(userSnap.get('rateLimitCalls') ?? 0);
    const windowActive = now - windowStartedAt < RATE_LIMIT_WINDOW_MS;
    if ((windowActive && callsInWindow >= RATE_LIMIT_MAX_CALLS) || now - lastDownloadAt < RATE_LIMIT_MS) {
      throw new HttpsError('resource-exhausted', 'Please wait before recording another download.');
    }

    const distributionData = distributionSnap.data() ?? {};
    transaction.set(distributionRef, {
      totalClickCount: Number(distributionData.totalClickCount ?? distributionData.onlineDistributionCount ?? 0) + 1,
      offlineDistributionCount: Number(distributionData.offlineDistributionCount ?? 0),
      onlineDistributionCount: Number(distributionData.onlineDistributionCount ?? 0) + 1,
      lastDownloadedAt: FieldValue.serverTimestamp(),
      locales: { [locale]: FieldValue.increment(1) },
      countries: { [country]: FieldValue.increment(1) }
    }, { merge: true });

    const userData = {
      firstSeenAt: userSnap.exists ? userSnap.get('firstSeenAt') : FieldValue.serverTimestamp(),
      lastDownloadAt: FieldValue.serverTimestamp(),
      lastCountry: country,
      lastLocale: locale,
      rateLimitWindowStartedAt: windowActive ? (userSnap.get('rateLimitWindowStartedAt') ?? FieldValue.serverTimestamp()) : FieldValue.serverTimestamp(),
      rateLimitCalls: windowActive ? callsInWindow + 1 : 1
    };
    transaction.set(userRef, userData, { merge: true });

    if (!downloadSnap.exists) {
      transaction.set(downloadRef, { downloadedAt: FieldValue.serverTimestamp(), locale, country });
      transaction.set(distributionRef, { downloadCount: Number(distributionData.downloadCount ?? 0) + 1 }, { merge: true });
      transaction.set(globalRef, {
        totalUniqueDownloads: FieldValue.increment(1),
        totalUniqueDevices: userSnap.exists ? FieldValue.increment(0) : FieldValue.increment(1),
        locales: { [locale]: FieldValue.increment(1) },
        countries: { [country]: FieldValue.increment(1) },
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }
  });

  return { recorded: true };
});
