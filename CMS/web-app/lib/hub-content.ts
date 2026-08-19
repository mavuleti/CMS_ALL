// Age/skill hub pages cut across the theme-based category taxonomy (Dinosaurs,
// Ocean, ...) to answer "dot to dot for a 5 year old" / "easy dot to dot
// printables" style searches directly. Structural fields (range/tier/slug/
// min/max) live here; the translated copy (h1/intro/seoTitle/seoDescription)
// is DB-backed content routed through the mapping_audit_hub.db -> export
// pipeline -- see lib/export-content.ts's getHubDocument and
// exporter/export/export_locale_content.py's export_hub_bundle. Every locale
// must have real, non-empty translated text; a missing/empty field throws
// rather than silently falling back (see web-app/CLAUDE.md).

import { getHubDocument, type HubSlug } from '@/lib/export-content';

export type AgeHub = { range: string; min: number; max: number; slug: HubSlug };
export type DifficultyHub = { tier: 'easy' | 'medium' | 'hard'; slug: HubSlug; min: number; max: number };
export type HubText = { h1: string; intro: string; seoTitle: string; seoDescription: string };

export const AGE_HUBS: AgeHub[] = [
  { range: '4-6', min: 4, max: 6, slug: 'hub-ages-4-6' },
  { range: '7-9', min: 7, max: 9, slug: 'hub-ages-7-9' },
  { range: '9-12', min: 9, max: 12, slug: 'hub-ages-9-12' }
];

export const DIFFICULTY_HUBS: DifficultyHub[] = [
  { tier: 'easy', slug: 'hub-difficulty-easy-1-20-dots', min: 1, max: 20 },
  { tier: 'medium', slug: 'hub-difficulty-medium-21-60-dots', min: 21, max: 60 },
  { tier: 'hard', slug: 'hub-difficulty-hard-61-plus-dots', min: 61, max: Infinity }
];

// Difficulty hub route params still use the old "easy-1-20-dots" style
// slugs in the URL (see app/[locale]/difficulty/[tier]/page.tsx) -- keep
// that route shape unchanged while the DB/document slug gets the
// "hub-difficulty-..." prefix to disambiguate from other export documents.
export const DIFFICULTY_ROUTE_SLUG: Record<DifficultyHub['tier'], string> = {
  easy: 'easy-1-20-dots',
  medium: 'medium-21-60-dots',
  hard: 'hard-61-plus-dots'
};

function readHubText(slug: HubSlug, locale: string): HubText {
  const document = getHubDocument(slug, locale);
  const body = document?.body ?? {};
  const { h1, intro, seoTitle, seoDescription } = body;
  const missing = (['h1', 'intro', 'seoTitle', 'seoDescription'] as const).filter(
    (field) => typeof body[field] !== 'string' || body[field].trim() === ''
  );
  if (missing.length > 0) {
    throw new Error(`Missing hub text for ${slug} (${locale}): ${missing.join(', ')}`);
  }
  return { h1, intro, seoTitle, seoDescription };
}

export function getAgeHubText(locale: string, range: string): HubText | undefined {
  const hub = AGE_HUBS.find((item) => item.range === range);
  if (!hub) return undefined;
  return readHubText(hub.slug, locale);
}

export function getDifficultyHubText(locale: string, routeSlug: string): HubText | undefined {
  const hub = DIFFICULTY_HUBS.find((item) => DIFFICULTY_ROUTE_SLUG[item.tier] === routeSlug);
  if (!hub) return undefined;
  return readHubText(hub.slug, locale);
}
