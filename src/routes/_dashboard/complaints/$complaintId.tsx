import { createFileRoute } from "@tanstack/react-router";
import { complaintQueryOptions } from "@/api/query-options";
import ErrorFallback from "@/components/common/error-fallback";
import { ComplaintDetails } from "@/components/features/complaints/complaint-details";

export const Route = createFileRoute("/_dashboard/complaints/$complaintId")({
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(
      complaintQueryOptions(Number(params.complaintId)),
    ),
  component: RouteComponent,
  errorComponent: ErrorFallback,
});

function RouteComponent() {
  const { complaintId } = Route.useParams();
  return <ComplaintDetails complaintId={Number(complaintId)} />;
}
