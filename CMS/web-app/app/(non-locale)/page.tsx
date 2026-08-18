import type { Metadata } from 'next';

// next/navigation's redirect() throws NEXT_REDIRECT, which the App Router only
// resolves into a real HTTP redirect on a server — with output:'export' there's
// no server, so it was being caught as an unhandled error and the static export
// shipped Next's bare error shell (no title, no h1, no lang) instead of a page.
// A meta-refresh + visible link works everywhere a static file can be served.
export const metadata: Metadata = {
  title: 'Redirecting… | DotToDotFreePrintables.com',
  description: 'This page has moved. Redirecting to the English homepage.',
  robots: { index: false, follow: true }
};

export default function RootPage() {
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
