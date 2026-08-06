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

  // Columns are only meaningful relative to their peers in the same section.
  const sectionMax = stats.reduce((max, s) => Math.max(max, s.value), 0);

  return (
    <section className="w-full space-y-5">
      {/* Header section with layout adjustments */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[length:var(--text-subtitle)] font-extrabold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[length:var(--text-caption)] font-semibold text-muted-foreground">
              {subtitle}
            </p>
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
            className="inline-flex h-10 cursor-pointer items-center gap-2 self-start rounded-[18px] bg-[var(--accent-btn)] px-4 text-[length:var(--text-caption)] font-bold text-[var(--accent-btn-fg)] shadow-[0_2px_4px_-2px_rgba(234,124,28,.28),0_8px_18px_-6px_rgba(234,124,28,.40)] transition-[background-color,transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-btn-hover)] sm:self-auto"
            title="Export to Excel"
          >
            <Download className="size-[18px] shrink-0" strokeWidth={2} />
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {stats.map((stat, i) => (
            <StatisticCard
              key={stat.id}
              stat={stat}
              animate={animate}
              sectionMax={sectionMax}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
