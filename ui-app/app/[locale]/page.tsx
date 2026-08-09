import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localizedSiteSeo } from '@/lib/localized-seo';
import HomeDiscovery from '@/components/HomeDiscovery';
import TopDownloadsLeaderboard from '@/components/TopDownloadsLeaderboard';
import { puzzles } from '@/lib/site-data';
import { AudienceStrip, BenefitsSection, BlogPreview, CategoryGrid, Feedback, FaqSection, HomeVideoSection, HowToSection, TrustSection } from '@/components/sections';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { isPuzzlePageAvailable } from '@/lib/section-locales';

function availablePuzzlesForLocale(locale: string) {
  return puzzles.filter((puzzle) => {
    const [section, slug] = puzzle.href.split('/').filter(Boolean);
    return isPuzzlePageAvailable(locale, `${section}/`, slug);
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const arabicSeo = localizedSiteSeo(locale);
  const description = arabicSeo?.description ?? 'Free dot-to-dot printable puzzles and connect-the-dots worksheets for kids, preschoolers, parents, and teachers.';
  const featuredNames = [
    'T-Rex 61-Dot Challenge',
    'Mermaid',
    'Jellyfish',
    'Cute Puppy',
    'Slide Playground',
    'Snowdrop Flower',
    'Dashing Car Playground',
    'Lotus Flower'
  ];
  const localePuzzles = availablePuzzlesForLocale(locale);
  const featuredPuzzles = featuredNames
    .map((name) => localePuzzles.find((puzzle) => puzzle.name === name))
    .filter((puzzle): puzzle is (typeof puzzles)[number] => Boolean(puzzle));
  const homeUrl = `${SITE_URL}/${locale}/`;
  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
    name: SITE_NAME, url: SITE_URL, description, inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` }
  };
  const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME, url: SITE_URL, description,
    logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png'), width: 512, height: 512 },
    sameAs: ['https://www.pinterest.com/hellokidsbookworld/', 'https://www.facebook.com/dottodotfreeprintables', 'https://www.youtube.com/@hellokidsbookworld']
  };
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList', '@id': `${homeUrl}#featured-puzzles`,
    name: 'Featured free dot-to-dot printables', numberOfItems: featuredPuzzles.length,
    itemListElement: featuredPuzzles.map((puzzle, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: {
        '@type': ['CreativeWork', 'LearningResource'], name: puzzle.name,
        url: `${SITE_URL}/${locale}${puzzle.href}`, image: absoluteUrl(puzzle.image),
        isAccessibleForFree: true, learningResourceType: 'Printable worksheet',
        educationalLevel: puzzle.age, inLanguage: locale
      }
    }))
  };
  const collectionPageSchema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${homeUrl}#webpage`,
    url: homeUrl, name: arabicSeo?.title ?? 'Free Dot to Dot Printables for Kids', description,
    inLanguage: locale, isPartOf: { '@id': `${SITE_URL}/#website` },
    primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(DEFAULT_OG_IMAGE.url) },
    mainEntity: { '@id': `${homeUrl}#featured-puzzles` }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <main id="main-content" className="home-page-main" tabIndex={-1}>
        <HomeDiscovery locale={locale} featuredPuzzles={featuredPuzzles} />
        <div className="legacy-home-content">
          <HomeVideoSection />
          <TopDownloadsLeaderboard locale={locale} variant="columns" />
          <CategoryGrid excludeIds={['flowers', 'cute', 'playgrounds', 'dinosaurs', 'ocean']} includeBlog />
          <BenefitsSection />
          <HowToSection />
          <TrustSection />
          <FaqSection />
          <BlogPreview />
          <Feedback />
          <AudienceStrip />
        </div>
      </main>
    </>
  );
}
