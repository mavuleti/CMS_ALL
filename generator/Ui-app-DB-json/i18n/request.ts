import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { mergeMessages } from '@/lib/i18n/merge-messages';

async function loadMessages() {
  const home = (await import('../content/en/home.json')).default;
  const common = (await import('../content/en/common.json')).default;
  return mergeMessages(home.body, common);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages()
  };
});
