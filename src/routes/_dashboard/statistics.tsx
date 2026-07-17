import {
  complaintAccountabilityStatisticsQueryOptions,
  engagementChurnStatisticsQueryOptions,
  fairnessStatisticsQueryOptions,
  leaderboardStatisticsQueryOptions,
  platformHealthStatisticsQueryOptions,
} from "@/api/query-options";
import NotFoundPage from "@/components/common/not-found";
import { StatisticList } from "@/components/features/statistics/statistic-list";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/statistics")({
  component: RouteComponent,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const fairness = useQuery(fairnessStatisticsQueryOptions());
  const leaderboard = useQuery(
    leaderboardStatisticsQueryOptions({ board: "win_rate" }),
  );
  const platformHealth = useQuery(platformHealthStatisticsQueryOptions());
  const engagementChurn = useQuery(engagementChurnStatisticsQueryOptions());
  const complaintAccountability = useQuery(
    complaintAccountabilityStatisticsQueryOptions(),
  );

  return (
    <StatisticList
      frameworkFairness={fairness}
      leaderboard={leaderboard}
      platformHealth={platformHealth}
      engagementChurn={engagementChurn}
      complaintAccountability={complaintAccountability}
    />
  );
}
