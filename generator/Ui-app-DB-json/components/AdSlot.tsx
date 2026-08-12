/**
 * AdSlot — placeholder for Google AdSense units.
 *
 * During development this renders a clearly labelled box so you can see
 * exactly where each ad will appear and how much space it takes.
 *
 * At launch: replace the inner <div> content with your AdSense <ins> tag.
 * Each slot has a unique `id` so you can target them individually.
 */

type AdSlotProps = {
  id: string;
  /** 'leaderboard' = 728×90, 'rectangle' = 300×250, 'inline' = responsive banner */
  size: 'leaderboard' | 'rectangle' | 'inline';
  label?: string;
};

const sizes: Record<AdSlotProps['size'], { width: number | string; height: number }> = {
  leaderboard: { width: '100%', height: 90 },
  rectangle:   { width: 300,   height: 250 },
  inline:      { width: '100%', height: 120 }
};

export default function AdSlot({ id, size, label }: AdSlotProps) {
  // Ad slots hidden until AdSense is enabled — set to true to show
  const ADS_ENABLED = false;
  if (!ADS_ENABLED) return null;

  const { width, height } = sizes[size];

  return (
    <div
      id={id}
      // eslint-disable-next-line no-restricted-syntax -- ad slots are disabled (ADS_ENABLED=false) and never render; not user-facing copy
      aria-label="Advertisement"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
        maxWidth: '100%',
        margin: '0 auto',
        background: 'repeating-linear-gradient(45deg, #f5f0e8, #f5f0e8 8px, #ede8de 8px, #ede8de 16px)',
        border: '1px dashed #c8b89a',
        borderRadius: '10px',
        color: '#9c8a76',
        fontSize: '0.78rem',
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* REPLACE THIS DIV CONTENT WITH YOUR ADSENSE <ins> TAG AT LAUNCH */}
      📢 Ad — {label ?? id} ({size})
    </div>
  );
}
