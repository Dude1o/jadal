// routes/_dashboard.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { useRtl } from "@/lib/utils";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: () => {
    requireAuth();
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { dir } = useRtl();

  return (
    <div dir={dir} className="min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        {/* The well: transparent so the pinned app wash shows through. */}
        <main className="w-full min-w-0 overflow-x-hidden bg-transparent">
          <TopBar />
          {/* This Outlet renders the children (blogs, statistics, etc.) */}
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
