import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ResponsiveImage from '@/components/ResponsiveImage';

export default async function BestOf2026BookAd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'purchase' });
  return (
    <aside className="best-of-2026-book-ad" aria-label={t('ad.advertisementAria')}>
      <Link href={`/${locale}/premium/`}>
        <ResponsiveImage
          src="/images/best-of-2026-dot-to-dot-book-cover.webp"
          alt={t('premium.coverAlt')}
          width={900}
          height={1165}
          sizes="(max-width: 520px) 92vw, 390px"
        />
        <span className="best-of-2026-book-ad__tag">{t('ad.pdfBook')}</span>
        <strong>{t('ad.bookTitle')}</strong>
        <span>{t('ad.puzzleCount')}</span>
        <b>$5.00</b>
        <span className="best-of-2026-book-ad__cta">{t('ad.viewBook')}</span>
      </Link>
    </aside>
  );
}
