// Maps our internal product IDs to Stripe Price IDs (test or live, matching STRIPE_SECRET_KEY's mode)
// and to the private Storage object delivered after purchase.
// Create the Product + Price in the Stripe Dashboard first, then paste the price_... id here,
// and upload the deliverable to the given storagePath in the default Storage bucket.
export const STRIPE_PRODUCTS: Record<string, { priceId: string; name: string; storagePath: string }> = {
  'premium-puzzle-pack': {
    priceId: process.env.STRIPE_PRICE_PREMIUM_PUZZLE_PACK ?? '',
    name: 'Best of 2026 Dot-to-Dot Collection',
    storagePath: 'premium/best-of-2026-dot-to-dot-free-printables-com.pdf'
  }
};
