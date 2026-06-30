import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function DebateMotionFrameworkCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 w-full">
            {/* Color Swatch Skeleton */}
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />

            <div className="flex-1 space-y-2">
              {/* Name Skeleton */}
              <Skeleton className="h-5 w-3/4" />
              {/* Color Hex Skeleton */}
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Date Skeleton */}
        <Skeleton className="h-4 w-24" />
      </CardContent>

      <CardFooter className="pt-4 border-t flex gap-2">
        {/* Edit Button Skeleton */}
        <Skeleton className="flex-1 h-9" />
        {/* Delete Button Skeleton */}
        <Skeleton className="flex-1 h-9" />
      </CardFooter>
    </Card>
  );
}
