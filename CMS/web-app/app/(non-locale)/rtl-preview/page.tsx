import type { Metadata } from 'next';

// See app/(non-locale)/page.tsx for why this doesn't use next/navigation's
// redirect() — same static-export incompatibility, same meta-refresh fix.
export const metadata: Metadata = {
  title: 'Redirecting… | DotToDotFreePrintables.com',
  description: 'This page has moved. Redirecting to the English homepage.',
  robots: { index: false, follow: true }
};

export default function RtlPreviewPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/en/" />
      {/* This route sits outside [locale] and always redirects to /en/, so it never
          has a locale context to route text through next-intl — English is correct here. */}
      {/* eslint-disable no-restricted-syntax -- utility redirect page outside [locale], see file-level comment above */}
      <main style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h1>Redirecting…</h1>
        <p>
          If you are not redirected automatically, <a href="/en/">click here to continue</a>.
        </p>
      </main>
      {/* eslint-enable no-restricted-syntax */}
    </>
  );
}
