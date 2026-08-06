import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Statistic } from "@/types";

/**
 * Inline chart primitives (§14). Plain SVG on the app's chart tokens — no chart
 * library, no extra colours, no plot borders and no axis lines.
 *
 * Which visual a card gets is derived from the shape of its data:
 *   parts     → donut with a centred total
 *   series    → area + line sparkline
 *   suffix %  → radial gauge
 *   otherwise → column against the section maximum
 *
 * Every path is validated before it reaches the DOM: a null interior point is
 * interpolated so the line never breaks, and NaN can never reach a coordinate.
 */

const ANIM_MS = 700;

/** Drives a 0 → 1 reveal once on mount, respecting reduced motion. */
function useReveal(active: boolean) {
  const [progress, setProgress] = useState(active ? 0 : 1);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setProgress(1);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(1);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / ANIM_MS, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  return progress;
}

/**
 * Fills interior gaps by linear interpolation so the path is continuous by
 * construction. `synthetic` records which points were invented; nothing renders
 * from it today, since the line is required to read as one unbroken stroke.
 */
function fillGaps(series: (number | null | undefined)[]) {
  const values: number[] = [];
  const synthetic: boolean[] = [];

  const known = series
    .map((v, i) => [i, v] as const)
    .filter(([, v]) => typeof v === "number" && Number.isFinite(v)) as [
    number,
    number,
  ][];

  if (known.length === 0) return { values, synthetic };

  for (let i = 0; i < series.length; i++) {
    const v = series[i];
    if (typeof v === "number" && Number.isFinite(v)) {
      values.push(v);
      synthetic.push(false);
      continue;
    }
    // Interpolate between the nearest known neighbours; clamp at the ends.
    const before = [...known].reverse().find(([idx]) => idx < i);
    const after = known.find(([idx]) => idx > i);
    if (before && after) {
      const ratio = (i - before[0]) / (after[0] - before[0]);
      values.push(before[1] + (after[1] - before[1]) * ratio);
      synthetic.push(true);
    } else if (before) {
      values.push(before[1]);
      synthetic.push(true);
    } else if (after) {
      values.push(after[1]);
      synthetic.push(true);
    }
  }

  return { values, synthetic };
}

// ─── Sparkline (area + line) ──────────────────────────────────────────────────

function Sparkline({
  series,
  color,
  animate,
  height = 64,
}: {
  series: (number | null)[];
  color: string;
  animate: boolean;
  height?: number;
}) {
  const gradientId = useId();
  const progress = useReveal(animate);
  const { values } = fillGaps(series);

  if (values.length < 2) return null;

  const w = 100;
  const h = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 10) - 5;
    // A NaN can never reach a coordinate (§14.1.4).
    return [
      Number.isFinite(x) ? x : 0,
      Number.isFinite(y) ? y : h / 2,
    ] as const;
  });

  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${line} ${w},${h} 0,${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full overflow-visible"
      style={{ height }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon points={area} fill={`url(#${gradientId})`} opacity={progress} />

      {/* One continuous stroke, end to end.
          What actually produced the "interrupted line" was this component's own
          markup, not the data: a card-coloured dashed polyline was painted over
          every interpolated stretch, and a card-filled circle sat on each
          synthesised point. Both punched holes in a line that was already
          whole. Gaps in the series are still bridged by fillGaps, so the path
          is continuous by construction; the dash pattern below exists only for
          the draw-on reveal and is dropped the moment it finishes. */}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray={progress < 1 ? 1 : undefined}
        strokeDashoffset={progress < 1 ? 1 - progress : undefined}
      />
    </svg>
  );
}

// ─── Donut with a centred total ───────────────────────────────────────────────

function Donut({
  parts,
  animate,
  size = 96,
  total: totalLabel,
}: {
  parts: NonNullable<Statistic["parts"]>;
  animate: boolean;
  size?: number;
  total?: string;
}) {
  const progress = useReveal(animate);
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  if (total <= 0) return null;

  const r = 15.9155; // circumference is ~100, so a stop reads as a percentage
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" className="size-full -rotate-90">
          {parts.map((p) => {
            // 3px arc gaps, expressed in the 100-unit circumference.
            const pct = Math.max(0, (p.value / total) * 100 * progress - 1.2);
            const el = (
              <circle
                key={p.label}
                cx="18"
                cy="18"
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += (p.value / total) * 100 * progress;
            return el;
          })}
        </svg>
        {totalLabel && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="text-[length:var(--text-subtitle)] font-extrabold text-foreground tabular-nums">
              {totalLabel}
            </span>
          </span>
        )}
      </div>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {parts.map((p) => (
          <li
            key={p.label}
            className="flex items-center gap-2 text-[length:var(--text-small)] font-semibold text-muted-foreground"
          >
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: p.color }}
            />
            <span className="truncate">{p.label}</span>
            <span className="ms-auto shrink-0 font-bold text-foreground tabular-nums">
              {Math.round((p.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Radial gauge ─────────────────────────────────────────────────────────────

function Gauge({
  value,
  color,
  animate,
}: {
  value: number;
  color: string;
  animate: boolean;
}) {
  const progress = useReveal(animate);
  const pct = Math.max(0, Math.min(100, value)) * progress;

  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="var(--grid-line)"
          strokeWidth="4.5"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${pct} ${100 - pct}`}
        />
      </svg>
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function Column({
  value,
  max,
  color,
  animate,
}: {
  value: number;
  max: number;
  color: string;
  animate: boolean;
}) {
  const progress = useReveal(animate);
  const pct = max > 0 ? Math.max(0.02, Math.min(1, value / max)) : 0;

  return (
    <div className="relative h-16 overflow-hidden rounded-[10px] bg-[var(--grid-line)]">
      <div
        className="absolute inset-x-0 bottom-0 rounded-[10px]"
        style={{
          height: `${pct * progress * 100}%`,
          backgroundImage: `linear-gradient(180deg, ${color} 0%, color-mix(in oklab, ${color} 82%, black) 100%)`,
        }}
      />
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function StatVisual({
  stat,
  color,
  sectionMax,
  animate = true,
  className,
}: {
  stat: Statistic;
  color: string;
  sectionMax?: number;
  animate?: boolean;
  className?: string;
}) {
  if (stat.parts?.length) {
    return (
      <div className={className}>
        <Donut parts={stat.parts} animate={animate} />
      </div>
    );
  }

  if (stat.series && stat.series.length > 1) {
    return (
      <div className={className}>
        <Sparkline
          series={stat.series as (number | null)[]}
          color={color}
          animate={animate}
        />
      </div>
    );
  }

  if (stat.suffix === "%") {
    return (
      <div className={cn("flex justify-end", className)}>
        <Gauge value={stat.value} color={color} animate={animate} />
      </div>
    );
  }

  const max = stat.max ?? sectionMax ?? 0;
  if (max <= 0) return null;

  return (
    <div className={className}>
      <Column value={stat.value} max={max} color={color} animate={animate} />
    </div>
  );
}

export { Donut, Sparkline, Gauge, Column };
