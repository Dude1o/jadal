import DebateList from "@/components/features/debates/debate-list";
import NotFoundPage from "@/components/common/not-found";
import DebateListSkeleton from "@/components/features/debates/debate-list-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  state: z
    .enum([
      "scheduled",
      "announced",
      "teams-selected",
      "live",
      "completed",
      "cancelled",
    ])
    .optional(),
  topic: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("cards"), // ← new
});

export const Route = createFileRoute("/_dashboard/debates/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    state: search.state,
    page: search.page,
    topic: search.topic,
    view: search.view,
  }),

  component: RouteComponent,
  pendingComponent: DebateListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { state, topic, view, search, page } = Route.useSearch();

  return (
    <DebateList
      state={state}
      topic={topic}
      view={view}
      search={search ?? ""}
      page={page}
    />
  );
}
