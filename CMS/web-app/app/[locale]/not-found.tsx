import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import NotFoundContent from '@/components/NotFoundContent';

// Rendered when notFound() is thrown from anywhere within a [locale] route
// during the static build (e.g. a category/slug the loader decides is
// unavailable for this locale). Arbitrary unmatched URLs that were never
// part of generateStaticParams don't reach this component at all — those
// are served from the static out/{locale}/404.html files that
// scripts/strip-next-runtime.mjs publishes from app/[locale]/404-page.
export default async function LocaleNotFound({ params }: { params?: Promise<{ locale: string }> }) {
  const requested = (await params)?.locale;
  const locale = requested && hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  setRequestLocale(locale);
  return <NotFoundContent locale={locale} />;
}
