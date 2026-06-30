import HeaderSkeleton from "@/components/common/header-skeleton";
import { TeamCardSkeleton } from "./team-card-skeleton";

export default function TeamListSkeleton() {
  return (
    <div className="min-h-screen py-6 px-6">
      <HeaderSkeleton numberOfFilters={1} />
      <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        <TeamCardSkeleton />
        <TeamCardSkeleton />
        <TeamCardSkeleton />
        <TeamCardSkeleton />
        <TeamCardSkeleton />
        <TeamCardSkeleton />
      </div>
    </div>
  );
}
