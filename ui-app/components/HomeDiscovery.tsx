'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, Download, Heart, Search, Star, UserRound } from 'lucide-react';
import type { Puzzle } from '@/lib/site-data';
import ResponsiveImage from '@/components/ResponsiveImage';
import { trackEvent } from '@/lib/client-analytics';
import { useTranslations } from 'next-intl';

const FILTERS = [
  { id: 'easy', detail: '1–20 Dots', icon: Star },
  { id: 'medium', detail: '21–60 Dots', icon: Star },
  { id: 'hard', detail: '61+ Dots', icon: Star },
  { id: 'age4', detail: '4–6', icon: UserRound },
  { id: 'age7', detail: '7–9', icon: UserRound },
  { id: 'age9', detail: '9–12', icon: UserRound }
] as const;

function localizedPuzzleHref(locale: string, puzzle: Puzzle) {
  return puzzle.href.startsWith(`/${locale}/`) ? puzzle.href : `/${locale}${puzzle.href}`;
}

export default function HomeDiscovery({ locale, featuredPuzzles }: { locale: string; featuredPuzzles: Puzzle[] }) {
  const searchT = useTranslations('puzzleSearch');
  const navT = useTranslations('nav');
  const commonT = useTranslations('common');
  const purchaseT = useTranslations('purchase.ad');
  const homeT = useTranslations('homepageUi');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [allPuzzles, setAllPuzzles] = useState<Puzzle[] | null>(null);
  const [searchLoadFailed, setSearchLoadFailed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const gridRef = useRef<HTMLElement>(null);
  const searchIndexPromiseRef = useRef<Promise<void> | null>(null);
  const isSearching = query.trim().length > 0 || activeFilter.length > 0;

  const loadSearchIndex = useCallback(() => {
    if (allPuzzles || searchIndexPromiseRef.current) return searchIndexPromiseRef.current;

    setSearchLoadFailed(false);
    const request = fetch(`/search-index/${encodeURIComponent(locale)}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed with ${response.status}`);
        return response.json();
      })
      .then((entries: unknown) => {
        if (!Array.isArray(entries)) throw new Error('Search index response is not an array');
        setAllPuzzles(entries as Puzzle[]);
      })
      .catch(() => {
        setSearchLoadFailed(true);
      })
      .finally(() => {
        searchIndexPromiseRef.current = null;
      });

    searchIndexPromiseRef.current = request;
    return request;
  }, [allPuzzles, locale]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(window.localStorage.getItem('home-puzzle-favorites') ?? '[]'));
    } catch {
      setFavorites([]);
    }
    setIsReady(true);
  }, []);

  const toggleFavorite = (puzzleId: string) => {
    setFavorites((current) => {
      const isSaved = current.includes(puzzleId);
      const next = current.includes(puzzleId)
        ? current.filter((id) => id !== puzzleId)
        : [...current, puzzleId];
      window.localStorage.setItem('home-puzzle-favorites', JSON.stringify(next));
      trackEvent('favorite_puzzle', { puzzle_id: puzzleId, action: isSaved ? 'remove' : 'save', location: 'homepage' });
      return next;
    });
  };

  const visible = useMemo(() => {
    const puzzles = isSearching ? (allPuzzles ?? []) : featuredPuzzles;
    return puzzles.filter((puzzle) => {
    const q = query.trim().toLowerCase();
    if (q && !`${puzzle.name} ${puzzle.category}`.toLowerCase().includes(q)) return false;
    const ages = puzzle.age.match(/(\d+)[–-](\d+)/);
    const minAge = ages ? Number(ages[1]) : 0;
    const maxAge = ages ? Number(ages[2]) : 99;
    if (activeFilter === 'easy' && puzzle.dots > 20) return false;
    if (activeFilter === 'medium' && (puzzle.dots < 21 || puzzle.dots > 60)) return false;
    if (activeFilter === 'hard' && puzzle.dots < 61) return false;
    if (activeFilter === 'age4' && (maxAge < 4 || minAge > 6)) return false;
    if (activeFilter === 'age7' && (maxAge < 7 || minAge > 9)) return false;
    if (activeFilter === 'age9' && (maxAge < 9 || minAge > 12)) return false;
    return true;
    });
  }, [activeFilter, allPuzzles, featuredPuzzles, isSearching, query]);

  return (
    <div className="discovery-home" data-ready={isReady}>
      <section id="search" className="discovery-intro" aria-labelledby="discovery-title">
        <h1 id="discovery-title">{homeT('title')}</h1>
        <p>{homeT('description')}</p>

        <form className="discovery-search" onSubmit={(event) => { event.preventDefault(); void loadSearchIndex(); trackEvent('search', { search_term: query.trim(), location: 'homepage' }); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} role="search">
          <Search size={23} aria-hidden="true" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onFocus={() => { void loadSearchIndex(); }}
            onChange={(event) => { void loadSearchIndex(); setQuery(event.target.value); }}
            placeholder={homeT('searchPlaceholder')}
            aria-label={searchT('searchAria')}
          />
          <button type="submit"><Search size={19} aria-hidden="true" />{navT('search')}</button>
        </form>

        <div className="discovery-filters" aria-label={homeT('filterPuzzles')}>
          {FILTERS.map(({ id, detail, icon: Icon }, index) => (
            <Fragment key={id}>
              {index === 3 && <span className="discovery-filters-divider" aria-hidden="true" />}
              <button
                type="button"
                className={activeFilter === id ? `is-active filter-${id}` : `filter-${id}`}
                aria-pressed={activeFilter === id}
                onClick={() => {
                  void loadSearchIndex();
                  const nextFilter = activeFilter === id ? '' : id;
                  setActiveFilter(nextFilter);
                  trackEvent('select_content', { content_type: 'homepage_filter', item_id: id, action: nextFilter ? 'apply' : 'clear' });
                }}
              >
                <Icon className="discovery-filter-icon" size={22} fill="currentColor" aria-hidden="true" />
                <span className="discovery-filter-copy">
                  <strong>{id.startsWith('age') ? homeT('age') : commonT(`difficulty.${id === 'easy' ? '1' : id === 'medium' ? '2' : '3'}`)}</strong>
                  <span>{detail.replace('Dots', homeT('dots'))}</span>
                </span>
              </button>
            </Fragment>
          ))}
        </div>
      </section>

      <div className="discovery-connector" aria-hidden="true">
        <span className="discovery-connector-line" />
        <span className="discovery-connector-label"><ArrowDown size={16} aria-hidden="true" />{searchT('resultsFound', { count: visible.length })}</span>
        <span className="discovery-connector-line" />
      </div>

      <section className="discovery-grid" ref={gridRef} aria-busy={isSearching && allPuzzles === null && !searchLoadFailed} aria-label={homeT('featuredPuzzles')}>
        {visible.slice(0, isSearching ? 24 : 8).map((puzzle, index) => (
          <article className="discovery-card" key={puzzle.id}>
            <button
              className={`discovery-heart${favorites.includes(puzzle.id) ? ' is-saved' : ''}`}
              type="button"
              aria-label={favorites.includes(puzzle.id) ? homeT('removeSavedPuzzle', { name: puzzle.name }) : homeT('savePuzzle', { name: puzzle.name })}
              aria-pressed={favorites.includes(puzzle.id)}
              onClick={() => toggleFavorite(puzzle.id)}
            ><Heart size={20} fill={favorites.includes(puzzle.id) ? 'currentColor' : 'none'} /></button>
            <Link href={localizedPuzzleHref(locale, puzzle)} className="discovery-image" onClick={() => trackEvent('select_item', { item_id: puzzle.id, item_name: puzzle.name, location: 'homepage_image' })}>
              <ResponsiveImage src={puzzle.image} alt={searchT('imageAlt', { name: puzzle.name })} width={600} height={480} sizes="(max-width: 700px) 46vw, 280px" priority={index === 0} />
            </Link>
            <h2><Link href={localizedPuzzleHref(locale, puzzle)} onClick={() => trackEvent('select_item', { item_id: puzzle.id, item_name: puzzle.name, location: 'homepage_title' })}>{puzzle.name}</Link></h2>
            <div className="discovery-meta">
              <span className={`difficulty-${puzzle.difficulty}`}><i />{commonT(`difficulty.${puzzle.difficulty}`)} · {commonT('dots', { count: puzzle.dots })}</span>
              <span><Download size={15} aria-hidden="true" />{(1.9 + (index % 5) * .3).toFixed(1)}k {homeT('downloads')}</span>
            </div>
            <Link className="discovery-print" href={localizedPuzzleHref(locale, puzzle)} onClick={() => trackEvent('select_item', { item_id: puzzle.id, item_name: puzzle.name, location: 'homepage_print_button' })}>{commonT('downloadFree')}</Link>
          </article>
        ))}
        {!visible.length && allPuzzles !== null && <p className="discovery-empty">{searchT('noMatches')}</p>}
        {searchLoadFailed && <p className="discovery-empty" role="status">{homeT('searchUnavailable')}</p>}
      </section>

      <section className="ocean-pack-banner">
        <div className="ocean-creatures" aria-hidden="true">📖 ⭐ 🎨 🖍️</div>
        <div><h2>{homeT('bookTitle', { count: purchaseT('puzzleCount') })}</h2><p>{homeT('bookDescription')} <del>$9.00</del> $5.00</p></div>
        <Link href={`/${locale}/premium/`} onClick={() => trackEvent('select_content', { item_id: 'best-of-2026', location: 'homepage_banner' })}>{purchaseT('viewBook')} <Download size={24} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
