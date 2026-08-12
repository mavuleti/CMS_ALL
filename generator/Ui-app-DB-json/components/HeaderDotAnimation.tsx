// The SVG sits immediately above the header's bottom border, so using its
// full height places the connecting line and dot centres directly on it.
const Y = 14;
const START_X = 2;
const END_X = 98;
const CYCLE = 16.8;

function DotSequence({ count, viewport }: { count: number; viewport: string }) {
  const stepX = (END_X - START_X) / (count - 1);
  const dots = Array.from({ length: count }, (_, i) => ({
    x: `${START_X + i * stepX}%`,
    y: Y
  }));

  return (
    <svg className={`header-dot-strip-svg header-dot-strip-svg--${viewport}`} direction="ltr">
      <line
        className="header-dot-strip-line"
        x1={`${START_X}%`}
        y1={Y}
        x2={`${END_X}%`}
        y2={Y}
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animationDuration: `${CYCLE}s`
        }}
      />
      {dots.map((dot, i) => (
        <g key={`dot-${i}`} className="header-dot-strip-dot">
          <circle cx={dot.x} cy={dot.y} r={8.25} />
          <text x={dot.x} y={dot.y} textAnchor="middle" dominantBaseline="central">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function HeaderDotAnimation() {
  return (
    <div className="header-dot-strip" aria-hidden="true">
      <DotSequence count={30} viewport="desktop" />
      <DotSequence count={15} viewport="tablet" />
      <DotSequence count={7} viewport="mobile" />
    </div>
  );
}
