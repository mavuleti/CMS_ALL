import { routing } from '@/i18n/routing';
import { isPuzzlePageAvailable } from '@/lib/section-locales';

const INTERNAL_CONTENT_LINK_RE = /\bhref=(["'])(\/(?!\/)[^"']*)\1/g;
const INTERNAL_CONTENT_ANCHOR_RE = /<a\b([^>]*\bhref=(["'])(\/(?!\/)[^"']*)\2[^>]*)>([\s\S]*?)<\/a>/gi;
const NON_PAGE_PATH_RE = /\.(?:css|js|json|png|jpe?g|webp|svg|ico|pdf|xml|txt)(?:[?#]|$)/i;

export function localizeHtmlLinks(html: string, locale: string) {
  const safeHtml = html.replace(
    INTERNAL_CONTENT_ANCHOR_RE,
    (match, _attributes: string, _quote: string, href: string, label: string) => {
      const path = href.split(/[?#]/, 1)[0];
      const segments = path.split('/').filter(Boolean);
      const [section, slug] = segments;
      const alreadyLocalized = routing.locales.some(
        (knownLocale) => href === `/${knownLocale}` || href.startsWith(`/${knownLocale}/`)
      );

      if (!alreadyLocalized && segments.length === 2 && !isPuzzlePageAvailable(locale, `${section}/`, slug)) {
        return `<span data-link-audit-suppressed="${encodeURIComponent(href)}">${label}</span>`;
      }

      return match;
    }
  );

  return safeHtml.replace(INTERNAL_CONTENT_LINK_RE, (match, quote: string, href: string) => {
    const path = href.split(/[?#]/, 1)[0];

    if (
      href.startsWith(`/${locale}/`) ||
      href === `/${locale}` ||
      href.startsWith('/_next/') ||
      href.startsWith('/assets/') ||
      href.startsWith('/images/') ||
      href.startsWith('/sitemap.xml') ||
      NON_PAGE_PATH_RE.test(path) ||
      routing.locales.some((knownLocale) => href === `/${knownLocale}` || href.startsWith(`/${knownLocale}/`))
    ) {
      return match;
    }

    return `href=${quote}/${locale}${href}${quote}`;
  });
}
