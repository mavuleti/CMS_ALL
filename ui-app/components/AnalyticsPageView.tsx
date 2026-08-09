'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsPageView() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const pagePath = `${pathname}${query ? `?${query}` : ''}`;
    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title
    });
  }, [pathname, query]);

  return null;
}
