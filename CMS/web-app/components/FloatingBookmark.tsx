'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'bookmarked-pages';

function readBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

interface FloatingBookmarkProps {
  className?: string;
}

export default function FloatingBookmark({ className }: FloatingBookmarkProps) {
  const t = useTranslations('bookmark');
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(readBookmarks().includes(window.location.href));
  }, []);

  const handleClick = () => {
    const url = window.location.href;
    const bookmarks = readBookmarks();
    const isSaved = bookmarks.includes(url);
    const next = isSaved ? bookmarks.filter((u) => u !== url) : [...bookmarks, url];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(!isSaved);

    const nav = window.navigator as Navigator & { sidebar?: { addPanel: (title: string, url: string, empty: string) => void } };
    const win = window as Window & { external?: { AddFavorite?: (url: string, title: string) => void } };
    if (win.external?.AddFavorite) {
      win.external.AddFavorite(url, document.title);
    } else if (nav.sidebar?.addPanel) {
      nav.sidebar.addPanel(document.title, url, '');
    } else if (!isSaved) {
      setToast(true);
      setTimeout(() => setToast(false), 3200);
    }
  };

  return (
    <div className={`floating-bookmark-wrap${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className={`floating-bookmark icon-tooltip${saved ? ' floating-bookmark--saved' : ''}`}
        onClick={handleClick}
        aria-pressed={saved}
        aria-label={saved ? t('saved') : t('save')}
      >
        {saved ? <BookmarkCheck size={20} aria-hidden="true" /> : <Bookmark size={20} aria-hidden="true" />}
        <span className="floating-bookmark-label">{t('labelText')}</span>
      </button>
      {toast &&
        (mounted
          ? createPortal(<span className="floating-bookmark-toast">{t('hint')}</span>, document.body)
          : null)}
    </div>
  );
}
