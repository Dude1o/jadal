import { Skeleton } from "@/components/ui/skeleton";
import { BlogCardSkeleton } from "./blog-card-skeleton";

export default function BlogListSkeleton() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{
          background: "color-mix(in oklch, var(--background) 85%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3">
          {/* Title and Toggle Buttons */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-32 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
        {/* Pagination Skeleton */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <BlogCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
