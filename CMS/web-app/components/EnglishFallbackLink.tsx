'use client';

import { usePathname } from 'next/navigation';
import { setPreferredLocaleCookie } from '@/lib/locale-cookie';

// The full LanguageSwitcher is production-hidden (see LanguageSwitcher.tsx —
// an existing, deliberate product decision), so a visitor auto-redirected to
// their browser language has no in-UI way back to English. This is a small,
// always-visible escape hatch: only rendered when the current locale isn't
// English, since an English-browser visitor has nothing to switch away from.
export default function EnglishFallbackLink({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();

  if (currentLocale === 'en') return null;

  const rest = pathname.replace(new RegExp(`^/${currentLocale}(?=/|$)`), '');
  const href = `/en${rest}`;

  return (
    <a
      href={href}
      className="english-fallback-link"
      onClick={() => setPreferredLocaleCookie('en')}
    >
      {/* A language's own self-referential name, same as LanguageSwitcher.tsx's FULL_LOCALE_NAMES entries — not translatable copy. */}
      {'English'}
    </a>
  );
}
