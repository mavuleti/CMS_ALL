'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getPreferredLocaleCookie, setPreferredLocaleCookie } from '@/lib/locale-cookie';

// Runs once per tab session, and only when the visitor is on the default
// (English) route — the landing spot a bare `/` redirect sends everyone to
// first. A visitor who has explicitly navigated to any other locale path is
// left alone, so this never fights a deliberate choice mid-session.
const SESSION_FLAG = 'localeAutoRedirectChecked';

function detectBrowserLocale(supported: readonly string[]): string | null {
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const raw of candidates) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    const exact = supported.find((locale) => locale.toLowerCase() === lower);
    if (exact) return exact;

    const base = lower.split('-')[0];
    const baseMatch = supported.find((locale) => locale.toLowerCase().split('-')[0] === base);
    if (baseMatch) return baseMatch;
  }

  return null;
}

export default function LocaleAutoRedirect({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, '1');

    if (currentLocale !== routing.defaultLocale) return;

    const supported = routing.locales as readonly string[];
    const cookieLocale = getPreferredLocaleCookie();

    if (cookieLocale) {
      if (supported.includes(cookieLocale) && cookieLocale !== currentLocale) {
        const rest = pathname.replace(new RegExp(`^/${currentLocale}(?=/|$)`), '');
        window.location.replace(`/${cookieLocale}${rest}`);
      }
      return;
    }

    const detected = detectBrowserLocale(supported);
    if (detected && detected !== currentLocale) {
      setPreferredLocaleCookie(detected);
      const rest = pathname.replace(new RegExp(`^/${currentLocale}(?=/|$)`), '');
      window.location.replace(`/${detected}${rest}`);
      return;
    }

    setPreferredLocaleCookie(currentLocale);
  }, [currentLocale, pathname]);

  return null;
}
