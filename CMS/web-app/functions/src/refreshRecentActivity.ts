import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

export const refreshRecentActivity = onSchedule('every 15 minutes', async () => {
  if (!getApps().length) initializeApp();
  const db = getFirestore();
  const since = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);

  const snapshot = await db.collectionGroup('downloads').where('downloadedAt', '>=', since).get();

  const byCountry: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byPuzzle: Record<string, number> = {};
  const uniqueUsers = new Set<string>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const country = String(data.country ?? 'ZZ');
    const locale = String(data.locale ?? 'unknown');
    const puzzleId = doc.id;
    const userId = doc.ref.parent.parent?.id ?? 'unknown';

    byCountry[country] = (byCountry[country] ?? 0) + 1;
    byLocale[locale] = (byLocale[locale] ?? 0) + 1;
    byPuzzle[puzzleId] = (byPuzzle[puzzleId] ?? 0) + 1;
    uniqueUsers.add(userId);
  });

  await db.doc('stats/last_24h').set({
    totalDownloads: snapshot.size,
    uniqueUsers: uniqueUsers.size,
    byCountry,
    byLocale,
    byPuzzle,
    updatedAt: new Date()
  });
});
