import ComplaintList from "@/components/features/complaints/complaint-list";
import NotFoundPage from "@/components/common/not-found";
import ComplaintListSkeleton from "@/components/features/complaints/complaint-list-skeleton";
import { compalintsQueryOptions } from "@/api/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/complaints/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(compalintsQueryOptions()),
  component: RouteComponent,
  pendingComponent: ComplaintListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { data: complaints } = useSuspenseQuery(compalintsQueryOptions());

  return <ComplaintList onDismiss={() => {}} complaints={complaints} />;
}
