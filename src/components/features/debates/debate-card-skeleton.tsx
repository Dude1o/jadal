import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface WithCard {
  card?: ReactNode;
  isLoading?: boolean;
}

export function DebateCardSkeleton({ card, isLoading = true }: WithCard) {
  const { t } = useTranslation();
  if (!isLoading && card) return <>{card}</>;

  return (
    <div
      className="relative h-[380px] min-[1301px]:h-[450px] overflow-hidden bg-card
        rounded-[2rem] min-[1301px]:rounded-[2.5rem]
        shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      aria-busy="true"
      aria-label={getTranslation(t, "debates.card.loading")}
    >
      {/* 1. Top header area */}
      <div className="absolute top-0 w-full z-30 p-4 min-[1301px]:p-6 flex flex-col items-center gap-2">
        {/* Topic badge */}
        <Skeleton className="h-5 w-24 rounded-full" />
        {/* Title */}
        <Skeleton className="h-7 w-3/4 rounded-lg mt-1" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
      </div>

      {/* 2. Split background — two muted panels */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 bg-muted/60" />
        <div className="w-1/2 bg-muted/40" />
      </div>

      {/* 3. VS burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <Skeleton className="w-8 h-8 min-[1301px]:w-10 min-[1301px]:h-10 rounded-xl" />
      </div>

      {/* 4. Challenger blocks */}
      <div className="relative z-20 h-full grid grid-cols-2 pt-28 pb-14">
        {/* Challenger A */}
        <div className="flex flex-col items-center justify-center gap-3 px-3">
          <Skeleton className="h-12 w-12 min-[1301px]:h-16 min-[1301px]:w-16 rounded-full" />
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-5 w-20 min-[1301px]:w-28 rounded-md" />
            <Skeleton className="h-2.5 w-14 rounded-sm" />
          </div>
        </div>
        {/* Challenger B */}
        <div className="flex flex-col items-center justify-center gap-3 px-3">
          <Skeleton className="h-12 w-12 min-[1301px]:h-16 min-[1301px]:w-16 rounded-full" />
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-5 w-20 min-[1301px]:w-28 rounded-md" />
            <Skeleton className="h-2.5 w-14 rounded-sm" />
          </div>
        </div>
      </div>

      {/* 5. Bottom status bar */}
      <div className="absolute bottom-4 min-[1301px]:bottom-6 w-full px-6 min-[1301px]:px-10 z-30">
        <Skeleton className="h-10 min-[1301px]:h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
