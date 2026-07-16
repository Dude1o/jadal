import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

type UserCardSkeletonProps = {
  card?: ReactNode;
  isLoading?: boolean;
};

export function UserCardSkeleton({
  card,
  isLoading = true,
}: UserCardSkeletonProps) {
  const { t } = useTranslation();

  if (!isLoading && card) return <>{card}</>;

  return (
    <div className="relative w-full max-w-75 select-none">
      {/* Card */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/60 shadow-md">
        {/* Cover */}
        <div className="relative h-28 overflow-hidden">
          <Skeleton className="w-full h-full" />
          {/* Role tag */}
          <Skeleton className="absolute top-3 right-3 h-5 w-16 rounded-full" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-9 relative z-10">
          <div className="p-[2.5px] rounded-full bg-muted shadow-lg">
            <div className="p-0.5 rounded-full bg-card">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col items-center px-5 mt-2.5 pb-1 gap-2">
          {/* Name */}
          <Skeleton className="h-4 w-32 rounded-md" />
          {/* Description lines */}
          <Skeleton className="h-3 w-48 rounded-md" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </div>

        {/* Divider */}
        <div className="mx-5 mt-4 h-px bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-border/60">
          {[
            getTranslation(t, "users.cardSkeleton.likes"),
            getTranslation(t, "users.cardSkeleton.views"),
          ].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center py-4 gap-1.5"
            >
              <Skeleton className="h-4 w-8 rounded-md" />
              <Skeleton className="h-2.5 w-6 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
