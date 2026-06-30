import { createFileRoute } from "@tanstack/react-router";
import { debateQueryOptions } from "@/api/query-options";
import ErrorFallback from "@/components/common/error-fallback";
import { DebateDetails } from "@/components/features/debates/debate-details";
import { DebateDetailsSkeleton } from "@/components/features/debates/debate-details-skeleton";

export const Route = createFileRoute("/_dashboard/debates/$debateId")({
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(
      debateQueryOptions(Number(params.debateId)),
    ),
  component: RouteComponent,
  pendingComponent: DebateDetailsSkeleton,
  errorComponent: ErrorFallback,
});

function RouteComponent() {
  const { debateId } = Route.useParams();
  return <DebateDetails debateId={Number(debateId)} />;
}
