import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { buildAlternates } from '@/lib/seo';
import { LocalizedTermsPage } from '@/components/LocalizedLegalPages';
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
  const arabicSeo = localizedStaticSeo(locale, 'terms');
  return {
    title: arabicSeo?.title ?? (locale === 'uk' ? 'Умови використання' : 'Terms of Use'),
    description: arabicSeo?.description ?? 'Terms of use for DotToDotFreePrintables.com: free personal and classroom printing, what requires permission, intellectual property, and disclaimers.',
    alternates: buildAlternates(locale, '/terms')
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);
  return <><LocalizedTermsPage legal={legal} /></>;
}
