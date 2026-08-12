import { Suspense } from 'react';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import LocaleHtml from '@/components/LocaleHtml';
import RouteProgressBar from '@/components/RouteProgressBar';
import GlobalSkipLink from '@/components/GlobalSkipLink';
import AnalyticsPageView from '@/components/AnalyticsPageView';
import TopDownloadsLeaderboard from '@/components/TopDownloadsLeaderboard';
import HideOnLocaleHome from '@/components/HideOnLocaleHome';
import FloatingShare from '@/components/FloatingShare';
import { Navbar, Footer } from '@/components/sections';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getCollections } from '@/lib/export-content';
import type { Metadata, Viewport } from 'next';

const GA_ID = 'G-RCRTCLP0CF';
// This is a static export — NEXT_PUBLIC_* vars are baked into the HTML at
// build time, not read at runtime. There are two named build modes (see
// package.json), and this flag is the only thing that tells them apart:
//   npm run prod-local  -> NEXT_PUBLIC_ENABLE_ANALYTICS=false, build + serve
//                          the static export on localhost, no GA hits
//   npm run prod-deploy -> NEXT_PUBLIC_ENABLE_ANALYTICS=true, build + deploy
//                          to Firebase Hosting, real GA hits
// .env.local defaults this to false so a plain `npm run build` (CI,
// Playwright, ad-hoc local builds) never ships analytics either. Do NOT gate
// this on NODE_ENV — `next build` always sets NODE_ENV=production for every
// mode, so it can't distinguish them. If you change this gate, verify with a
// real build that `googletagmanager` does/doesn't appear in out/**/*.html.
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

// Routable locales with only English-fallback placeholder content (see I18N.md).
// Excluded from hreflang/OG alternates and the sitemap until real translations land.
const PLACEHOLDER_LOCALES: string[] = [];

// All non-placeholder routable locales pass i18n content validation, so they're
// announced as alternates — matches the locale set already declared in sitemap.xml.
const FULLY_TRANSLATED_LOCALES = routing.locales.filter((l) => !PLACEHOLDER_LOCALES.includes(l));
const ARABIC_REGIONAL_ALIASES = ['ar-AE', 'ar-SA', 'ar-QA'];

