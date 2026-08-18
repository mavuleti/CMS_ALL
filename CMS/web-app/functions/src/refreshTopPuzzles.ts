import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

export const refreshTopPuzzles = onSchedule('every 1 hours', async () => {
  if (!getApps().length) initializeApp();
  const snapshot = await getFirestore().collection('puzzles')
    .orderBy('totalClickCount', 'desc').limit(10).get();
  const top = snapshot.docs.map((doc) => ({
    puzzleId: doc.id,
    totalClickCount: doc.get('totalClickCount') ?? 0
  }));
  await getFirestore().doc('stats/top_puzzles').set({ top, updatedAt: new Date() });
});
