import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { LocalizedTermsPage } from '@/components/LocalizedLegalPages';
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
  const arabicSeo = localizedStaticSeo(locale, 'terms');
  const title = arabicSeo?.title ?? (locale === 'uk' ? 'Умови використання' : 'Terms of Use');
  const description = arabicSeo?.description ?? 'Terms of use for DotToDotFreePrintables.com: free personal and classroom printing, what requires permission, intellectual property, and disclaimers.';
  return buildCommonHeaderMetadata({ locale, path: '/terms', title, description, type: 'website' });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);
  return <><LocalizedTermsPage legal={legal} /></>;
}
