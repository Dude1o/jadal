import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DebateDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-9 w-32" />

        {/* Hero Skeleton */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-muted" />
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8">
              <Skeleton className="w-28 h-28 rounded-3xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
              </div>
              <Skeleton className="h-11 w-40" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Motion Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>

            {/* Phases Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-52" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </CardContent>
            </Card>

            {/* Participants Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-56" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-32" />
              </CardHeader>
              <CardContent className="py-12">
                <Skeleton className="h-32 w-32 mx-auto rounded-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
