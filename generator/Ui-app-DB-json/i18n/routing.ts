import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: [
    'ar', 'az', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr',
    'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl',
    'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
  ],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];
