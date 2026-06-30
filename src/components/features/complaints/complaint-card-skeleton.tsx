import { Skeleton } from "@/components/ui/skeleton";

export default function ComplaintCardSkeleton() {
  return (
    <div className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-card">
      {/* Accent bar */}
      <Skeleton className="h-1 w-full rounded-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Skeleton className="shrink-0 mt-0.5 h-8 w-8 rounded-lg" />
          <div className="flex-1 pt-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>
        </div>
        <Skeleton className="shrink-0 h-7 w-7 rounded-lg" />
      </div>

      {/* Description */}
      <div className="px-5 pb-4 flex-1">
        <div className="h-px w-full mb-3 bg-border" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 mt-auto border-t border-border bg-muted/40">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
