import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { teamsQueryOptions } from "@/api/query-options";
import { UserList } from "@/components/features/users/user-list";
import UserListSkeleton from "@/components/features/users/user-list-skeleton";

const searchSchema = z.object({
  role: z.enum(["debater", "trainer", "judge", "viewer", "admin"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("table"),
});

export const Route = createFileRoute("/_dashboard/users/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    role: search.role,
    view: search.view,
    page: search.page,
  }),
  loader: (
    { context: { queryClient }, deps }, // ← add this
  ) =>
    queryClient.ensureQueryData(
      teamsQueryOptions({
        search: deps.search,
        role: deps.role,
        page: deps.page,
        perPage: 12,
      }),
    ),
  component: RouteComponent,
  pendingComponent: UserListSkeleton,
});

function RouteComponent() {
  const { search, role, view, page } = Route.useSearch();

  return <UserList role={role} view={view} search={search} page={page} />;
}
