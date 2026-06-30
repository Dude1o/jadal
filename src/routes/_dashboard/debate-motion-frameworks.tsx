import ErrorFallback from "@/components/common/error-fallback";
import DebateMotionFrameworkList from "@/components/features/debates/debate-motion-framework-list";
import DebateMotionFrameworkListSkeleton from "@/components/features/debates/debate-motion-framework-list-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  // Use z.coerce.number() so incoming URL strings auto-convert to numbers smoothly
  page: z.coerce.number().optional().default(1),
  view: z.enum(["cards", "table"]).catch("cards"),
});

export const Route = createFileRoute("/_dashboard/debate-motion-frameworks")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    page: search.page,
  }),
  component: RouteComponent,
  pendingComponent: DebateMotionFrameworkListSkeleton,
  errorComponent: ErrorFallback,
});

function RouteComponent() {
  const { search, view, page } = Route.useSearch();
  return <DebateMotionFrameworkList page={page} search={search} view={view} />;
}
