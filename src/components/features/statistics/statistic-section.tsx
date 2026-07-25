import { Clock, AlertTriangle, Download } from "lucide-react";
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
  onExportExcel?: () => void;
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
  onExportExcel,
}: StatisticSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full space-y-4 sm:space-y-5">
      {/* Header section with layout adjustments */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {freshness && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground self-start sm:self-auto">
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">
              {getTranslation(t, "statistics.updated", { freshness })}
            </span>
          </div>
        )}

        {onExportExcel && stats.length > 0 && !isLoading && !isError && (
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg"
            title="Export to Excel"
          >
            <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">Excel</span>
          </button>
        )}
      </div>

      {/* Content wrapper */}
      {isLoading ? (
        <StatisticGridSkeleton />
      ) : isError ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-destructive/10 bg-destructive/5 p-6 text-center sm:p-8"
          role="alert"
        >
          <AlertTriangle className="h-7 w-7 text-destructive mb-2 sm:h-8 sm:w-8" />
          <h3 className="font-semibold text-destructive text-sm sm:text-base">
            {getTranslation(t, "statistics.failedToLoadSection")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {getTranslation(t, "statistics.loadErrorDescription")}
          </p>
        </div>
      ) : stats.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-10 px-4 text-center text-sm text-muted-foreground sm:py-12">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
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
