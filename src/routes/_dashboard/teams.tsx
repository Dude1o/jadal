import { Suspense } from "react";
import NotFoundPage from "@/components/common/not-found";
import TeamListSkeleton from "@/components/features/teams/team-list-skeleton";
import { TeamList } from "@/components/features/teams/team-list";
import { teamsQueryOptions } from "@/api/query-options";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  type: z.enum(["random", "manual"]).optional(),
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("cards"),
});

export const Route = createFileRoute("/_dashboard/teams")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    status: search.status,
    type: search.type,
    page: search.page,
  }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(
      teamsQueryOptions({
        search: deps.search,
        status: deps.status,
        type: deps.type,
        page: deps.page,
        perPage: 12,
      }),
    ),
  component: RouteComponent,
  pendingComponent: TeamListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { status, type, view, search, page } = Route.useSearch();

  return (
    <Suspense fallback={<TeamListSkeleton />}>
      <TeamList
        status={status}
        type={type}
        view={view}
        search={search ?? ""}
        page={page}
      />
    </Suspense>
  );
}
