'use client';

import { useEffect } from 'react';

const rtlLocales = new Set(['ar', 'fa']);
const arabicRegionalAliases = new Set(['ar-AE', 'ar-SA', 'ar-QA']);

export default function LocaleHtml({ locale }: { locale: string }) {
  useEffect(() => {
    const pathLocale = window.location.pathname.split('/').filter(Boolean)[0] ?? locale;
    const htmlLocale = arabicRegionalAliases.has(pathLocale) ? pathLocale : locale;

    document.documentElement.lang = htmlLocale;
    document.documentElement.dir = rtlLocales.has(locale) || arabicRegionalAliases.has(htmlLocale) ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
