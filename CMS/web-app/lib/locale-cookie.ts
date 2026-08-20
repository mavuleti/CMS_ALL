export const PREFERRED_LOCALE_COOKIE = 'preferred-locale';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function getPreferredLocaleCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${PREFERRED_LOCALE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setPreferredLocaleCookie(locale: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${PREFERRED_LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}
