"use client";

import { useSearch } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import DebateMotionFrameworkCardSkeleton from "./debate-motion-framework-card-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function DebateMotionFrameworkListSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  const searchParams = useSearch({ strict: false });
  const view = searchParams?.view ?? "cards";

  return (
    <div className="space-y-6 p-5">
      {view === "cards" ? (
        <>
          {/* Header Skeletons */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Card Grid Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <DebateMotionFrameworkCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Header Skeletons */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Table Skeleton */}
          <DataTableSkeleton rowCount={count} columnCount={4} />
        </>
      )}
    </div>
  );
}
