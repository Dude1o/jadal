import HeaderSkeleton from "@/components/common/header-skeleton";
import ComplaintCardSkeleton from "./complaint-card-skeleton";

export default function ComplaintListSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="p-3 mt-12">
        <HeaderSkeleton numberOfFilters={0} />
        <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <ComplaintCardSkeleton />
          <ComplaintCardSkeleton />
          <ComplaintCardSkeleton />
          <ComplaintCardSkeleton />
          <ComplaintCardSkeleton />
          <ComplaintCardSkeleton />
        </div>
      </div>
    </div>
  );
}
