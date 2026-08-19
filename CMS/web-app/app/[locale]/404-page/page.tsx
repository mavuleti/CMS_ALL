import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import NotFoundContent from '@/components/NotFoundContent';

// Not a real user-facing route (never linked in navigation or the sitemap).
// It exists purely so `next build` renders a genuinely localized "not found"
// page per locale under static export, which scripts/strip-next-runtime.mjs
// then copies to out/{locale}/404.html so Firebase Hosting's per-directory
// 404.html lookup serves a real, localized 404 (with a real HTTP 404 status)
// for any unmatched path under that locale, instead of a soft-redirect.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('notFound');
  return {
    title: t('heading'),
    robots: { index: false, follow: false }
  };
}

export default async function NotFoundStaticPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotFoundContent locale={locale} />;
}
