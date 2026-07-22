import { Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { StatisticCard } from "./statistic-card";
import { StatisticGridSkeleton } from "./statistic-card-skeleton";
import type { Statistic } from "@/types";

interface StatisticSectionProps {
  title: string;
  subtitle?: string;
  freshness?: string;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  stats: Statistic[];
  animate: boolean;
}

export function StatisticSection({
  title,
  subtitle,
  freshness,
  isLoading,
  isError,
  emptyMessage,
  stats,
  animate,
}: StatisticSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full space-y-5">
      {/* Header section with layout adjustments */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {freshness && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground self-start sm:self-auto">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            {getTranslation(t, "statistics.updated", { freshness })}
          </div>
        )}
      </div>

      {/* Content wrapper */}
      {isLoading ? (
        <StatisticGridSkeleton />
      ) : isError ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-destructive/10 bg-destructive/5 p-8 text-center"
          role="alert"
        >
          <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <h3 className="font-semibold text-destructive">
             {getTranslation(t, "statistics.failedToLoadSection")}
           </h3>
           <p className="text-xs text-muted-foreground mt-1 max-w-sm">
             {getTranslation(t, "statistics.loadErrorDescription")}
           </p>
        </div>
      ) : stats.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${i * 60}ms`,
                animationFillMode: "both",
              }}
            >
              <StatisticCard stat={stat} animate={animate} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
