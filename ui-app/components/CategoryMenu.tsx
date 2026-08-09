'use client';

import { forwardRef, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Gift, Home, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type CategoryMenuItem = {
  id: string;
  href: string;
  name: string;
  color: string;
  /** Small inline "New" label under the tile text — not a floating badge. */
  isNew?: boolean;
  /** Pre-rendered on the server (lucide icon element) — falls back to an
   *  initial-letter tile if a category has no icon yet, so the menu still
   *  degrades gracefully instead of showing a blank tile. */
  icon: ReactNode | null;
};

type CategoryMenuLabels = {
  menuLabel: string;
  openMenu: string;
  closeMenu: string;
};

// A trailing slash is stripped before comparing so "/en" and "/en/" (and
// similarly for category paths) count as the same route.
function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

const CategoryTile = forwardRef<
  HTMLAnchorElement,
  { category: CategoryMenuItem; isActive: boolean; onNavigate?: () => void }
>(function CategoryTile({ category, isActive, onNavigate }, ref) {
  const commonT = useTranslations('common');
  return (
    <Link
      href={category.href}
      className="category-menu-tile"
      data-active={isActive || undefined}
      aria-current={isActive ? 'page' : undefined}
      style={{ '--accent': category.color } as React.CSSProperties}
      onClick={onNavigate}
      ref={ref}
    >
      <span className="category-menu-tile-icon" aria-hidden="true">
        {category.icon ?? category.name.charAt(0).toUpperCase()}
        {category.isNew && <span className="category-menu-tile-new">{commonT('new')}</span>}
      </span>
      <span className="category-menu-tile-label">{category.name}</span>
    </Link>
  );
});

/**
 * Visual, icon-first category navigation shared by the desktop top nav and
 * the mobile hamburger drawer. Kept intentionally flat (no sub-menus) so
 * every category is reachable in a single tap/click — see the nav redesign
 * plan in docs/ for the rationale (works for elderly and young users alike).
 */
export default function CategoryMenu({ categories, labels }: { categories: CategoryMenuItem[]; labels: CategoryMenuLabels }) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstTileRef = useRef<HTMLAnchorElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currentPath = normalizePath(pathname ?? '');
  const locale = pathname.split('/').filter(Boolean)[0] || 'en';
  const isArabic = locale === 'ar' || locale.startsWith('ar-');
  const homeT = useTranslations('homepageUi');
  const commonT = useTranslations('common');
  const footerT = useTranslations('footer');
  const homeCategoryIds = new Set(['home', 'flowers', 'cute', 'circus', 'playgrounds', 'dinosaurs', 'ocean', 'learn']);
  const visibleCategories = categories
    .filter((category) => homeCategoryIds.has(category.id))
    .map((category) => category.id === 'learn' ? { ...category, name: homeT('more') } : category);
  const drawerThemes = categories
    .filter((category) => ['flowers', 'cute', 'circus', 'playgrounds', 'dinosaurs', 'ocean', 'learn'].includes(category.id))
    .map((category) => category.id === 'playgrounds'
      ? { ...category, name: homeT('kids') }
      : category.id === 'learn'
        ? { ...category, name: homeT('more') }
        : category);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      const drawer = drawerRef.current;
      if (!drawer) return;
      const items = Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      const nextKey = event.key === 'ArrowDown'
        || (!isArabic && event.key === 'ArrowRight')
        || (isArabic && event.key === 'ArrowLeft');
      const previousKey = event.key === 'ArrowUp'
        || (!isArabic && event.key === 'ArrowLeft')
        || (isArabic && event.key === 'ArrowRight');

      if (nextKey) {
        event.preventDefault();
        items[(currentIndex + 1 + items.length) % items.length].focus();
      } else if (previousKey) {
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length].focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (event.key === 'Tab') {
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    // Move focus into the drawer for keyboard/screen-reader users.
    firstTileRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isArabic, open]);

  return (
    <>
      {/* Desktop: persistent horizontal tile bar, next to the logo row. */}
      <nav className="category-menu-bar" data-home="true" aria-label={labels.menuLabel}>
        {visibleCategories.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            isActive={normalizePath(category.href) === currentPath}
          />
        ))}
      </nav>

      {/* Mobile/tablet: direct home shortcut followed by the menu trigger. */}
      <Link
        href={`/${locale}/`}
        className="category-menu-mobile-home"
        aria-label={commonT('home')}
        aria-current={normalizePath(`/${locale}/`) === currentPath ? 'page' : undefined}
      >
        <Home size={22} strokeWidth={2.25} aria-hidden="true" />
      </Link>

      <button
        type="button"
        ref={triggerRef}
        className="category-menu-hamburger"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? labels.closeMenu : labels.openMenu}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      <div
        id={drawerId}
        ref={drawerRef}
        className="category-menu-drawer"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label={labels.menuLabel}
        hidden={!open}
      >
        <div className="category-menu-drawer-content">
          <section className="category-menu-themes" aria-labelledby="browse-theme-title">
            <h2 id="browse-theme-title">{homeT('browseByTheme')}</h2>
            <div className="category-menu-drawer-grid">
              {drawerThemes.map((category, index) => (
                <CategoryTile
                  key={category.id}
                  category={category}
                  isActive={normalizePath(category.href) === currentPath}
                  onNavigate={() => setOpen(false)}
                  ref={index === 0 ? firstTileRef : undefined}
                />
              ))}
            </div>
          </section>

          <section className="category-menu-quick" aria-labelledby="quick-links-title">
            <h2 id="quick-links-title">{homeT('quickLinks')}</h2>
            <div className="category-menu-quick-list">
              <Link href={`/${locale}/premium/`} onClick={() => setOpen(false)}><Gift size={30} aria-hidden="true" /><span>{homeT('bundlePacks')}</span><ChevronRight aria-hidden="true" /></Link>
            </div>
          </section>
        </div>

        <footer className="category-menu-drawer-footer">
          <Link href={`/${locale}/blog/`} onClick={() => setOpen(false)}>{homeT('parentsTeachers')}</Link>
          <Link href={`/${locale}/about/`} onClick={() => setOpen(false)}>{footerT('about')}</Link>
          <Link href={`/${locale}/contact/`} onClick={() => setOpen(false)}>{footerT('contact')}</Link>
        </footer>
      </div>

      {open && (
        <button
          type="button"
          className="category-menu-scrim"
          aria-label={labels.closeMenu}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
