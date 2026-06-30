// src/routes/_dashboard/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { UserDetailsSkeleton } from "@/components/features/users/user-details-skeleton";
import { userQueryOptions } from "@/api/query-options";
import ErrorFallback from "@/components/common/error-fallback";
import { UserDetails } from "@/components/features/users/user-details";

export const Route = createFileRoute("/_dashboard/users/$userId")({
  // ✅ REMOVED loaderDeps completely
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(
      userQueryOptions(Number(params.userId)),
    ),
  component: RouteComponent,
  pendingComponent: UserDetailsSkeleton,
  errorComponent: ErrorFallback,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  return <UserDetails userId={Number(userId)} />;
}
