import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { LocalizedPrivacyPage } from '@/components/LocalizedLegalPages';
import { loadLegalContent } from '@/lib/legal';
import { localizedStaticSeo } from '@/lib/json-seo';
import { buildCommonHeaderMetadata } from '@/components/templates/CommonHeaderTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const arabicSeo = localizedStaticSeo(locale, 'privacy');
  const title = arabicSeo?.title ?? (locale === 'uk' ? 'Політика конфіденційності' : 'Privacy Policy');
  const description = arabicSeo?.description ?? 'Privacy policy for DotToDotFreePrintables.com: what data we collect (analytics cookies), how it is used, children’s privacy, advertising, and your rights.';
  return buildCommonHeaderMetadata({ locale, path: '/privacy-policy', title, description, type: 'website' });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);
  return <><LocalizedPrivacyPage legal={legal} /></>;
}
