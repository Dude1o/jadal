import { Skeleton } from "../ui/skeleton";

interface Props {
  numberOfFilters: number;
}

export default function HeaderSkeleton({ numberOfFilters }: Props) {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Skeleton className="h-6 w-35" />
        <Skeleton className="h-6 w-6" />
      </div>
      {numberOfFilters > 0 && (
        <div className="my-3 flex flex-col lg:flex-row gap-2">
          <Skeleton className="h-6 w-73 md:w-95" />
          <div className="flex flex-col md:flex-row gap-0.5">
            {Array.from({ length: numberOfFilters }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-40" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
