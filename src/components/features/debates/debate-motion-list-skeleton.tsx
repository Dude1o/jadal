// components/motion/debate-motion-list-skeleton.tsx
"use client";

import { useSearch } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import DebateMotionCardSkeleton from "./debate-motion-card-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function DebateMotionListSkeleton({
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
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <DebateMotionCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <DataTableSkeleton rowCount={count} columnCount={4} />
      )}
    </div>
  );
}
