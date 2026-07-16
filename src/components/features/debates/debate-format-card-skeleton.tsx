// components/debate-format/debate-format-card-skeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DebateFormatCardSkeleton() {
  return (
    <Card className="relative w-full max-w-sm flex flex-col overflow-hidden border border-border shadow-md bg-card">
      {/* Top accent gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-muted" />

      <CardHeader className="relative pb-3 pt-6 px-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 flex-1 min-w-0 pr-3">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-11/12 rounded-md" />
            <Skeleton className="h-3.5 w-2/3 rounded-md" />
          </div>
          <Skeleton className="flex-shrink-0 h-10 w-10 rounded-xl" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-6 pb-6 pt-0 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-7 w-8 rounded-md" />
          </div>
          <div className="rounded-xl bg-muted/50 border border-border p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-7 w-8 rounded-md" />
          </div>
        </div>

        {/* Quick phase preview */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-px w-full rounded-none" />

        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
