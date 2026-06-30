import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface WithCard {
  card?: ReactNode;
  isLoading?: boolean;
}

export function TeamCardSkeleton({ card, isLoading = true }: WithCard) {
  const { t } = useTranslation();

  if (!isLoading && card) return <>{card}</>;

  return (
    <div
      className="relative w-full overflow-hidden bg-card rounded-2xl
        shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      aria-busy="true"
      aria-label={getTranslation(t, "teams.card.teamActions")}
    >
      {/* Cover */}
      <Skeleton className="h-36 w-full rounded-t-2xl rounded-b-none" />

      <div className="relative px-5">
        {/* Avatar */}
        <div className="absolute -top-7 start-4">
          <div className="p-[3px] rounded-full bg-muted">
            <div className="p-[2.5px] rounded-full bg-card">
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
          </div>
        </div>

        <div className="pt-10 pb-5 space-y-4">
          {/* Name + city */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border rounded-full" />

          {/* Leader row */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            <Skeleton className="h-3.5 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
