import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'purchase' });
  return { title: t('cancelled.metaTitle'), robots: { index: false, follow: false } };
}

export default async function PurchaseCancelledPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('purchase');
  return (
    <>
      <main className="purchase-status-page">
        <section className="purchase-status-card">
        <p className="eyebrow">{t('cancelled.eyebrow')}</p>
        <h1 className="text-3xl font-bold">{t('cancelled.heading')}</h1>
        <p className="purchase-status-lede">{t('cancelled.lede')}</p>
        <a className="button secondary" href={`/${locale}/premium/`}>{t('shared.returnToPack')}</a>
        </section>
      </main>
    </>
  );
}
