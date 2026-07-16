// components/survey/survey-list-skeleton.tsx

import { SurveyCardSkeleton } from "./survey-card-skeleton";
import HeaderSkeleton from "@/components/common/header-skeleton";

export function SurveyListSkeleton() {
  return (
    <div className="p-3 mt-12">
      <HeaderSkeleton numberOfFilters={1} />

      {/* Grid of Card Skeletons */}
      <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <SurveyCardSkeleton />
        <SurveyCardSkeleton />
        <SurveyCardSkeleton />
        <SurveyCardSkeleton />
        <SurveyCardSkeleton />
        <SurveyCardSkeleton />
      </div>
    </div>
  );
}
