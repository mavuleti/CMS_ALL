/**
 * modules/arabic/RtlProvider.tsx
 * -----------------------------------------------------------------------
 * Standalone RTL wrapper for isolated QA. Sets `dir="rtl"` and `lang="ar"`
 * on a wrapping <div> (client-safe, no next-intl / routing dependency) so
 * any content rendered inside picks up modules/arabic/rtl.css overrides
 * and correct bidi behavior from the browser.
 *
 * This component is intentionally standalone: it does NOT touch
 * `app/[locale]/layout.tsx` or the real <html> element. It's used only by
 * `app/rtl-preview/page.tsx` in Phase A. During the Phase B merge (see
 * MERGE_PLAN.md), the *real* `dir` attribute gets set directly on <html>
 * in the locale layout — this component can then either be deleted or
 * repurposed for isolated component-level previews/storybook-style checks.
 * -----------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

type RtlProviderProps = {
  children: ReactNode;
  /** Override the wrapper element's tag, defaults to 'div'. */
  as?: 'div' | 'section' | 'main';
  className?: string;
};

export default function RtlProvider({ children, as = 'div', className }: RtlProviderProps) {
  const Tag = as;

  return (
    <Tag dir="rtl" lang="ar" className={['rtl-provider', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
