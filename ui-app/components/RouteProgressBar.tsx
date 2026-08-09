'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Top-of-page loading bar for route transitions. Next.js App Router gives no
 * built-in "navigation started/finished" event, so this infers it: a same-tab
 * click on an internal link starts the bar (creeping toward 90% so it never
 * looks stuck on a slow route), and the next pathname/search-params change
 * (React committing the new route) completes and fades it.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const creepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      if (creepTimer.current) clearInterval(creepTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);

      setVisible(true);
      setProgress(15);
      creepTimer.current = setInterval(() => {
        setProgress((value) => (value < 90 ? value + (90 - value) * 0.1 : value));
      }, 200);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!visible) return;

    if (creepTimer.current) clearInterval(creepTimer.current);
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div className="route-progress-track" aria-hidden="true">
      <div
        className="route-progress-bar"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0
        }}
      />
    </div>
  );
}
