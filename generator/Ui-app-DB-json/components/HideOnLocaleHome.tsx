'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function HideOnLocaleHome({ locale, children }: { locale: string; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === `/${locale}` || pathname === `/${locale}/`) return null;
  return children;
}
