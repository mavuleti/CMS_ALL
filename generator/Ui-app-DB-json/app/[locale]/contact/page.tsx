import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SITE_URL, buildAlternates } from '@/lib/seo';
import { LocalizedContactPage } from '@/components/LocalizedLegalPages';
import { loadLegalContent } from '@/lib/legal';
import { localizedStaticSeo } from '@/lib/json-seo';

type Props = {
  params: Promise<{ locale: string }>;
};

const CONTACT_EMAIL = 'hellokidsbookworld@gmail.com';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const arabicSeo = localizedStaticSeo(locale, 'contact');
  return {
    title: arabicSeo?.title ?? (locale === 'uk' ? 'Контакти' : 'Contact Us'),
    description: arabicSeo?.description ?? 'Contact DotToDotFreePrintables with puzzle requests, corrections, licensing questions, or feedback about our free printable dot-to-dot worksheets.',
    alternates: buildAlternates(locale, '/contact')
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact DotToDotFreePrintables',
    url: `${SITE_URL}/${locale}/contact/`,
    mainEntity: {
      '@type': 'Organization',
      name: 'DotToDotFreePrintables',
      url: SITE_URL,
      email: CONTACT_EMAIL
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <LocalizedContactPage legal={legal} />
    </>
  );
}
