import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-count-up";
import type { Statistic } from "@/types";

interface StatisticCardProps {
  stat: Statistic;
  animate?: boolean;
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10 border-primary/20 text-primary",
    glow: "shadow-primary/5 hover:shadow-primary/10",
    trendUp: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    trendDown: "text-destructive bg-destructive/10 border-destructive/20",
  },
  accent: {
    iconBg: "bg-accent/15 border-accent/25 text-accent-foreground",
    glow: "shadow-accent/5 hover:shadow-accent/10",
    trendUp: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    trendDown: "text-destructive bg-destructive/10 border-destructive/20",
  },
  destructive: {
    iconBg: "bg-destructive/10 border-destructive/20 text-destructive",
    glow: "shadow-destructive/5 hover:shadow-destructive/10",
    trendUp: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    trendDown: "text-destructive bg-destructive/10 border-destructive/20",
  },
  success: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    glow: "shadow-emerald-500/5 hover:shadow-emerald-500/10",
    trendUp: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    trendDown: "text-destructive bg-destructive/10 border-destructive/20",
  },
  warning: {
    iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    glow: "shadow-amber-500/5 hover:shadow-amber-500/10",
    trendUp: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    trendDown: "text-destructive bg-destructive/10 border-destructive/20",
  },
};

export function StatisticCard({ stat, animate = true }: StatisticCardProps) {
  const v = stat.variant ?? "default";
  const styles = variantStyles[v];
  const Icon = stat.icon;
  const count = useCountUp(stat.value, 1000, animate);

  const TrendIcon =
    stat.trend === "up"
      ? TrendingUp
      : stat.trend === "down"
        ? TrendingDown
        : Minus;

  const trendClass =
    stat.trend === "up"
      ? styles.trendUp
      : stat.trend === "down"
        ? styles.trendDown
        : "text-muted-foreground bg-muted border-border";

  return (
    <div
      className={cn(
        "group relative flex min-h-[140px] sm:min-h-[160px] flex-col justify-between rounded-2xl border bg-card p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        stat.badge ? "border-destructive/30" : "border-border",
        styles.glow,
      )}
    >
      {/* Decorative Glow Blob */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl transition-opacity duration-500 group-hover:opacity-10"
        style={{ color: "var(--primary)" }}
      />

      {/* Row 1: Header (Label and Badges/Icons) */}
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground leading-snug">
          {stat.label}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {stat.badge && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
              {stat.badge}
            </span>
          )}
          <div
            className={cn(
              "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
              styles.iconBg,
            )}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Row 2: Metrics block */}
      <div className="mt-2 space-y-1">
        <div className="flex items-baseline gap-0.5 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-card-foreground">
          {stat.prefix && (
            <span className="text-lg font-semibold text-muted-foreground mr-0.5 select-none">
              {stat.prefix}
            </span>
          )}
          <span className="tabular-nums">{count.toLocaleString()}</span>
          {stat.suffix && (
            <span className="text-lg font-semibold text-muted-foreground ml-0.5 select-none">
              {stat.suffix}
            </span>
          )}
        </div>

        {stat.description && (
          <p className="line-clamp-1 text-xs leading-relaxed text-muted-foreground">
            {stat.description}
          </p>
        )}
      </div>

      {/* Row 3: Trends */}
      <div className="mt-3">
        {stat.trend && stat.trendValue && (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold leading-none",
                trendClass,
              )}
            >
              <TrendIcon className="h-3 w-3" strokeWidth={2.5} />
              {stat.trendValue}
            </span>
            {stat.trendLabel && (
              <span className="text-[11px] text-muted-foreground">
                {stat.trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
