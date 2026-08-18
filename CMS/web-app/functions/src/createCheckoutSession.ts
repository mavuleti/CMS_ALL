import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from './stripeProducts';

if (!getApps().length) initializeApp();
const db = getFirestore();

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const PRODUCTION_SITE_URL = process.env.SITE_URL ?? 'https://dottodotfreeprintables.com';

function getSiteUrl(requestOrigin: string | undefined) {
  if (requestOrigin && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestOrigin)) {
    return requestOrigin;
  }
  return PRODUCTION_SITE_URL.replace(/\/$/, '');
}

export const createCheckoutSession = onCall(
  { enforceAppCheck: true, secrets: [stripeSecretKey] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Anonymous authentication is required.');

    const productId = typeof request.data?.productId === 'string' ? request.data.productId.trim() : '';
    const product = STRIPE_PRODUCTS[productId];
    if (!product || !product.priceId) {
      throw new HttpsError('invalid-argument', 'Unknown or unconfigured productId.');
    }

    const locale = typeof request.data?.locale === 'string' && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(request.data.locale)
      ? request.data.locale
      : 'en';

    const stripe = new Stripe(stripeSecretKey.value());

    const siteUrl = getSiteUrl(request.rawRequest.headers.origin);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${siteUrl}/${locale}/purchase/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/purchase/cancelled/`,
      client_reference_id: uid,
      billing_address_collection: 'required',
      locale: locale === 'en' ? 'en' : locale as Stripe.Checkout.SessionCreateParams.Locale,
      metadata: { uid, productId, locale }
    });

    await db.doc(`users/${uid}/checkoutSessions/${session.id}`).set({
      productId,
      status: 'created',
      createdAt: FieldValue.serverTimestamp()
    });

    return { url: session.url };
  }
);
