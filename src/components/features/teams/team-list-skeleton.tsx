// components/team/team-list-skeleton.tsx
"use client";

import { useSearch } from "@tanstack/react-router";
import HeaderSkeleton from "@/components/common/header-skeleton";
import { TeamCardSkeleton } from "./team-card-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function TeamListSkeleton() {
  // Read the active search parameters object straight from the route location state
  const searchParams = useSearch({ strict: false });

  // Safely grab the active view layout string defaulting back to cards view style
  const view = searchParams?.view ?? "cards";

  return (
    <div className="p-3 mt-12">
      {/* Render the structural card search filter header layout parameters only if selected */}
      {view === "cards" && <HeaderSkeleton numberOfFilters={1} />}

      {view === "cards" ? (
        <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
        </div>
      ) : (
        <div className="mt-5">
          {/* Automatically inject tabular framework parameters if view property equals 'table' */}
          <DataTableSkeleton rowCount={6} columnCount={4} />
        </div>
      )}
    </div>
  );
}
