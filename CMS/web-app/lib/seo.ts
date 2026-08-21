import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import puzzle1200Manifest from '@/lib/puzzle-1200-manifest.json';

const puzzle1200Sources = new Set<string>(puzzle1200Manifest);

// Google's large-image-preview / Discover eligibility wants og:image at
// 1200px+ (see TODO-seo.md). Puzzle originals are 800px; use the real
// 1200px crop (extracted from that puzzle's print PDF — see
// scripts/generate-1200px-puzzle-images.mjs) for social/search sharing
// when one exists, and fall back to the 800px original otherwise.
export function ogImageFor(image: string | undefined): string | undefined {
  if (!image || !image.endsWith('-puzzle.webp')) return image;
  const variant = image.replace(/\.webp$/, '-1200.webp');
  return puzzle1200Sources.has(image) ? variant : image;
}

export const SITE_URL = 'https://dottodotfreeprintables.com';
export const SITE_NAME = 'DotToDotFreePrintables.com';

export function absoluteUrl(path: string) {
  return path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const DEFAULT_OG_IMAGE = {
  url: absoluteUrl('/images/trex-61-puzzle-1200.webp'),
  width: 1200,
  height: 900,
  alt: 'Free dot-to-dot printable worksheet for kids'
};

// Routable locales intentionally held out of indexing/hreflang for now.
// These all have real, complete translations (every locale does, per the
// full-translation launch policy) — this isn't about incomplete content,
// it's a deliberate crawl-focus decision (2026-08-21): concentrate Google's
// crawl/indexing attention on the locales with actual measured traffic
// (en/de/fi/es/da) plus strategic-growth languages (fr/ar/ja) while GSC data
// showed indexing was thin across the board, not just in secondary locales.
// Reversible: remove a locale from this list once it's worth re-indexing.
// Keep this list in sync with PLACEHOLDER_LOCALES in app/[locale]/layout.tsx,
// app/[locale]/blog/[slug]/page.tsx, and PLACEHOLDER_LOCALES in
// scripts/generate-sitemap.mjs — all four must agree or pages end up
// sending contradictory hreflang/noindex/sitemap signals to search engines.
const PLACEHOLDER_LOCALES: string[] = [
  'az', 'cs', 'el', 'fa', 'hr', 'hu', 'id', 'it', 'ko', 'lt', 'lv', 'nl',
  'no', 'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
];

// All non-placeholder routable locales pass i18n content validation, so they're
// announced as alternates — matches the locale set already declared in sitemap.xml.
const FULLY_TRANSLATED_LOCALES = routing.locales.filter((l) => !PLACEHOLDER_LOCALES.includes(l));

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
  'pt-BR': 'pt_BR',
  el: 'el_GR',
  ar: 'ar_SA',
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

function localeHasOwnPage(locale: string, _normalizedPath: string) {
  // Ui-app-DB-json generates its localized pages from mapping-check/export,
  // not the legacy content/<locale> tree used by dot-to-dot-web. Every locale
  // admitted to this metadata helper has already been materialized by the
  // route's generateStaticParams, so it owns the requested page.
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

/**
 * Builds a locale-aware canonical + hreflang alternates block for a page.
 * `path` is the locale-agnostic path (no leading locale segment), e.g. '/dinosaurs' or '/dinosaurs/trex-61'.
 */
export function buildAlternates(locale: string, path: string) {
  // The site is served with trailingSlash:true, so every non-root canonical/
  // hreflang URL must end in '/' — otherwise it points at a URL that 301s to
  // itself-with-slash, which is exactly the "Page with redirect" / canonical
  // mismatch Search Console flags.
  const normalizedPath = path === '/' || path === '' ? '' : path.endsWith('/') ? path : `${path}/`;
  const alternateLocales = FULLY_TRANSLATED_LOCALES.filter((l) => localeHasOwnPage(l, normalizedPath));
  const canonicalLocale = localeHasOwnPage(locale, normalizedPath) ? locale : routing.defaultLocale;
  const languages: Record<string, string> = {
    ...Object.fromEntries(
      alternateLocales.map((l) => [l, `/${l}${normalizedPath}`])
    ),
    'x-default': `/${routing.defaultLocale}${normalizedPath}`
  };

  return {
    canonical: `/${canonicalLocale}${normalizedPath}`,
    languages
  };
}

/**
 * Rich JSON-LD for a puzzle detail page: CreativeWork + LearningResource with
 * free-access, educational and downloadable-PDF signals for search engines and
 * AI assistants (AEO/GEO). `path` is the locale-agnostic path, e.g.
 * '/dinosaurs/trex-61-dot-to-dot-puzzle'.
 */
export function puzzleJsonLd(opts: {
  locale: string;
  path: string;
  name: string;
  description: string;
  age?: string;
  dots?: number;
  image?: string;
  pdf?: string;
}) {
  const normalizedPath = opts.path.endsWith('/') ? opts.path : `${opts.path}/`;
  const url = absoluteUrl(`/${opts.locale}${normalizedPath}`);
  const ageRange = opts.age?.match(/(\d+)\s*[–-]\s*(\d+)/);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['CreativeWork', 'LearningResource'],
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: opts.locale,
    creator: { '@type': 'Organization', name: 'DotToDotFreePrintables', url: SITE_URL },
    learningResourceType: 'Worksheet',
    educationalUse: 'practice',
    teaches: 'number sequencing, counting, fine motor skills, pencil control',
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    isAccessibleForFree: true,
    isFamilyFriendly: true
  };

  if (opts.age) schema.educationalLevel = opts.age;
  if (ageRange) schema.typicalAgeRange = `${ageRange[1]}-${ageRange[2]}`;
  if (opts.image && opts.image.startsWith('/')) {
    schema.image = {
      '@type': 'ImageObject',
      url: absoluteUrl(opts.image),
      width: 800,
      height: 679,
      caption: `${opts.name} free dot-to-dot printable worksheet for kids`,
      creator: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL
      },
      // Licensing signals: qualifies previews for Google Images' "Licensable"
      // badge/flow and tells AI engines the usage terms + who to credit.
      license: absoluteUrl(`/${opts.locale}/terms/`),
      acquireLicensePage: url,
      creditText: SITE_NAME,
      copyrightNotice: SITE_NAME
    };
  }
  if (opts.pdf && opts.pdf.startsWith('/')) {
    schema.associatedMedia = {
      '@type': 'DigitalDocument',
      name: `${opts.name} printable PDF`,
      contentUrl: absoluteUrl(opts.pdf),
      encodingFormat: 'application/pdf',
      isAccessibleForFree: true
    };
  }

  return schema;
}

