import '../globals.css';
import BrowserErrorTracker from '@/components/BrowserErrorTracker';

// Root layout for the handful of routes outside [locale] (/, /rtl-preview) —
// both just redirect to /en/, so a static lang="en" is correct here. The
// locale-aware root layout lives at app/[locale]/layout.tsx; Next.js allows
// multiple root layouts via route groups like this one.
export default function NonLocaleRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrowserErrorTracker />
        {children}
      </body>
    </html>
  );
}
