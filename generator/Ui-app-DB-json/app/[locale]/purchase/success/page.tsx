import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import PurchaseDownloadLink from '@/components/PurchaseDownloadLink';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'purchase' });
  return { title: t('success.metaTitle'), robots: { index: false, follow: false } };
}

export default async function PurchaseSuccessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('purchase');
  return (
    <>
      <main className="purchase-status-page">
        <section className="purchase-status-card">
        <p className="eyebrow">{t('success.eyebrow')}</p>
        <h1>{t('success.heading')}</h1>
        <p className="purchase-status-lede">{t('success.lede')}</p>
        <Suspense fallback={null}>
          <PurchaseDownloadLink />
        </Suspense>
        </section>
      </main>
    </>
  );
}
