import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from './stripeProducts';

if (!getApps().length) initializeApp();
const db = getFirestore();

const LINK_TTL_MS = 24 * 60 * 60 * 1000;
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

export const getDownloadLink = onCall({ enforceAppCheck: true, secrets: [stripeSecretKey] }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Anonymous authentication is required.');

  const sessionId = typeof request.data?.sessionId === 'string' ? request.data.sessionId.trim() : '';
  if (!sessionId) throw new HttpsError('invalid-argument', 'A valid sessionId is required.');

  const sessionRef = db.doc(`users/${uid}/checkoutSessions/${sessionId}`);
  let sessionSnap = await sessionRef.get();

  // Stripe's redirect can arrive before its webhook. Verify the Checkout
  // Session directly so a paid customer can still receive the download.
  if (!sessionSnap.exists || sessionSnap.get('status') !== 'completed') {
    const stripe = new Stripe(stripeSecretKey.value());
    let stripeSession: Stripe.Checkout.Session;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      throw new HttpsError('failed-precondition', 'This purchase has not completed yet. Please wait a moment and try again.');
    }

    const sessionUid = stripeSession.client_reference_id ?? stripeSession.metadata?.uid;
    const productId = stripeSession.metadata?.productId;
    const isPaid = stripeSession.payment_status === 'paid' || stripeSession.payment_status === 'no_payment_required';
    if (sessionUid !== uid || !productId || !STRIPE_PRODUCTS[productId] || !isPaid) {
      throw new HttpsError('failed-precondition', 'This purchase has not completed yet. Please wait a moment and try again.');
    }

    await sessionRef.set({ productId, status: 'completed' }, { merge: true });
    sessionSnap = await sessionRef.get();
  }

  const productId = sessionSnap.get('productId');
  const product = STRIPE_PRODUCTS[productId];
  if (!product) throw new HttpsError('not-found', 'Unknown product for this purchase.');

  const filename = product.storagePath.split('/').pop();
  const [url] = await getStorage().bucket().file(product.storagePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + LINK_TTL_MS,
    responseDisposition: `attachment; filename="${filename}"`
  });

  return { url, expiresAt: Date.now() + LINK_TTL_MS };
});
