import type { Metadata } from 'next';
import Image from 'next/image';
import { Check, Download, FileText, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

import BuyButton from '@/components/BuyButton';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'purchase' });
  return { title: t('premium.metaTitle'), description: t('premium.metaDescription') };
}

export default async function PremiumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('purchase');
  const benefits = ['onePdf', 'kidFriendly', 'paperSizes', 'instantAccess', 'classroomUse'] as const;

  return (
    <>
      <main className="premium-page">
        <section className="premium-hero">
          <div className="premium-copy">
            <p className="eyebrow"><Sparkles size={18} /> {t('premium.eyebrow')}</p>
            <h1>{t('premium.heading')}</h1>
            <p className="premium-lede">{t('premium.lede')}</p>
            <div className="premium-proof">
              <span><FileText size={18} /> {t('premium.digitalPdf')}</span>
              <span><Printer size={18} /> {t('premium.printAtHome')}</span>
              <span><Download size={18} /> {t('premium.instantAccess')}</span>
            </div>
          </div>
          <aside className="premium-offer" aria-label={t('premium.purchaseAria')}>
            <div className="premium-cover">
              <Image
                src="/images/best-of-2026-dot-to-dot-book-cover.webp"
                alt={t('premium.coverAlt')}
                fill
                sizes="(max-width: 760px) 88vw, 420px"
                priority
              />
            </div>
            <div className="premium-price-row">
              <div className="premium-sale-price">
                <span className="premium-sale-label">{t('shared.specialSale')}</span>
                <del>$9.00</del>
                <span className="premium-price">$5.00</span>
                <span className="premium-once"> {t('premium.oneTime')}</span>
              </div>
              <span className="premium-format">{'PDF'}</span>
            </div>
            <BuyButton productId="premium-puzzle-pack" locale={locale} label={t('premium.buyButton')} />
            <p className="local-test-note">{t('premium.localNote')}</p>
          </aside>
        </section>
        <section className="premium-details" aria-labelledby="included-title">
          <div>
            <p className="eyebrow">{t('premium.detailsEyebrow')}</p>
            <h2 id="included-title">{t('premium.detailsHeading')}</h2>
            <p>{t('premium.detailsText')}</p>
          </div>
          <ul className="premium-checklist">
            {benefits.map((benefit) => <li key={benefit}><Check size={20} /> {t(`premium.benefits.${benefit}`)}</li>)}
          </ul>
        </section>
        <section className="premium-guarantee">
          <ShieldCheck size={34} />
          <div><h2>{t('premium.guaranteeHeading')}</h2><p>{t('premium.guaranteeText')}</p></div>
        </section>
      </main>
    </>
  );
}
