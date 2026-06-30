import { SurveyList } from "@/components/features/surveys/survey-list";
import { SurveyListSkeleton } from "@/components/features/surveys/survey-list-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["open", "closing-soon", "closed"]).optional(), // changed
  page: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute("/_dashboard/surveys/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    search: search.search,
    state: search.status,
    page: search.page,
  }),
  pendingComponent: SurveyListSkeleton,
  component: RouteComponent,
});

function RouteComponent() {
  const { status, search, page } = Route.useSearch();

  return <SurveyList page={page} search={search} status={status} />;
}
