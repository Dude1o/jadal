// src/routes/_dashboard/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { surveyQueryOptions } from "@/api/query-options";
import ErrorFallback from "@/components/common/error-fallback";
import { SurveyDetails } from "@/components/features/surveys/survey-details";

export const Route = createFileRoute("/_dashboard/surveys/$surveyId")({
  // ✅ REMOVED loaderDeps completely
  loader: async ({ context, params }) =>
    await context.queryClient.ensureQueryData(
      surveyQueryOptions(Number(params.surveyId)),
    ),
  component: RouteComponent,
  errorComponent: ErrorFallback,
});

function RouteComponent() {
  const { surveyId } = Route.useParams();

  return <SurveyDetails surveyId={Number(surveyId)} />;
}
