import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/surveys")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
