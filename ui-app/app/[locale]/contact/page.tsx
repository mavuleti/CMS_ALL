import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SITE_URL, buildAlternates } from '@/lib/seo';
import { UkContactPage } from '@/components/UkLegalPages';
import { LocalizedContactPage } from '@/components/LocalizedLegalPages';
import { loadLegalContent } from '@/lib/legal';
import { localizedStaticSeo } from '@/lib/localized-seo';

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
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const legal = await loadLegalContent(locale);
  return <><LocalizedContactPage legal={legal} /></>;
  if (locale === 'uk') return <><UkContactPage /></>;

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
      <main>
        <section className="section" style={{ maxWidth: '72ch', margin: '0 auto' }}>
          <h1>{t('title')}</h1>
          <p>
            {t('intro')}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>

          <h2>{t('topicsTitle')}</h2>
          <p>
            <strong>{t('requestsTitle')}</strong> {t('requests')}
          </p>
          <p>
            <strong>{t('correctionsTitle')}</strong> {t('corrections')}
          </p>
          <p>
            <strong>{t('licensingTitle')}</strong> {t('licensing')}{' '}
            {t.rich('licensingNote', { link: (chunks) => <Link href={`/${locale}/terms/`}>{chunks}</Link> })}
          </p>
          <p>
            <strong>{t('feedbackTitle')}</strong> {t('feedback')}
          </p>

          <h2>{t('responseTitle')}</h2>
          <p>
            {t('response')}
          </p>

          <p>
            {t('aboutPrefix')} <Link href={`/${locale}/about/`}>{t('aboutLink')}</Link>.
          </p>
        </section>
      </main>
    </>
  );
}
