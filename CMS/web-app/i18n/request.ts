import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { mergeMessages } from '@/lib/i18n/merge-messages';
import { getHomeExport } from '@/lib/export-content';

async function loadMessages(locale: string) {
  const home = (await import('../content/en/home.json')).default;
  const common = (await import('../content/en/common.json')).default;
  const baseMessages = mergeMessages(home.body, common);
  const localizedHome = getHomeExport(locale);
  return mergeMessages(baseMessages, localizedHome.body ?? {});
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
