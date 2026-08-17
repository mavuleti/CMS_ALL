'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

/**
 * The first control in the document. Existing pages own their main landmark;
 * this component gives that landmark a stable target without duplicating IDs
 * across dozens of page templates.
 */
export default function GlobalSkipLink() {
  const pathname = usePathname();
  const commonT = useTranslations('common');

  useEffect(() => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    if (!main.id) main.id = 'main-content';
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
  }, [pathname]);

  const focusMain = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    event.preventDefault();
    if (!main.id) main.id = 'main-content';
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
    history.replaceState(null, '', `${location.pathname}${location.search}#main-content`);
    main.focus();
  };

  return <a className="global-skip-link" href="#main-content" onClick={focusMain}>{commonT('skipToContent')}</a>;
}
