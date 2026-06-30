// components/debate-format/debate-format-list-skeleton.tsx
"use client";

import { useSearch } from "@tanstack/react-router";
import DebateFormatCardSkeleton from "./debate-format-card-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface DebateFormatListSkeletonProps {
  count?: number;
}

export default function DebateFormatListSkeleton({
  count = 6,
}: DebateFormatListSkeletonProps) {
  const searchParams = useSearch({ strict: false });
  const view = searchParams?.view ?? "cards";

  return (
    <div className="space-y-6 p-5">
      {view === "cards" ? (
        <>
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-9 w-64 bg-muted rounded-md animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <DebateFormatCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <DataTableSkeleton rowCount={count} columnCount={4} />
      )}
    </div>
  );
}
