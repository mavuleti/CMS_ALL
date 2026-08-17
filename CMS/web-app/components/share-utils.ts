'use client';

const PUBLIC_SITE_ORIGIN = 'https://dottodotfreeprintables.com';

export function currentShareUrl(): string {
  if (typeof window === 'undefined') return '';

  const current = new URL(window.location.href);
  const isLocalPreview =
    current.hostname === 'localhost' ||
    current.hostname === '127.0.0.1' ||
    current.hostname === '::1';

  if (!isLocalPreview) return current.href;

  return new URL(`${current.pathname}${current.search}${current.hash}`, PUBLIC_SITE_ORIGIN).href;
}

export function buildWhatsAppShareUrl(url: string, title: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
}

export function buildFacebookShareUrl(encodedUrl: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
}

export function buildPinterestShareUrl(encodedUrl: string, encodedTitle: string, encodedMedia = '') {
  const media = encodedMedia ? `&media=${encodedMedia}` : '';
  return `https://pinterest.com/pin/create/button/?url=${encodedUrl}${media}&description=${encodedTitle}`;
}

export function buildXShareUrl(encodedUrl: string, encodedTitle: string) {
  return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
}

export function openShareWindow(buildUrl: (encodedUrl: string, encodedTitle: string) => string, url: string, title: string) {
  const shareUrl = buildUrl(encodeURIComponent(url), encodeURIComponent(title));
  const popup = window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');

  if (!popup) {
    window.location.assign(shareUrl);
  }
}

export function openWhatsAppShare(url: string, title: string) {
  openShareWindow(() => buildWhatsAppShareUrl(url, title), url, title);
}

export async function copyPageUrl(url = window.location.href): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.inset = '0 auto auto -9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      return document.execCommand('copy');
    } finally {
      textarea.remove();
    }
  }
}