/**
 * HowTo JSON-LD built from a puzzle's dotGuide sections (AEO/GEO): each guide
 * section ("1–15 — The Head and Floppy Ears") becomes a HowToStep, so answer
 * engines can quote a step-by-step "how to complete this puzzle" walkthrough.
 * Only emit when a dotGuide with sections exists — schema must mirror the
 * visible on-page guide.
 */
export function howToJsonLd(opts: {
  locale: string;
  path: string;
  name: string;
  dots?: number;
  intro?: string;
  sections: { range: string; title: string; learn: string }[];
}) {
  const normalizedPath = opts.path.endsWith('/') ? opts.path : `${opts.path}/`;
  const url = absoluteUrl(`/${opts.locale}${normalizedPath}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to complete the ${opts.name}${opts.dots ? ` (${opts.dots} dots)` : ''}`,
    ...(opts.intro ? { description: opts.intro.replace(/<[^>]+>/g, '') } : {}),
    url,
    inLanguage: opts.locale,
    isAccessibleForFree: true,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: 0 },
    supply: [{ '@type': 'HowToSupply', name: 'Printed puzzle PDF (Letter or A4)' }],
    tool: [{ '@type': 'HowToTool', name: 'Pencil' }],
    step: opts.sections.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `${s.range} — ${s.title}`,
      text: s.learn,
      url: `${url}#dot-guide`
    }))
  };
}

export function ogLocaleFor(locale: string) {
  return localeToOgLocale[locale] ?? 'en_US';
}

export function ogAlternateLocalesFor(locale: string) {
  return FULLY_TRANSLATED_LOCALES.filter((l) => l !== locale).map((l) => ogLocaleFor(l));
}
