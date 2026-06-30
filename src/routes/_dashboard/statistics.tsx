import NotFoundPage from "@/components/common/not-found";
import { StatisticList } from "@/components/features/statistics/statistic-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/statistics")({
  component: RouteComponent,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  return <StatisticList />;
}
