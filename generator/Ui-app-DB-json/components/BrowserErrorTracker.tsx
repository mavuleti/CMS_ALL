'use client';

import { useEffect } from 'react';

type BrowserErrorReport = {
  type: 'error' | 'unhandledrejection' | 'resource';
  message: string;
  stack?: string;
  source?: string;
  line?: number;
  column?: number;
};

const ENDPOINT = '/api/browser-error';
const MAX_REPORTS_PER_PAGE = 10;
const enabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true';

function cleanUrl(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

function describeReason(reason: unknown): Pick<BrowserErrorReport, 'message' | 'stack'> {
  if (reason instanceof Error) {
    return { message: reason.message || reason.name, stack: reason.stack };
  }
  if (typeof reason === 'string') return { message: reason };
  try {
    return { message: JSON.stringify(reason) };
  } catch {
    return { message: String(reason) };
  }
}

export default function BrowserErrorTracker() {
  useEffect(() => {
    if (!enabled || navigator.webdriver) return;
    if (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.endsWith('.local')) return;

    let sent = 0;
    const recent = new Map<string, number>();

    const report = (details: BrowserErrorReport) => {
      if (sent >= MAX_REPORTS_PER_PAGE) return;
      const key = `${details.type}:${details.message}:${details.source ?? ''}:${details.line ?? ''}`;
      const now = Date.now();
      if (now - (recent.get(key) ?? 0) < 30_000) return;
      recent.set(key, now);
      sent += 1;

      const payload = JSON.stringify({
        ...details,
        page: cleanUrl(window.location.href),
        source: details.source ? cleanUrl(details.source) : undefined,
        userAgent: navigator.userAgent,
        language: navigator.language,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        occurredAt: new Date().toISOString()
      });

      if (navigator.sendBeacon) {
        const queued = navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
        if (queued) return;
      }
      void fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        credentials: 'omit'
      }).catch(() => {});
    };

    const onError = (event: ErrorEvent) => {
      report({
        type: 'error',
        message: event.message || 'Unknown browser error',
        stack: event.error instanceof Error ? event.error.stack : undefined,
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    };
    const onResourceError = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement)) return;
      const source = target instanceof HTMLLinkElement ? target.href : target.src;
      report({ type: 'resource', message: `Failed to load ${target.tagName.toLowerCase()} resource`, source });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      report({ type: 'unhandledrejection', ...describeReason(event.reason) });
    };

    window.addEventListener('error', onError);
    window.addEventListener('error', onResourceError, true);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('error', onResourceError, true);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
