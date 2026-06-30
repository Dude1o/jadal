// app/routes/_dashboard/debate-motions.tsx
import NotFoundPage from "@/components/common/not-found";
import DebateMotionList from "@/components/features/debates/debate-motion-list";
import DebateMotionListSkeleton from "@/components/features/debates/debate-motion-list-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  // Use z.coerce.number() so incoming URL strings auto-convert to numbers smoothly
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("cards"),
});

export const Route = createFileRoute("/_dashboard/debate-motions")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    page: search.page,
    view: search.view,
  }),
  component: RouteComponent,
  pendingComponent: DebateMotionListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { search, view, page } = Route.useSearch();

  return <DebateMotionList search={search ?? ""} view={view} page={page} />;
}
