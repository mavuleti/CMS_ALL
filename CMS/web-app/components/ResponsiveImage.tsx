import type { CSSProperties } from 'react';

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
  const supportsVariants = src.endsWith('-puzzle.webp') || [
    '/images/girl-solving-dot-to-dot-dinosaur-printable.webp',
    '/images/dot-to-dot-fine-motor-skills.webp',
    '/images/best-of-2026-dot-to-dot-book-cover.webp',
  ].includes(src);
  const srcSet = supportsVariants
    ? `${variant(src, 400)} 400w, ${variant(src, 600)} 600w, ${variant(src, 700)} 700w, ${src} ${width}w`
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
