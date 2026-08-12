'use client';

export type AnalyticsValue = string | number | boolean;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, parameters: Record<string, AnalyticsValue> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, parameters);
  window.dispatchEvent(new CustomEvent('site-analytics-event', { detail: { name, parameters } }));
}
