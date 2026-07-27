import { createFileRoute } from "@tanstack/react-router";
import { AchievementCatalogList } from "@/components/features/achievements/achievement-catalog-list";
import { Suspense } from "react";

export const Route = createFileRoute("/_dashboard/achievements")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<div />}>
      <AchievementCatalogList />
    </Suspense>
  );
}
