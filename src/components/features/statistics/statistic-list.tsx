import { StatisticCard, type Statistic } from "@/components/features/statistics/statistic-card";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Star,
  Activity,
  Package,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import type { TFunction } from "i18next";

const getSampleStats = (t: TFunction): Statistic[] => [
  {
    id: "1",
    label: getTranslation(t, "statistics.totalRevenue"),
    value: 84320,
    prefix: "$",
    trend: "up",
    trendValue: "+18.2%",
    trendLabel: getTranslation(t, "statistics.vsLastMonth"),
    icon: DollarSign,
    variant: "success",
    description: getTranslation(t, "statistics.acrossAllChannels"),
  },
  {
    id: "2",
    label: getTranslation(t, "statistics.activeUsers"),
    value: 12540,
    trend: "up",
    trendValue: "+5.7%",
    trendLabel: getTranslation(t, "statistics.vsLastWeek"),
    icon: Users,
    variant: "default",
    description: getTranslation(t, "statistics.registeredAccounts"),
  },
  {
    id: "3",
    label: getTranslation(t, "statistics.newOrders"),
    value: 3287,
    trend: "down",
    trendValue: "-3.1%",
    trendLabel: getTranslation(t, "statistics.vsYesterday"),
    icon: ShoppingCart,
    variant: "accent",
    description: getTranslation(t, "statistics.pendingFulfillment"),
  },
  {
    id: "4",
    label: getTranslation(t, "statistics.avgRating"),
    value: 94,
    suffix: "%",
    trend: "up",
    trendValue: "+1.4%",
    trendLabel: getTranslation(t, "statistics.satisfactionScore"),
    icon: Star,
    variant: "warning",
    description: getTranslation(t, "statistics.basedOnReviews"),
  },
  {
    id: "5",
    label: getTranslation(t, "statistics.conversionRate"),
    value: 7,
    suffix: "%",
    trend: "up",
    trendValue: "+0.8%",
    trendLabel: getTranslation(t, "statistics.vsLastQuarter"),
    icon: TrendingUp,
    variant: "success",
    description: getTranslation(t, "statistics.visitorToCustomer"),
  },
  {
    id: "6",
    label: getTranslation(t, "statistics.serverUptime"),
    value: 99,
    suffix: "%",
    trend: "neutral",
    trendValue: getTranslation(t, "statistics.stable"),
    icon: Activity,
    variant: "default",
    description: getTranslation(t, "statistics.thirtyDayAverage"),
  },
  {
    id: "7",
    label: getTranslation(t, "statistics.productsListed"),
    value: 1862,
    trend: "up",
    trendValue: "+42",
    trendLabel: getTranslation(t, "statistics.thisWeek"),
    icon: Package,
    variant: "accent",
    description: getTranslation(t, "statistics.acrossAllCategories"),
  },
  {
    id: "8",
    label: getTranslation(t, "statistics.openIssues"),
    value: 23,
    trend: "down",
    trendValue: "-8",
    trendLabel: getTranslation(t, "statistics.resolvedToday"),
    icon: AlertCircle,
    variant: "destructive",
    description: getTranslation(t, "statistics.requiresAttention"),
  },
];

interface StatisticListProps {
  stats?: Statistic[];
  title?: string;
  subtitle?: string;
  animate?: boolean;
}

export function StatisticList({
  stats,
  title,
  subtitle,
  animate = true,
}: StatisticListProps) {
  const { t } = useTranslation();
  const defaultStats = getSampleStats(t);
  const resolvedStats = stats ?? defaultStats;
  const resolvedTitle = title ?? getTranslation(t, "statistics.overview");
  const resolvedSubtitle = subtitle ?? getTranslation(t, "statistics.keyMetrics");
  return (
    <div className="min-h-screen py-16 px-6">
      <section className="w-full" style={{ fontFamily: "var(--font-sans)" }}>
        {/* ── Section header ── */}
        {(resolvedTitle || resolvedSubtitle) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
            <div>
              {resolvedTitle && (
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {resolvedTitle}
                </h2>
              )}
              {resolvedSubtitle && (
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {resolvedSubtitle}
                </p>
              )}
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.55 0.18 145)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "oklch(0.55 0.18 145)" }}
                />
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                {getTranslation(t, "statistics.liveData")}
              </span>
            </div>
          </div>
        )}

        {/* ── Responsive grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resolvedStats.map((stat, i) => (
            <div
              key={stat.id}
              style={{
                animationDelay: `${i * 70}ms`,
                animation: "statFadeIn 0.4s ease both",
              }}
            >
              <StatisticCard stat={stat} animate={animate} />
            </div>
          ))}
        </div>

        <style>{`
        @keyframes statFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
      </section>
    </div>
  );
}
