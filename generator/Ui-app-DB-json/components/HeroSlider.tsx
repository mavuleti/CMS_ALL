'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ResponsiveImage from '@/components/ResponsiveImage';
import { localizedPuzzleCardAlt } from '@/lib/json-seo';

const slides = [
  {
    src: '/images/gas-balloon-usa-250-puzzle.webp',
    alt: 'America 250 gas balloon dot-to-dot printable worksheet - free download for kids ages 4-7',
    note: 'Gas Balloon America 250 - 48 dots - free PDF',
    href: '/usa-250/gas-balloon-usa-250-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/eagle-kite-banner-usa-250-puzzle.webp',
    alt: 'Eagle kite banner America 250 dot-to-dot printable worksheet - free download for kids ages 5-9',
    note: 'Eagle Kite Banner America 250 - 80 dots - free PDF',
    href: '/usa-250/eagle-kite-banner-usa-250-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/america-250-birthday-fireworks-puzzle.webp',
    alt: 'America 250 birthday fireworks dot-to-dot printable worksheet - free download for kids ages 6-10',
    note: 'America 250 Birthday Fireworks - 90 dots - free PDF',
    href: '/usa-250/america-250-birthday-fireworks-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/america-250-anniversary-liberty-bell-wings-1776-puzzle.webp',
    alt: 'America 250 Liberty Bell wings dot-to-dot printable worksheet - free download for kids ages 4-8',
    note: 'America 250 Liberty Bell Wings - 64 dots - free PDF',
    href: '/usa-250/america-250-anniversary-liberty-bell-wings-1776-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-birthday-cake-puzzle.webp',
    alt: 'America 250 birthday cake dot-to-dot printable worksheet - free download for kids ages 4-8',
    note: 'America 250 Birthday Cake - 56 dots - free PDF',
    href: '/usa-250/usa-250-birthday-cake-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-astronaut-puzzle.webp',
    alt: 'America 250 astronaut dot-to-dot printable worksheet - free download for kids ages 4-8',
    note: 'America 250 Astronaut - 63 dots - free PDF',
    href: '/usa-250/usa-250-astronaut-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-anniversary-airplane-banner-puzzle.webp',
    alt: 'America 250 anniversary airplane banner dot-to-dot printable worksheet - free download for kids ages 4-8',
    note: 'America 250 Airplane Banner - 54 dots - free PDF',
    href: '/usa-250/usa-250-anniversary-airplane-banner-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-space-shuttle-puzzle.webp',
    alt: 'America 250 space shuttle dot-to-dot printable worksheet - free download for kids ages 4-8',
    note: 'America 250 Space Shuttle - 50 dots - free PDF',
    href: '/usa-250/usa-250-space-shuttle-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-anniversary-sports-kids-podium-puzzle.webp',
    alt: 'America 250 anniversary sports kids podium dot-to-dot printable worksheet - free download for kids ages 6-10',
    note: 'America 250 Sports Kids Podium - 124 dots - free PDF',
    href: '/usa-250/usa-250-anniversary-sports-kids-podium-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/usa-250-birthday-balloons-stars-puzzle.webp',
    alt: 'America 250 birthday balloons and stars dot-to-dot printable worksheet - free download for kids ages 6-10',
    note: 'America 250 Balloons and Stars - 94 dots - free PDF',
    href: '/usa-250/usa-250-birthday-balloons-stars-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
  {
    src: '/images/america-250-anniversary-eagle-banner-puzzle.webp',
    alt: 'America 250 eagle banner dot-to-dot printable worksheet - free download for kids ages 6-10',
    note: 'America 250 Eagle Banner - 104 dots - free PDF',
    href: '/usa-250/america-250-anniversary-eagle-banner-dot-to-dot-puzzle/',
    featured: 'usa250',
  },
];

const oceanSlides = [
  {
    src: '/images/mermaid-puzzle.webp',
    alt: 'Mermaid dot-to-dot printable worksheet - free download for kids',
    note: 'Mermaid - 54 dots - free PDF',
    href: '/ocean/mermaid-dot-to-dot-puzzle/',
    featured: 'ocean',
  },
  {
    src: '/images/merman-puzzle.webp',
    alt: 'Merman dot-to-dot printable worksheet - free download for kids',
    note: 'Merman - 44 dots - free PDF',
    href: '/ocean/merman-dot-to-dot-puzzle/',
    featured: 'ocean',
  },
  {
    src: '/images/seahorse-puzzle.webp',
    alt: 'Seahorse dot-to-dot printable worksheet - free download for kids',
    note: 'Seahorse - 35 dots - free PDF',
    href: '/ocean/seahorse-dot-to-dot-puzzle/',
    featured: 'ocean',
  },
  {
    src: '/images/whale-puzzle.webp',
    alt: 'Whale dot-to-dot printable worksheet - free download for kids',
    note: 'Whale - 42 dots - free PDF',
    href: '/ocean/whale-dot-to-dot-puzzle/',
    featured: 'ocean',
  },
];

const oceanSlideNames: Record<string, string[]> = {
  ar: ['حورية البحر', 'رجل البحر', 'فرس البحر', 'الحوت'],
  es: ['Sirena', 'Tritón', 'Caballito de mar', 'Ballena'],
  de: ['Meerjungfrau', 'Meermann', 'Seepferdchen', 'Wal'],
  ru: ['Русалка', 'Тритон', 'Морской конёк', 'Кит'],
};

const usaSlideNames: Record<string, string[]> = {
  es: [
    'Globo de gas EE. UU. 250', 'Cometa con águila EE. UU. 250',
    'Fuegos artificiales del 250.º aniversario de Estados Unidos',
    'Alas de la Campana de la Libertad America 250', 'Tarta de cumpleaños America 250',
    'Astronauta EE. UU. 250', 'Pancarta aérea del 250.º aniversario de EE. UU.',
    'Transbordador espacial America 250', 'Podio infantil deportivo del 250.º aniversario de EE. UU.',
    'Globos y estrellas de cumpleaños EE. UU. 250', 'Estandarte del águila America 250',
  ],
  de: [
    'Gasballon America 250', 'Adler-Drachen-Banner America 250',
    'Feuerwerk zum 250. Geburtstag Amerikas', 'Freiheitsglocke mit Flügeln America 250',
    'Geburtstagstorte America 250', 'Astronaut America 250',
    'Flugzeugbanner zum 250-jährigen Jubiläum der USA', 'Spaceshuttle America 250',
    'Sport-Kinder-Podium zum 250-jährigen Jubiläum', 'Geburtstagsballons und Sterne America 250',
    'Adlerbanner America 250',
  ],
};

const ukSlides = [
  'Газова куля America 250 — 48 крапок — безкоштовний PDF',
  'Повітряний змій з орлом America 250 — 80 крапок — безкоштовний PDF',
  'Святковий феєрверк America 250 — 90 крапок — безкоштовний PDF',
  'Крила з дзвоном Свободи America 250 — 64 крапки — безкоштовний PDF',
  'Святковий торт America 250 — 56 крапок — безкоштовний PDF',
  'Астронавт America 250 — 63 крапки — безкоштовний PDF',
  'Літак із банером America 250 — 54 крапки — безкоштовний PDF',
  'Космічний шатл America 250 — 50 крапок — безкоштовний PDF',
  "Спортивний п'єдестал America 250 — 124 крапки — безкоштовний PDF",
  'Повітряні кульки та зорі America 250 — 94 крапки — безкоштовний PDF',
  'Банер з орлом America 250 — 104 крапки — безкоштовний PDF',
];

export default function HeroSlider({ locale }: { locale: string }) {
  const tc = useTranslations('common');
  const activeSlides = locale === 'ar' || locale === 'ru' ? oceanSlides : slides;
  const displayNote = (index: number) => locale === 'uk' ? ukSlides[index] : activeSlides[index].note;
  const loopSlides = [...activeSlides, activeSlides[0]];
  const localizedSlideAlt = (slide: (typeof activeSlides)[number], index: number) => {
    const names = activeSlides === oceanSlides ? oceanSlideNames[locale] : usaSlideNames[locale];
    return names ? localizedPuzzleCardAlt(locale, names[index % names.length]) : slide.alt;
  };
  const [idx, setIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const moveTo = (i: number, animate: boolean) => {
    if (trackRef.current) {
      trackRef.current.style.transition = animate
        ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
        : 'none';
      trackRef.current.style.transform = `translateX(-${i * 100}%)`;
    }
    setIdx(i);
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.animation = 'none';
      trackRef.current.style.transform = 'translateX(0)';
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (idx === loopSlides.length - 1) {
      const resetTimer = window.setTimeout(() => moveTo(0, false), 650);
      return () => window.clearTimeout(resetTimer);
    }
    const timer = window.setTimeout(() => {
      moveTo(idx + 1, true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [idx, isPaused, loopSlides.length]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
    if (idx === loopSlides.length - 1) {
      moveTo(0, false);
    }
  };

  const dotIdx = idx % activeSlides.length;

  return (
    <div
      className="hero-card"
      aria-label={locale === 'ar' || locale === 'ru' ? 'Featured Ocean printable preview' : 'Featured America 250 printable preview'}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ overflow: 'hidden' }}
    >
      <div style={{ borderRadius: 20, overflow: 'hidden' }}>
        <div
          ref={trackRef}
          className="hero-slider-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            display: 'flex',
            willChange: 'transform',
          }}
        >
          {loopSlides.map((slide, i) => (
            <Link
              key={i}
              href={`/${locale}${slide.href}`}
              aria-label={locale === 'uk' && activeSlides[i % activeSlides.length] ? displayNote(i % activeSlides.length) : localizedSlideAlt(slide, i)}
              aria-hidden={i !== idx}
              className={`hero-slide hero-slide--${slide.featured}`}
              tabIndex={i === idx ? 0 : -1}
              style={{ flex: '0 0 100%', minWidth: 0, display: 'block' }}
            >
              <ResponsiveImage
                src={slide.src}
                alt={localizedSlideAlt(slide, i)}
                width={800}
                height={679}
                priority={i === 0}
                sizes="(max-width: 900px) 92vw, 500px"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="hero-slider-footer">
        <div className="hero-card-note">
          <BadgeCheck size={18} aria-hidden="true" />
          {displayNote(dotIdx)}
        </div>
      </div>

      <div className="hero-slider-dots">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            className="hero-slider-dot"
            onClick={() => moveTo(i, true)}
            aria-label={tc('showSlide', { number: i + 1 })}
            aria-pressed={i === dotIdx}
          >
            <span
              className="hero-slider-dot-marker"
              aria-hidden="true"
              style={{
                background: i === dotIdx ? 'var(--red-dark, #c83f3a)' : '#d1c4b4',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
