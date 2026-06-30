// app/routes/_dashboard/debate-formats.tsx
import { debateFormatsQueryOptions } from "@/api/query-options";
import NotFoundPage from "@/components/common/not-found";
import DebateFormatList from "@/components/features/debates/debate-format-list";
import DebateFormatListSkeleton from "@/components/features/debates/debate-format-list-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("cards"),
});

export const Route = createFileRoute("/_dashboard/debate-formats")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    page: search.page,
  }),
  loader: (
    { context: { queryClient }, deps }, // ← add this
  ) =>
    queryClient.ensureQueryData(
      debateFormatsQueryOptions({
        search: deps.search,
        page: deps.page,
        perPage: 12,
      }),
    ),
  component: RouteComponent,
  pendingComponent: DebateFormatListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { search, view, page } = Route.useSearch();

  return <DebateFormatList search={search ?? ""} view={view} page={page} />;
}
