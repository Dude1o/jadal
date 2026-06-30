import AppHeader from "@/components/common/app-header";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyCardSkeleton } from "./survey-card-skeleton";

type Props = {
  status?: string;
  search?: string;
};

export function SurveyListSkeleton({ status = "", search = "" }: Props) {
  return (
    <div className="min-h-screen py-16 px-6 overflow-x-hidden">
      {/* Header Skeleton */}
      <AppHeader
        title="Surveys"
        buttonLabel="Create Survey"
        onCreate={() => {}}
        isLoading
      />

      {/* Toolbar Skeleton */}
      <AppToolbar
        search={{
          title: "Search surveys...",
          value: search,
          onChange: () => {},
        }}
        filters={[
          {
            id: "status",
            label: "Filter by status",
            value: status,
            options: [],
          },
        ]}
        onFilterChange={() => {}}
        onResetFilters={() => {}}
        isLoading
      />

      {/* Showing X results line */}
      <div className="mt-6 mb-4">
        <Skeleton className="h-3 w-40" />
      </div>

      {/* Grid of Card Skeletons */}
      <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch">
        {Array.from({ length: 6 }).map((_, i) => (
          <SurveyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
