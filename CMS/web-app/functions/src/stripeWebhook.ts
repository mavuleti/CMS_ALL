import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from './stripeProducts';

if (!getApps().length) initializeApp();
const db = getFirestore();

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

// Firebase Hosting rewrite must route raw, un-parsed bytes here so Stripe's
// signature check succeeds. See firebase.json rewrite for /api/stripe-webhook.
export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (typeof signature !== 'string') {
      res.status(400).send('Missing Stripe-Signature header.');
      return;
    }

    const stripe = new Stripe(stripeSecretKey.value());
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, stripeWebhookSecret.value());
    } catch (err) {
      res.status(400).send(`Webhook signature verification failed: ${(err as Error).message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id ?? session.metadata?.uid;
      const productId = session.metadata?.productId;
      const locale = session.metadata?.locale ?? null;
      const address = session.customer_details?.address ?? null;

      const paymentComplete = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
      if (uid && productId && STRIPE_PRODUCTS[productId] && paymentComplete) {
        const batch = db.batch();
        batch.set(db.doc(`users/${uid}/checkoutSessions/${session.id}`), {
          status: 'completed',
          completedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        batch.set(db.doc(`users/${uid}/purchases/${productId}`), {
          productId,
          sessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          locale,
          country: address?.country ?? null,
          area: address ? [address.city, address.state].filter(Boolean).join(', ') || null : null,
          postalCode: address?.postal_code ?? null,
          purchasedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        await batch.commit();
      }
    }

    res.status(200).send({ received: true });
  }
);
