import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SITE_URL, buildAlternates } from '@/lib/seo';
import { LocalizedAboutPage } from '@/components/LocalizedLegalPages';
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
  const arabicSeo = localizedStaticSeo(locale, 'about');
  return {
    title: arabicSeo?.title ?? (locale === 'uk' ? 'Про нас — хто створює безкоштовні головоломки' : 'About Us - Who Makes These Free Dot-to-Dot Printables'),
    description: arabicSeo?.description ?? 'DotToDotFreePrintables.com creates free printable connect-the-dots worksheets for kids. Learn who makes the puzzles, how each page is tested, and why everything is free.',
    alternates: buildAlternates(locale, '/about')
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await loadLegalContent(locale);

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: legal.about.title,
    url: `${SITE_URL}/${locale}/about/`,
    inLanguage: locale,
    description: legal.about.intro,
    mainEntity: {
      '@type': 'Organization',
      name: 'DotToDotFreePrintables',
      url: SITE_URL,
      email: 'hellokidsbookworld@gmail.com',
      description: legal.about.intro,
      member: {
        '@type': 'Person',
        name: 'Mira',
        url: `${SITE_URL}/${locale}/about/#mira`,
        description: legal.about.guides
      }
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <LocalizedAboutPage legal={legal} />
    </>
  );
}
