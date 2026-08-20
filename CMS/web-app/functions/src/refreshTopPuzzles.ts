import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

export const refreshTopPuzzles = onSchedule('every 1 hours', async () => {
  if (!getApps().length) initializeApp();
  const snapshot = await getFirestore().collection('puzzleDistributionCounts')
    .orderBy('onlineDistributionCount', 'desc').limit(10).get();
  const top = snapshot.docs.map((doc) => ({
    puzzleId: doc.id,
    offlineDistributionCount: doc.get('offlineDistributionCount') ?? 0,
    onlineDistributionCount: doc.get('onlineDistributionCount') ?? 0
  }));
  await getFirestore().doc('stats/top_puzzles').set({ top, updatedAt: new Date() });
});
