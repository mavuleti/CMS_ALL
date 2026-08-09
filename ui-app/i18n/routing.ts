import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: [
    'en',
    'fr',
    'es',
    'de',
    'pt',
    'it',
    'nl',
    'sv',
    'no',
    'pl',
    'da',
    'fi',
    'cs',
    'hu',
    'ro',
    'tr',
    'pt-BR',
    'el',
    'ar',
    'uk',
    'hr',
    'sk',
    'lt',
    'lv',
    'sl',
    'id', 'ja', 'ko', 'ru', 'th', 'vi'
  ],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];
