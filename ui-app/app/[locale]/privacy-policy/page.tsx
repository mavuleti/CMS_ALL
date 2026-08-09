import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { buildAlternates } from '@/lib/seo';
import { LocalizedPrivacyPage } from '@/components/LocalizedLegalPages';
import { loadLegalContent } from '@/lib/legal';
import { localizedStaticSeo } from '@/lib/localized-seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const arabicSeo = localizedStaticSeo(locale, 'privacy');
  return {
    title: arabicSeo?.title ?? (locale === 'uk' ? 'Політика конфіденційності' : 'Privacy Policy'),
    description: arabicSeo?.description ?? 'Privacy policy for DotToDotFreePrintables.com: what data we collect (analytics cookies), how it is used, children’s privacy, advertising, and your rights.',
    alternates: buildAlternates(locale, '/privacy-policy')
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);
  return <><LocalizedPrivacyPage legal={legal} /></>;
}
