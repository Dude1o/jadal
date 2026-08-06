import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import { StatVisual } from "./stat-visual";
import type { Statistic } from "@/types";

interface StatisticCardProps {
  stat: Statistic;
  animate?: boolean;
  /** Largest value in the section, used to scale column visuals. */
  sectionMax?: number;
  /** Stagger index for the entrance animation. */
  index?: number;
}

/** Every variant resolves to a brand or semantic token, never an ad-hoc hue. */
const variantStyles = {
  default: {
    chip: "bg-primary/12 text-primary",
    color: "var(--chart-1)",
    tint: "jd-tint-blue",
  },
  accent: {
    chip: "bg-[var(--chip-orange-bg)] text-[var(--chip-orange-fg)]",
    color: "var(--chart-2)",
    tint: "jd-tint-orange",
  },
  destructive: {
    chip: "bg-[var(--chip-red-bg)] text-[var(--chip-red-fg)]",
    color: "var(--chart-7)",
    tint: "jd-tint-red",
  },
  success: {
    chip: "bg-[var(--chip-green-bg)] text-[var(--chip-green-fg)]",
    color: "var(--chart-6)",
    tint: "jd-tint-green",
  },
  warning: {
    chip: "bg-[var(--chip-orange-bg)] text-[var(--chip-orange-fg)]",
    color: "var(--chart-2)",
    tint: "jd-tint-orange",
  },
};

/**
 * A stat card is never a bare number: every one carries a visualisation
 * (section 14.2). Which one is chosen by StatVisual from the data shape.
 */
export function StatisticCard({
  stat,
  animate = true,
  sectionMax,
  index = 0,
}: StatisticCardProps) {
  const v = stat.variant ?? "default";
  const styles = variantStyles[v];
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 900, animate);

  const TrendIcon =
    stat.trend === "up"
      ? TrendingUp
      : stat.trend === "down"
        ? TrendingDown
        : Minus;

  const trendClass =
    stat.trend === "up"
      ? "bg-[var(--chip-green-bg)] text-[var(--chip-green-fg)]"
      : stat.trend === "down"
        ? "bg-[var(--chip-red-bg)] text-[var(--chip-red-fg)]"
        : "bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-fg)]";

  // A gauge sits beside the number; every other visual sits below it.
  const inlineVisual = !stat.parts && !stat.series && stat.suffix === "%";

  return (
    <div
      style={{ "--jd-i": index } as React.CSSProperties}
      className={cn(
        "jd-card jd-interactive jd-enter flex min-h-[190px] flex-col justify-between p-6",
        styles.tint,
      )}
    >
      {/* Label + icon */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[length:var(--text-caption)] leading-snug font-bold text-muted-foreground">
          {stat.label}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          {stat.badge && (
            <span className="inline-flex h-6 items-center rounded-full bg-[var(--chip-red-bg)] px-2.5 text-[length:var(--text-small)] font-bold text-[var(--chip-red-fg)]">
              {stat.badge}
            </span>
          )}
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-[14px]",
              styles.chip,
            )}
          >
            <Icon className="size-5" strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Value (+ gauge when the metric is a ratio) */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-0.5 text-[length:var(--text-display)] font-extrabold text-card-foreground">
            {stat.prefix && (
              <span className="me-0.5 text-[length:var(--text-subtitle)] font-bold text-muted-foreground select-none">
                {stat.prefix}
              </span>
            )}
            <span className="tabular-nums">{count.toLocaleString()}</span>
            {stat.suffix && (
              <span className="ms-0.5 text-[length:var(--text-subtitle)] font-bold text-muted-foreground select-none">
                {stat.suffix}
              </span>
            )}
          </div>

          {stat.description && (
            <p className="mt-1 line-clamp-1 text-[length:var(--text-small)] font-semibold text-muted-foreground">
              {stat.description}
            </p>
          )}
        </div>

        {inlineVisual && (
          <StatVisual stat={stat} color={styles.color} animate={animate} />
        )}
      </div>

      {/* Visualisation + trend */}
      <div className="mt-5 space-y-3">
        {!inlineVisual && (
          <StatVisual
            stat={stat}
            color={styles.color}
            sectionMax={sectionMax}
            animate={animate}
          />
        )}

        {stat.trend && stat.trendValue && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[length:var(--text-small)] font-bold",
                trendClass,
              )}
            >
              <TrendIcon className="size-3" strokeWidth={2.5} />
              {stat.trendValue}
            </span>
            {stat.trendLabel && (
              <span className="truncate text-[length:var(--text-small)] font-semibold text-muted-foreground">
                {stat.trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