const localeToHtmlLang: Record<string, string> = {
  en: 'en',
  fr: 'fr-FR',
  es: 'es',
  de: 'de-DE',
  pt: 'pt-PT',
  it: 'it-IT',
  nl: 'nl-NL',
  sv: 'sv-SE',
  no: 'no-NO',
  pl: 'pl-PL',
  da: 'da-DK',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  hu: 'hu-HU',
  ro: 'ro-RO',
  tr: 'tr-TR',
  ar: 'ar',
  'pt-BR': 'pt-BR',
  el: 'el-GR',
  uk: 'uk-UA',
  hr: 'hr-HR',
  sk: 'sk-SK',
  lt: 'lt-LT',
  lv: 'lv-LV',
  sl: 'sl-SI',
  id: 'id-ID',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  th: 'th-TH',
  vi: 'vi-VN'
};
const localeToOgLocale: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  pt: 'pt_PT',
  it: 'it_IT',
  nl: 'nl_NL',
  sv: 'sv_SE',
  no: 'no_NO',
  pl: 'pl_PL',
  da: 'da_DK',
  fi: 'fi_FI',
  cs: 'cs_CZ',
  hu: 'hu_HU',
  ro: 'ro_RO',
  tr: 'tr_TR',
  ar: 'ar_SA',
  'pt-BR': 'pt_BR',
  el: 'el_GR',
  uk: 'uk_UA',
  hr: 'hr_HR',
  sk: 'sk_SK',
  lt: 'lt_LT',
  lv: 'lv_LV',
  sl: 'sl_SI',
  id: 'id_ID',
  ja: 'ja_JP',
  ko: 'ko_KR',
  ru: 'ru_RU',
  th: 'th_TH',
  vi: 'vi_VN'
};
const languageSwitcherScript = `
(function () {
  var locales = ${JSON.stringify(routing.locales)};

  function switchLocale(nextLocale) {
    if (!nextLocale || locales.indexOf(nextLocale) === -1) return;

    var parts = window.location.pathname.split('/');
    if (locales.indexOf(parts[1]) !== -1) {
      parts[1] = nextLocale;
    } else {
      parts.splice(1, 0, nextLocale);
    }

    window.location.assign(parts.join('/') + window.location.search + window.location.hash);
  }

  document.addEventListener('change', function (event) {
    var target = event.target;
    if (target && target.matches && target.matches('[data-language-select]')) {
      switchLocale(target.value);
    }
  });
})();
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff9f0'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = localeToOgLocale[locale] ?? 'en_US';
  const isArabicRegionalAlias = ARABIC_REGIONAL_ALIASES.includes(locale);
  const exportCollections = getCollections();
  const title = 'Free Dot-to-Dot Printables for Kids';
  const ogTitle = title;
  const description = exportCollections.map((collection) => collection.body.description).filter(Boolean).slice(0, 2).join(' ');
  const arabicSeo = false;
  const ogImage = arabicSeo
    ? {
        ...DEFAULT_OG_IMAGE,
        alt: locale === 'es'
          ? 'Ficha gratuita de unir puntos lista para imprimir para niños'
          : locale === 'de'
            ? 'Kostenlose druckbare Punkt-zu-Punkt-Vorlage für Kinder'
            : locale === 'ru'
              ? 'Бесплатное задание по точкам для детей для печати'
              : 'ورقة توصيل نقاط مجانية قابلة للطباعة للأطفال'
      }
    : DEFAULT_OG_IMAGE;

  return {
    ...(isArabicRegionalAlias ? { robots: { index: false, follow: true } } : {}),
    metadataBase: new URL(SITE_URL),
    manifest: '/manifest.webmanifest',
    title: {
      default: title,
      template: '%s | DotToDotFreePrintables.com'
    },
    description,
    verification: {
      other: {
        'msvalidate.01': 'B681C0C723F28F15919D6170A9C0E054',
        'google-adsense-account': 'ca-pub-8007137365521327'
      }
    },
    icons: {
      icon: [
        { url: '/favicon.ico?v=previous-dot-icon' },
        { url: '/favicon.svg?v=previous-dot-icon', type: 'image/svg+xml' },
        { url: '/favicon-16x16.png?v=previous-dot-icon', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png?v=previous-dot-icon', sizes: '32x32', type: 'image/png' }
      ],
      apple: [{ url: '/apple-touch-icon.png?v=previous-dot-icon', sizes: '180x180', type: 'image/png' }],
      other: [
        { rel: 'icon', url: '/icon-192.png?v=previous-dot-icon', sizes: '192x192', type: 'image/png' },
        { rel: 'icon', url: '/icon-512.png?v=previous-dot-icon', sizes: '512x512', type: 'image/png' }
      ]
    },
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ...Object.fromEntries(FULLY_TRANSLATED_LOCALES.filter((l) => !ARABIC_REGIONAL_ALIASES.includes(l)).map((l) => [l, `/${l}/`])),
        ...(false
          ? Object.fromEntries(ARABIC_REGIONAL_ALIASES.map((l) => [l, `/${l}/`]))
          : {}),
        'x-default': `/${routing.defaultLocale}/`
      }
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `/${locale}/`,
      siteName: SITE_NAME,
      type: 'website',
      locale: ogLocale,
      alternateLocale: FULLY_TRANSLATED_LOCALES
        .filter((l) => l !== locale)
        .map((l) => localeToOgLocale[l] ?? l),
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImage.url]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const htmlLang = localeToHtmlLang[locale] ?? locale;
  const isArabic = false;
  return (
    <>
      <LocaleHtml locale={htmlLang} />
      {isArabic && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap"
          />
        </>
      )}
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <NextIntlClientProvider messages={messages}>
        <GlobalSkipLink />
        <Navbar />
        {children}
        <HideOnLocaleHome locale={locale}>
          <TopDownloadsLeaderboard locale={locale} />
        </HideOnLocaleHome>
        <FloatingShare />
        <Footer />
      </NextIntlClientProvider>
      <script dangerouslySetInnerHTML={{ __html: languageSwitcherScript }} />
      {ANALYTICS_ENABLED && <>
      <Suspense fallback={null}><AnalyticsPageView /></Suspense>
      <Script id="google-analytics" strategy="lazyOnload">
        {/* eslint-disable no-restricted-syntax -- inline JS source for the <Script> tag, not user-facing text */}
        {`
          (function() {
            // Skip analytics for automated browsers (Playwright/Selenium tests),
            // local/dev hosts, and sessions opted out via localStorage.
            if (navigator.webdriver) return;
            var host = location.hostname;
            if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return;
            try { if (localStorage.getItem('disable-analytics') === 'true') return; } catch (e) {}
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          })();
        `}
        {/* eslint-enable no-restricted-syntax */}
      </Script>
      </>}
    </>
  );
}



