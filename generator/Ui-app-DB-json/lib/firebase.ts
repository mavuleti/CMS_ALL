import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions, httpsCallable, httpsCallableFromURL } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let emulatorsConnected = false;
let appCheckInitialized = false;

async function getReadyFirebaseClients() {
  const app = getApps()[0] ?? initializeApp(config);
  const auth = getAuth(app);
  const functions = getFunctions(app);
  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
  if (!emulatorsConnected && useEmulator && typeof window !== 'undefined') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    emulatorsConnected = true;
  }
  if (!appCheckInitialized && !useEmulator && typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    appCheckInitialized = true;
  }
  if (!auth.currentUser) await signInAnonymously(auth);
  return { app, auth, functions, useEmulator };
}

export async function recordPuzzleDownload(puzzleId: string, locale?: string): Promise<void> {
  if (!config.projectId || !config.apiKey) return;
  const { functions, useEmulator } = await getReadyFirebaseClients();
  // In production, route through the Hosting rewrite so the function receives
  // the X-Country-Code header Firebase Hosting attaches to rewritten requests.
  const recordDownload = useEmulator
    ? httpsCallable(functions, 'recordDownload')
    : httpsCallableFromURL(functions, `${window.location.origin}/api/record-download`);
  await recordDownload({ puzzleId, locale });
}

// productId must match a key in functions/src/stripeProducts.ts.
// Returns the Stripe Checkout URL to redirect the browser to, or null if unavailable.
export async function startPuzzlePackCheckout(productId: string, locale = 'en'): Promise<string | null> {
  if (!config.projectId || !config.apiKey) return null;
  const { functions } = await getReadyFirebaseClients();
  const createCheckoutSession = httpsCallable<{ productId: string; locale: string }, { url: string }>(
    functions,
    'createCheckoutSession'
  );
  const result = await createCheckoutSession({ productId, locale });
  return result.data.url;
}

// Returns a signed download URL (valid ~24h) for a completed Stripe Checkout session,
// or null if the session hasn't finished processing yet (caller should retry).
export async function getPurchaseDownloadLink(sessionId: string): Promise<string | null> {
  if (!config.projectId || !config.apiKey) return null;
  const { functions } = await getReadyFirebaseClients();
  const getDownloadLink = httpsCallable<{ sessionId: string }, { url: string; expiresAt: number }>(
    functions,
    'getDownloadLink'
  );
  try {
    const result = await getDownloadLink({ sessionId });
    return result.data.url;
  } catch (error) {
    if ((error as { code?: string }).code === 'functions/failed-precondition') return null;
    throw error;
  }
}
