import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface WithCard {
  card?: ReactNode;
  isLoading?: boolean;
}

export function BlogCardSkeleton({ card, isLoading = true }: WithCard) {
  const { t } = useTranslation();
  if (!isLoading && card) return <>{card}</>;

  return (
    <div
      className="relative bg-card border border-border rounded-xl overflow-hidden"
      aria-busy="true"
      aria-label={getTranslation(t, "blogs.card.blogLoading")}
    >
      {/* Mobile: full-width cover on top */}
      <div className="sm:hidden">
        <Skeleton className="h-36 w-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-0">
        {/* Vote rail */}
        <div
          className="flex flex-row sm:flex-col items-center justify-center
            gap-4 sm:gap-3 px-4 py-3 sm:px-4 sm:py-5 shrink-0"
          style={{
            background: "color-mix(in oklch, var(--muted) 55%, transparent)",
          }}
        >
          {/* Up */}
          <div className="flex sm:flex-col flex-row items-center gap-2 sm:gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-3.5 w-6 rounded-md" />
          </div>
          {/* Divider */}
          <div className="w-px h-6 sm:h-px sm:w-6 bg-border" />
          {/* Down */}
          <div className="flex sm:flex-col flex-row items-center gap-2 sm:gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-3.5 w-6 rounded-md" />
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex flex-col flex-1 min-w-0 p-4 gap-3"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>

          {/* Title + thumbnail */}
          <div className="flex gap-3 items-start">
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              {/* Excerpt */}
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
            {/* Thumbnail — only sm+ */}
            <Skeleton className="hidden sm:block h-16 w-24 rounded-lg shrink-0" />
          </div>

          {/* Tags */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
