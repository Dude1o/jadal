export function StatisticCardSkeleton() {
  return (
    <div className="relative flex h-40 flex-col justify-between rounded-2xl border border-border bg-card p-5 animate-pulse">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-9 w-9 rounded-xl bg-muted" />
      </div>

      {/* Middle metric representation */}
      <div className="space-y-2 mt-2">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>

      {/* Bottom trend info */}
      <div className="h-5 w-1/3 rounded bg-muted mt-3" />
    </div>
  );
}

export function StatisticGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatisticCardSkeleton key={i} />
      ))}
    </div>
  );
}
