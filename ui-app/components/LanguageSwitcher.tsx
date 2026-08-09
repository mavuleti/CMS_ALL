'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const FULL_LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  pl: 'Polski',
  da: 'Dansk',
  fi: 'Suomi',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  tr: 'Türkçe',
  'pt-BR': 'Português (Brasil)',
  el: 'Ελληνικά',
  ar: 'العربية',
  uk: 'Українська',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  sl: 'Slovenščina',
  id: 'Bahasa Indonesia', ja: 'Japanese', ko: 'Korean', ru: 'Russian', th: 'Thai', vi: 'Vietnamese',
  // add new locales here as they're enabled in i18n/routing.ts
};

const COMPACT_LOCALE_NAMES: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
  de: 'DE',
  pt: 'PT',
  it: 'IT',
  nl: 'NL',
  sv: 'SV',
  no: 'NO',
  pl: 'PL',
  da: 'DA',
  fi: 'FI',
  cs: 'CS',
  hu: 'HU',
  ro: 'RO',
  tr: 'TR',
  'pt-BR': 'BR',
  el: 'EL',
  ar: 'AR',
  uk: 'UK',
  hr: 'HR',
  sk: 'SK',
  lt: 'LT',
  lv: 'LV',
  sl: 'SL', id: 'ID', ja: 'JA', ko: 'KO', ru: 'RU', th: 'TH', vi: 'VI',
};

function getVisibleLocales(currentLocale: string) {
  // Keep the complete language list visible on the default page so visitors
  // can discover every published locale. On localized pages, keep the menu
  // focused on English and the language represented by the current URL.
  return currentLocale === 'en' ? [...routing.locales] : ['en', currentLocale];
}

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const t = useTranslations('languageSwitcher');
  const pathname = usePathname();
  const router = useRouter();
  const routableLocales = routing.locales as readonly string[];
  const visibleLocales = getVisibleLocales(currentLocale);
  const [isMobile, setIsMobile] = useState(false);
  const [isLocalDevelopment, setIsLocalDevelopment] = useState(false);

  useEffect(() => {
    const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
    setIsLocalDevelopment(localHosts.has(window.location.hostname));
    const query = window.matchMedia('(max-width: 640px)');
    const syncMobileState = () => setIsMobile(query.matches);

    syncMobileState();
    query.addEventListener('change', syncMobileState);
    return () => query.removeEventListener('change', syncMobileState);
  }, [currentLocale, routableLocales]);

  if (!isLocalDevelopment || visibleLocales.length < 2) {
    return null;
  }

  return (
    <div className="lang-switcher" aria-label={t('label')}>
      <svg
        className="lang-globe"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <select
        className="lang-select"
        data-language-select
        value={currentLocale}
        onChange={(event) => {
          const nextLocale = event.target.value;

          if (typeof window !== 'undefined') {
            // Strip stray regional/invalid locale-like segments (e.g. "ar-QA",
            // "ar-AE", "ar-UA") anywhere in the path — these are hreflang-only
            // tags, not real routes, and should never survive a locale switch.
            const segments = window.location.pathname
              .split('/')
              .filter((segment) => routableLocales.includes(segment) || !/^[a-z]{2}-[a-z]{2}$/i.test(segment));

            if (routableLocales.includes(segments[1])) {
              segments[1] = nextLocale;
            } else {
              segments.splice(1, 0, nextLocale);
            }

            window.location.assign(`${segments.join('/')}${window.location.search}${window.location.hash}`);
            return;
          }

          router.replace(pathname, { locale: nextLocale });
        }}
        aria-label={t('selectLabel')}
      >
        {visibleLocales.map((loc) => (
          <option key={loc} value={loc}>
            {isMobile
              ? COMPACT_LOCALE_NAMES[loc] ?? loc.toUpperCase()
              : FULL_LOCALE_NAMES[loc] ?? loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
