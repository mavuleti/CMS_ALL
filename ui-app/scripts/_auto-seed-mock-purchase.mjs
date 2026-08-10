// Watches the Auth emulator for new anonymous users (created when a browser
// tab loads the site) and immediately seeds a "completed" Stripe checkout
// session for each one under a fixed session ID. Lets you open
// http://localhost:3000/en/purchase/success/?session_id=mock-test-session
// in your own browser and see a real, working download link — no Stripe
// call ever happens.
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const PROJECT_ID = 'dottodot-7ab01';
const SESSION_ID = 'mock-test-session';

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
if (!getApps().length) initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

const seeded = new Set();

async function tick() {
  const res = await fetch(
    `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:query?key=fake-api-key`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, body: JSON.stringify({ returnUserInfo: true }) }
  );
  if (!res.ok) {
    console.error('Auth emulator query failed:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  const users = data.userInfo ?? [];
  for (const user of users) {
    const uid = user.localId;
    if (seeded.has(uid)) continue;
    await db.doc(`users/${uid}/checkoutSessions/${SESSION_ID}`).set({
      productId: 'premium-puzzle-pack',
      status: 'completed',
      completedAt: FieldValue.serverTimestamp()
    });
    seeded.add(uid);
    console.log(`Seeded mock paid session for uid ${uid} -> open http://localhost:3000/en/purchase/success/?session_id=${SESSION_ID}`);
  }
}

console.log(`Watching for anonymous sign-ins. Open http://localhost:3000/en/purchase/success/?session_id=${SESSION_ID} in your browser.`);
setInterval(() => { tick().catch((e) => console.error('tick failed:', e.message)); }, 1500);
