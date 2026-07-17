import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { StatisticSection } from "./statistic-section";
import {
  frameworkToStatistic,
  leaderboardToStatistics,
  platformHealthToStatistics,
  engagementChurnToStatistics,
  complaintAccountabilityToStatistics,
  formatRelativeTime,
  getSampleStats,
} from "../../../lib/utils";
import type {
  ComplaintAccountability,
  EngagementChurn,
  FrameworkFairness,
  Leaderboard,
  PlatformHealth,
  QueryLike,
  Statistic,
} from "@/types";

interface StatisticListProps {
  stats?: Statistic[];
  title?: string;
  subtitle?: string;
  animate?: boolean;

  frameworkFairness?: QueryLike<FrameworkFairness>;
  leaderboard?: QueryLike<Leaderboard>;
  platformHealth?: QueryLike<PlatformHealth>;
  engagementChurn?: QueryLike<EngagementChurn>;
  complaintAccountability?: QueryLike<ComplaintAccountability>;
}

interface SectionSpec {
  key: string;
  title: string;
  subtitle?: string;
  freshness?: string;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  stats: Statistic[];
}

export function StatisticList({
  stats,
  title,
  subtitle,
  animate = true,
  frameworkFairness,
  leaderboard,
  platformHealth,
  engagementChurn,
  complaintAccountability,
}: StatisticListProps) {
  const { t } = useTranslation();

  const sections = useMemo<SectionSpec[]>(() => {
    const built: SectionSpec[] = [];

    if (frameworkFairness) {
      built.push({
        key: "framework-fairness",
        title: getTranslation(t, "statistics.frameworkFairness"),
        subtitle: frameworkFairness.data
          ? getTranslation(t, "statistics.frameworkFairnessSubtitle", {
              keyMetrics: getTranslation(t, "statistics.keyMetrics"),
              minDebates: frameworkFairness.data.min_n_debates,
            })
          : undefined,
        isLoading: frameworkFairness.isLoading,
        isError: frameworkFairness.isError,
        emptyMessage: getTranslation(t, "statistics.noFrameworks"),
        stats: frameworkFairness.data
          ? frameworkFairness.data.frameworks.map((framework) =>
              frameworkToStatistic(framework, t),
            )
          : [],
      });
    }

    if (leaderboard) {
      built.push({
        key: "leaderboard",
        title: getTranslation(t, "statistics.leaderboard"),
        subtitle: leaderboard.data
          ? getTranslation(t, "statistics.leaderboardSubtitle", {
              keyMetrics: getTranslation(t, "statistics.keyMetrics"),
              minDebates: leaderboard.data.min_n_debates,
            })
          : undefined,
        isLoading: leaderboard.isLoading,
        isError: leaderboard.isError,
        emptyMessage: getTranslation(t, "statistics.noLeaderboardEntries"),
        stats: leaderboard.data
          ? leaderboardToStatistics(leaderboard.data, t)
          : [],
      });
    }

    if (platformHealth) {
      built.push({
        key: "platform-health",
        title: getTranslation(t, "statistics.platformHealth"),
        subtitle: platformHealth.data
          ? getTranslation(t, "statistics.platformHealthSubtitle", {
              keyMetrics: getTranslation(t, "statistics.keyMetrics"),
            })
          : undefined,
        isLoading: platformHealth.isLoading,
        isError: platformHealth.isError,
        emptyMessage: getTranslation(t, "statistics.noActivity"),
        stats: platformHealth.data
          ? platformHealthToStatistics(platformHealth.data, t)
          : [],
      });
    }

    if (engagementChurn) {
      built.push({
        key: "engagement-churn",
        title: getTranslation(t, "statistics.engagementChurn"),
        subtitle: engagementChurn.data
          ? getTranslation(t, "statistics.engagementChurnSubtitle", {
              keyMetrics: getTranslation(t, "statistics.keyMetrics"),
              total: engagementChurn.data.meta.total,
            })
          : undefined,
        freshness: engagementChurn.data
          ? formatRelativeTime(engagementChurn.data.generated_at, t)
          : undefined,
        isLoading: engagementChurn.isLoading,
        isError: engagementChurn.isError,
        emptyMessage: getTranslation(t, "statistics.noDebaters"),
        stats: engagementChurn.data
          ? engagementChurnToStatistics(engagementChurn.data, t)
          : [],
      });
    }

    if (complaintAccountability) {
      built.push({
        key: "complaint-accountability",
        title: getTranslation(t, "statistics.complaintAccountability"),
        subtitle:
          complaintAccountability.data?.unattributed_total &&
          complaintAccountability.data.unattributed_total > 0
            ? getTranslation(t, "statistics.unattributedComplaints", {
                count: complaintAccountability.data.unattributed_total,
              })
            : undefined,
        isLoading: complaintAccountability.isLoading,
        isError: complaintAccountability.isError,
        emptyMessage: getTranslation(t, "statistics.noExposureEntries"),
        stats: complaintAccountability.data
          ? complaintAccountabilityToStatistics(
              complaintAccountability.data,
              t,
            )
          : [],
      });
    }

    if (built.length > 0) return built;

    // Fallback: If no stats props are passed, return legacy sample metric section
    return [
      {
        key: "sample",
        title: title ?? getTranslation(t, "statistics.overview"),
        subtitle: subtitle ?? getTranslation(t, "statistics.keyMetrics"),
        isLoading: false,
        isError: false,
        emptyMessage: getTranslation(t, "statistics.noData"),
        stats: stats ?? getSampleStats(t),
      },
    ];
  }, [
    t,
    frameworkFairness,
    leaderboard,
    platformHealth,
    engagementChurn,
    complaintAccountability,
    stats,
    title,
    subtitle,
  ]);

  return (
    <div className="min-h-screen space-y-12 px-6 py-12 md:space-y-16 lg:px-8">
      {sections.map((section) => (
        <StatisticSection {...section} key={section.key} animate={animate} />
      ))}
    </div>
  );
}
