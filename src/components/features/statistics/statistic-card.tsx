import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

export type StatTrend = "up" | "down" | "neutral";
export type StatVariant =
  | "default"
  | "accent"
  | "destructive"
  | "success"
  | "warning";

export interface Statistic {
  id: string;
  label: string;
  value: number;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "%", "k"
  trend?: StatTrend;
  trendValue?: string; // e.g. "+12.4%"
  trendLabel?: string; // e.g. "vs last month"
  icon: LucideIcon;
  variant?: StatVariant;
  description?: string;
}

interface StatisticCardProps {
  stat: Statistic;
  animate?: boolean;
}

// Animated number counter
function useCountUp(target: number, duration = 1200, active = true) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setCount(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return count;
}

// Color map per variant using CSS tokens
const variantStyles: Record<
  StatVariant,
  {
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    glow: string;
    bar: string;
    trendUp: string;
    trendDown: string;
  }
> = {
  default: {
    iconBg: "color-mix(in oklch, var(--primary) 12%, transparent)",
    iconBorder: "color-mix(in oklch, var(--primary) 30%, transparent)",
    iconColor: "var(--primary)",
    glow: "color-mix(in oklch, var(--primary) 8%, transparent)",
    bar: "linear-gradient(90deg, var(--primary), color-mix(in oklch, var(--primary) 60%, var(--accent)))",
    trendUp: "oklch(0.55 0.18 145)",
    trendDown: "var(--destructive)",
  },
  accent: {
    iconBg: "color-mix(in oklch, var(--accent) 14%, transparent)",
    iconBorder: "color-mix(in oklch, var(--accent) 35%, transparent)",
    iconColor: "var(--accent)",
    glow: "color-mix(in oklch, var(--accent) 8%, transparent)",
    bar: "linear-gradient(90deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--primary)))",
    trendUp: "oklch(0.55 0.18 145)",
    trendDown: "var(--destructive)",
  },
  destructive: {
    iconBg: "color-mix(in oklch, var(--destructive) 12%, transparent)",
    iconBorder: "color-mix(in oklch, var(--destructive) 30%, transparent)",
    iconColor: "var(--destructive)",
    glow: "color-mix(in oklch, var(--destructive) 6%, transparent)",
    bar: "linear-gradient(90deg, var(--destructive), color-mix(in oklch, var(--destructive) 60%, var(--accent)))",
    trendUp: "oklch(0.55 0.18 145)",
    trendDown: "var(--destructive)",
  },
  success: {
    iconBg: "color-mix(in oklch, oklch(0.55 0.18 145) 12%, transparent)",
    iconBorder: "color-mix(in oklch, oklch(0.55 0.18 145) 30%, transparent)",
    iconColor: "oklch(0.55 0.18 145)",
    glow: "color-mix(in oklch, oklch(0.55 0.18 145) 6%, transparent)",
    bar: "linear-gradient(90deg, oklch(0.55 0.18 145), oklch(0.68 0.15 160))",
    trendUp: "oklch(0.55 0.18 145)",
    trendDown: "var(--destructive)",
  },
  warning: {
    iconBg: "color-mix(in oklch, oklch(0.78 0.17 75) 14%, transparent)",
    iconBorder: "color-mix(in oklch, oklch(0.78 0.17 75) 35%, transparent)",
    iconColor: "oklch(0.72 0.17 68)",
    glow: "color-mix(in oklch, oklch(0.78 0.17 75) 7%, transparent)",
    bar: "linear-gradient(90deg, oklch(0.78 0.17 75), oklch(0.86 0.14 88))",
    trendUp: "oklch(0.55 0.18 145)",
    trendDown: "var(--destructive)",
  },
};

export function StatisticCard({ stat, animate = true }: StatisticCardProps) {
  const v = stat.variant ?? "default";
  const styles = variantStyles[v];
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 1200, animate);

  const TrendIcon =
    stat.trend === "up"
      ? TrendingUp
      : stat.trend === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    stat.trend === "up"
      ? styles.trendUp
      : stat.trend === "down"
        ? styles.trendDown
        : "var(--muted-foreground)";

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        fontFamily: "var(--font-sans)",
        background: "var(--card)",
        border: "1px solid var(--border)",
        padding: "1.25rem",
        minHeight: "160px",
        boxShadow: `0 2px 16px 0 ${styles.glow}`,
      }}
    >
      {/* Background glow blob */}
      <div
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: styles.iconColor }}
      />

      {/* Top row: label + icon */}
      <div className="relative flex items-start justify-between gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-widest leading-none"
          style={{ color: "var(--muted-foreground)", letterSpacing: "0.08em" }}
        >
          {stat.label}
        </span>

        <div
          className="shrink-0 flex items-center justify-center h-9 w-9 rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: styles.iconBg,
            border: `1.5px solid ${styles.iconBorder}`,
          }}
        >
          <Icon
            className="h-4 w-4"
            strokeWidth={2}
            style={{ color: styles.iconColor }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="relative mt-3">
        <div className="flex items-end gap-1 leading-none">
          {stat.prefix && (
            <span
              className="text-lg font-semibold mb-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              {stat.prefix}
            </span>
          )}
          <span
            className="text-3xl font-bold tabular-nums"
            style={{
              color: "var(--card-foreground)",
              fontFamily: "var(--font-serif)",
              lineHeight: 1,
            }}
          >
            {fmt(count)}
          </span>
          {stat.suffix && (
            <span
              className="text-lg font-semibold mb-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              {stat.suffix}
            </span>
          )}
        </div>

        {stat.description && (
          <p
            className="text-xs mt-1 leading-relaxed line-clamp-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {stat.description}
          </p>
        )}
      </div>

      {/* Bottom row: trend + progress bar */}
      <div className="relative mt-4 space-y-2">
        {/* Thin progress bar */}
        <div
          className="h-1 w-full rounded-full overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              background: styles.bar,
              width: animate ? "72%" : "72%",
            }}
          />
        </div>

        {/* Trend badge */}
        {stat.trend && stat.trendValue && (
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold"
              style={{
                background: `color-mix(in oklch, ${trendColor} 12%, transparent)`,
                border: `1px solid color-mix(in oklch, ${trendColor} 28%, transparent)`,
                color: trendColor,
              }}
            >
              <TrendIcon className="h-3 w-3" strokeWidth={2.5} />
              {stat.trendValue}
            </div>
            {stat.trendLabel && (
              <span
                className="text-[11px]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {stat.trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
