import {
  complaintAccountabilityStatisticsQueryOptions,
  engagementChurnStatisticsQueryOptions,
  fairnessStatisticsQueryOptions,
  leaderboardStatisticsQueryOptions,
  platformHealthStatisticsQueryOptions,
} from "@/api/query-options";
import NotFoundPage from "@/components/common/not-found";
import { StatisticSection } from "@/components/features/statistics/statistic-section";
import { StatisticTabs } from "@/components/features/statistics/statistic-tabs";
import {
  FrameworkFairnessFilters,
  LeaderboardFilters,
  PlatformHealthFilters,
  EngagementChurnFilters,
  ComplaintAccountabilityFilters,
  type FrameworkFairnessFilterValues,
  type LeaderboardFilterValues,
  type PlatformHealthFilterValues,
  type EngagementChurnFilterValues,
  type ComplaintAccountabilityFilterValues,
} from "@/components/features/statistics/statistic-filters";
import {
  frameworkToStatistic,
  leaderboardToStatistics,
  platformHealthToStatistics,
  engagementChurnToStatistics,
  complaintAccountabilityToStatistics,
  formatRelativeTime,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { z } from "zod";

const statTabSchema = z.enum([
  "framework-fairness",
  "leaderboard",
  "platform-health",
  "engagement-churn",
  "complaint-accountability",
]);

const searchSchema = z.object({
  tab: statTabSchema.optional().default("platform-health"),

  ff_min_n_debates: z.string().optional(),
  ff_from: z.string().optional(),
  ff_to: z.string().optional(),
  ff_formats: z.string().optional(),

  lb_board: z.string().optional().default("win_rate"),
  lb_limit: z.string().optional(),
  lb_min_n_debates: z.string().optional(),
  lb_from: z.string().optional(),
  lb_to: z.string().optional(),
  lb_formats: z.string().optional(),

  ph_group_by: z.string().optional().default("month"),
  ph_from: z.string().optional(),
  ph_to: z.string().optional(),
  ph_series: z.string().optional().default("none"),
  ph_formats: z.string().optional(),

  ec_risk_filter: z.string().optional().default("all"),
  ec_recent_window_days: z.string().optional(),
  ec_baseline_window_days: z.string().optional(),
  ec_churn_threshold_days: z.string().optional(),

  ca_min_debates_involved: z.string().optional(),
  ca_target_role: z.string().optional(),
  ca_status: z.string().optional(),
  ca_from: z.string().optional(),
  ca_to: z.string().optional(),
  ca_formats: z.string().optional(),
});

function normalizeSearchParams(search: z.infer<typeof searchSchema>) {
  return {
    tab: search.tab ?? "platform-health",

    ff_min_n_debates: search.ff_min_n_debates,
    ff_from: search.ff_from,
    ff_to: search.ff_to,
    ff_formats: search.ff_formats,

    lb_board: search.lb_board ?? "win_rate",
    lb_limit: search.lb_limit,
    lb_min_n_debates: search.lb_min_n_debates,
    lb_from: search.lb_from,
    lb_to: search.lb_to,
    lb_formats: search.lb_formats,

    ph_group_by: search.ph_group_by ?? "month",
    ph_from: search.ph_from,
    ph_to: search.ph_to,
    ph_series: search.ph_series ?? "none",
    ph_formats: search.ph_formats,

    ec_risk_filter: search.ec_risk_filter ?? "all",
    ec_recent_window_days: search.ec_recent_window_days,
    ec_baseline_window_days: search.ec_baseline_window_days,
    ec_churn_threshold_days: search.ec_churn_threshold_days,

    ca_min_debates_involved: search.ca_min_debates_involved,
    ca_target_role: search.ca_target_role,
    ca_status: search.ca_status,
    ca_from: search.ca_from,
    ca_to: search.ca_to,
    ca_formats: search.ca_formats,
  } as const;
}

export const Route = createFileRoute("/_dashboard/statistics")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ search: normalizeSearchParams(search) }),
  component: RouteComponent,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const search = Route.useSearch();
  const params = normalizeSearchParams(search);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isActive = (tab: string) => params.tab === tab;

  const fairnessQuery = useQuery({
    ...fairnessStatisticsQueryOptions({
      min_n_debates: params.ff_min_n_debates
        ? Number(params.ff_min_n_debates)
        : undefined,
      from: params.ff_from,
      to: params.ff_to,
      formats: params.ff_formats
        ? params.ff_formats.split(",").map(Number)
        : undefined,
    }),
    enabled: isActive("framework-fairness"),
  });

  const leaderboardQuery = useQuery({
    ...leaderboardStatisticsQueryOptions({
      board: (params.lb_board as any) ?? "win_rate",
      limit: params.lb_limit ? Number(params.lb_limit) : undefined,
      min_n_debates: params.lb_min_n_debates
        ? Number(params.lb_min_n_debates)
        : undefined,
      from: params.lb_from,
      to: params.lb_to,
      formats: params.lb_formats
        ? params.lb_formats.split(",").map(Number)
        : undefined,
    }),
    enabled: isActive("leaderboard"),
  });

  const platformHealthQuery = useQuery({
    ...platformHealthStatisticsQueryOptions({
      group_by: (params.ph_group_by as any) ?? "month",
      series: (params.ph_series as any) ?? "none",
      from: params.ph_from,
      to: params.ph_to,
      formats: params.ph_formats
        ? params.ph_formats.split(",").map(Number)
        : undefined,
    }),
    enabled: isActive("platform-health"),
  });

  const engagementChurnQuery = useQuery({
    ...engagementChurnStatisticsQueryOptions({
      risk_filter: (params.ec_risk_filter as any) ?? "all",
      recent_window_days: params.ec_recent_window_days
        ? Number(params.ec_recent_window_days)
        : undefined,
      baseline_window_days: params.ec_baseline_window_days
        ? Number(params.ec_baseline_window_days)
        : undefined,
      churn_threshold_days: params.ec_churn_threshold_days
        ? Number(params.ec_churn_threshold_days)
        : undefined,
    }),
    enabled: isActive("engagement-churn"),
  });

  const complaintAccountabilityQuery = useQuery({
    ...complaintAccountabilityStatisticsQueryOptions({
      min_debates_involved: params.ca_min_debates_involved
        ? Number(params.ca_min_debates_involved)
        : undefined,
      target_role: (params.ca_target_role as any) || undefined,
      status: (params.ca_status as any) || undefined,
      from: params.ca_from,
      to: params.ca_to,
      formats: params.ca_formats
        ? params.ca_formats.split(",").map(Number)
        : undefined,
    }),
    enabled: isActive("complaint-accountability"),
  });

  const onFilterChange = (id: string, value: string) => {
    navigate({
      from: Route.fullPath,
      search: (prev: Record<string, unknown>) => ({ ...prev, [id]: value || undefined }),
      replace: true,
    });
  };

  const resetFilters = (prefix: string) => () => {
    navigate({
      from: Route.fullPath,
      search: (prev: Record<string, unknown>) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          if (key.startsWith(prefix)) {
            next[key] = undefined;
          }
        }
        return next;
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen space-y-6 px-6 py-12 lg:px-8">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        {getTranslation(t, "navigation.sidebar.statistics")}
      </h1>

      <StatisticTabs
        activeTab={params.tab as any}
        onTabChange={(tab) =>
          navigate({
            from: Route.fullPath,
            search: (prev: Record<string, unknown>) => ({ ...prev, tab }),
            replace: true,
          })
        }
      />

      {params.tab === "framework-fairness" && (
        <>
          <FrameworkFairnessFilters
            values={params as unknown as FrameworkFairnessFilterValues}
            onFilterChange={onFilterChange}
            onResetFilters={resetFilters("ff_")}
          />
          <StatisticSection
            title={getTranslation(t, "statistics.frameworkFairness")}
            subtitle={
              fairnessQuery.data
                ? getTranslation(t, "statistics.frameworkFairnessSubtitle", {
                    keyMetrics: getTranslation(t, "statistics.keyMetrics"),
                    minDebates: fairnessQuery.data.min_n_debates,
                  })
                : undefined
            }
            isLoading={fairnessQuery.isLoading}
            isError={fairnessQuery.isError}
            emptyMessage={getTranslation(t, "statistics.noFrameworks")}
            stats={
              fairnessQuery.data
                ? fairnessQuery.data.frameworks.map((framework) =>
                    frameworkToStatistic(framework, t),
                  )
                : []
            }
            animate
          />
        </>
      )}

      {params.tab === "leaderboard" && (
        <>
          <LeaderboardFilters
            values={params as unknown as LeaderboardFilterValues}
            onFilterChange={onFilterChange}
            onResetFilters={resetFilters("lb_")}
          />
          <StatisticSection
            title={getTranslation(t, "statistics.leaderboard")}
            subtitle={
              leaderboardQuery.data
                ? getTranslation(t, "statistics.leaderboardSubtitle", {
                    keyMetrics: getTranslation(t, "statistics.keyMetrics"),
                    minDebates: leaderboardQuery.data.min_n_debates,
                  })
                : undefined
            }
            isLoading={leaderboardQuery.isLoading}
            isError={leaderboardQuery.isError}
            emptyMessage={getTranslation(t, "statistics.noLeaderboardEntries")}
            stats={
              leaderboardQuery.data
                ? leaderboardToStatistics(leaderboardQuery.data, t)
                : []
            }
            animate
          />
        </>
      )}

      {params.tab === "platform-health" && (
        <>
          <PlatformHealthFilters
            values={params as unknown as PlatformHealthFilterValues}
            onFilterChange={onFilterChange}
            onResetFilters={resetFilters("ph_")}
          />
          <StatisticSection
            title={getTranslation(t, "statistics.platformHealth")}
            subtitle={
              platformHealthQuery.data
                ? getTranslation(t, "statistics.platformHealthSubtitle", {
                    keyMetrics: getTranslation(t, "statistics.keyMetrics"),
                  })
                : undefined
            }
            isLoading={platformHealthQuery.isLoading}
            isError={platformHealthQuery.isError}
            emptyMessage={getTranslation(t, "statistics.noActivity")}
            stats={
              platformHealthQuery.data
                ? platformHealthToStatistics(platformHealthQuery.data, t)
                : []
            }
            animate
          />
        </>
      )}

      {params.tab === "engagement-churn" && (
        <>
          <EngagementChurnFilters
            values={params as unknown as EngagementChurnFilterValues}
            onFilterChange={onFilterChange}
            onResetFilters={resetFilters("ec_")}
          />
          <StatisticSection
            title={getTranslation(t, "statistics.engagementChurn")}
            subtitle={
              engagementChurnQuery.data
                ? getTranslation(t, "statistics.engagementChurnSubtitle", {
                    keyMetrics: getTranslation(t, "statistics.keyMetrics"),
                    total: engagementChurnQuery.data.meta.total,
                  })
                : undefined
            }
            freshness={
              engagementChurnQuery.data
                ? formatRelativeTime(
                    engagementChurnQuery.data.generated_at,
                    t,
                  )
                : undefined
            }
            isLoading={engagementChurnQuery.isLoading}
            isError={engagementChurnQuery.isError}
            emptyMessage={getTranslation(t, "statistics.noDebaters")}
            stats={
              engagementChurnQuery.data
                ? engagementChurnToStatistics(engagementChurnQuery.data, t)
                : []
            }
            animate
          />
        </>
      )}

      {params.tab === "complaint-accountability" && (
        <>
          <ComplaintAccountabilityFilters
            values={params as unknown as ComplaintAccountabilityFilterValues}
            onFilterChange={onFilterChange}
            onResetFilters={resetFilters("ca_")}
          />
          <StatisticSection
            title={getTranslation(t, "statistics.complaintAccountability")}
            subtitle={
              complaintAccountabilityQuery.data?.unattributed_total &&
              complaintAccountabilityQuery.data.unattributed_total > 0
                ? getTranslation(t, "statistics.unattributedComplaints", {
                    count:
                      complaintAccountabilityQuery.data.unattributed_total,
                  })
                : undefined
            }
            isLoading={complaintAccountabilityQuery.isLoading}
            isError={complaintAccountabilityQuery.isError}
            emptyMessage={getTranslation(t, "statistics.noExposureEntries")}
            stats={
              complaintAccountabilityQuery.data
                ? complaintAccountabilityToStatistics(
                    complaintAccountabilityQuery.data,
                    t,
                  )
                : []
            }
            animate
          />
        </>
      )}
    </div>
  );
}
