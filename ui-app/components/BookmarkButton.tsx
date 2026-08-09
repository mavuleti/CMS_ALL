'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BookmarkButtonProps {
  title?: string;
}

export default function BookmarkButton({ title }: BookmarkButtonProps) {
  const t = useTranslations('bookmarkButton');
  const [state, setState] = useState<'idle' | 'tooltip' | 'shared'>('idle');
  const [hasClicked, setHasClicked] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
    // Stop pulsing once user has interacted with it this session
    const seen = sessionStorage.getItem('bookmark-seen');
    if (seen) setHasClicked(true);
  }, []);

  const handleClick = async () => {
    setHasClicked(true);
    sessionStorage.setItem('bookmark-seen', '1');

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          url: window.location.href,
        });
        setState('shared');
        setTimeout(() => setState('idle'), 3000);
        return;
      } catch {
        // User cancelled — fall through to tooltip
      }
    }

    // Desktop fallback: show keyboard shortcut tooltip
    setState(state === 'tooltip' ? 'idle' : 'tooltip');
  };

  const handleDismiss = () => setState('idle');

  return (
    <div className="bookmark-wrap" role="complementary" aria-label={t('regionLabel')}>
      {/* Tooltip / feedback bubble */}
      {state === 'tooltip' && (
        <div className="bookmark-tooltip" role="status">
          <span className="bookmark-tooltip-text">
            {t.rich('shortcut', {
              shortcut: () => (
                <>
                  <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>+<kbd>D</kbd>
                </>
              )
            })}
          </span>
          <button
            className="bookmark-tooltip-close"
            onClick={handleDismiss}
            aria-label={t('dismiss')}
          >
            ✕
          </button>
        </div>
      )}
      {state === 'shared' && (
        <div className="bookmark-tooltip bookmark-tooltip--success" role="status">
          <span className="bookmark-tooltip-text">{t('shared')}</span>
        </div>
      )}

      {/* The button */}
      <button
        className={`bookmark-btn${!hasClicked ? ' bookmark-btn--pulse' : ''}${state === 'shared' ? ' bookmark-btn--saved' : ''}`}
        onClick={handleClick}
        aria-label={t('buttonAria')}
        aria-pressed={state !== 'idle'}
        title={t('buttonTitle')}
      >
        <Bookmark
          size={18}
          fill={state === 'shared' ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        <span className="bookmark-btn-label">
          {state === 'shared' ? t('saved') : t('save')}
        </span>
      </button>
    </div>
  );
}
