// components/debate/debate-list-skeleton.tsx
"use client";

import { useSearch } from "@tanstack/react-router";
import HeaderSkeleton from "@/components/common/header-skeleton";
import { DebateCardSkeleton } from "./debate-card-skeleton";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function DebateListSkeleton() {
  const searchParams = useSearch({ strict: false });
  const view = searchParams?.view ?? "cards";

  return (
    <div className="min-h-screen py-16 px-6">
      {view === "cards" ? (
        <>
          <HeaderSkeleton numberOfFilters={2} />
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DebateCardSkeleton />
            <DebateCardSkeleton />
            <DebateCardSkeleton />
            <DebateCardSkeleton />
            <DebateCardSkeleton />
            <DebateCardSkeleton />
          </div>
        </>
      ) : (
        <DataTableSkeleton rowCount={6} columnCount={5} />
      )}
    </div>
  );
}
