import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { mergeMessages } from '@/lib/i18n/merge-messages';

async function loadMessages(locale: string) {
  const en = (await import('../content/en/messages.json')).default;
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeMessages = (await import(`../content/${contentLocale}/messages.json`)).default;
  return mergeMessages(en, localeMessages);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale)
  };
});
