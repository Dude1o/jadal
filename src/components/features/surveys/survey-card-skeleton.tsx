import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SurveyCardSkeleton() {
  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/40">
      {/* Top Status Accent */}
      <div className="h-1 w-full bg-muted" />

      <CardContent className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-4">
          {/* Title & Description */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>

        {/* Target Roles */}
        <div className="flex flex-wrap gap-1 pt-6">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between border-t border-border/30 bg-muted/10 px-6 py-3.5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}
