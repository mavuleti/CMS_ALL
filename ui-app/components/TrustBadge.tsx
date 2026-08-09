import counts from '@/lib/download-counts.json';
import { TRUST_BADGE_MIN_DEVICES } from '@/lib/social-proof-config';
import { getTranslations } from 'next-intl/server';

export default async function TrustBadge({ locale }: { locale: string }) {
  const total = Number((counts as { global?: { totalUniqueDevices?: number } }).global?.totalUniqueDevices ?? 0);
  if (total < TRUST_BADGE_MIN_DEVICES) return null;
  const t = await getTranslations({ locale, namespace: 'common' });
  const label = t('joinTeachers', { count: total.toLocaleString(locale) });
  return <p className="eyebrow" aria-label={label}>{label}</p>;
}
