import type { CSSProperties } from 'react';
import puzzle1200Manifest from '@/lib/puzzle-1200-manifest.json';

type ResponsiveImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

const puzzle1200Sources = new Set<string>(puzzle1200Manifest);

function variant(src: string, width: number) {
  return src.replace(/\.webp$/, `-${width}.webp`);
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
  style,
}: ResponsiveImageProps) {
  const isPuzzleImage = src.endsWith('-puzzle.webp');
  const supportsVariants = isPuzzleImage || [
    '/images/girl-solving-dot-to-dot-dinosaur-printable.webp',
    '/images/dot-to-dot-fine-motor-skills.webp',
    '/images/best-of-2026-dot-to-dot-book-cover.webp',
  ].includes(src);
  // Puzzle originals are always 800px wide natively (see TODO-seo.md), so
  // that's the real width descriptor for `src` — using the display `width`
  // prop here (as before) understated it and could stop browsers from ever
  // picking the full-resolution candidate for larger/retina viewports.
  const has1200 = isPuzzleImage && puzzle1200Sources.has(src);
  const srcSet = supportsVariants
    ? `${variant(src, 400)} 400w, ${variant(src, 600)} 600w, ${variant(src, 700)} 700w, ${src} ${isPuzzleImage ? 800 : width}w${has1200 ? `, ${variant(src, 1200)} 1200w` : ''}`
    : undefined;
  const fallbackSrc = srcSet ? variant(src, 400) : src;

  return (
    // Static export uses pre-generated Sharp variants, so native srcset is intentional here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
