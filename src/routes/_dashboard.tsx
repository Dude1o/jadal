// routes/_dashboard.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { LangToggle } from "@/components/common/lang-toggle";
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
        <main className="w-full min-w-0 overflow-x-hidden">
          <div className="flex items-center gap-2 p-2">
            <SidebarTrigger />
            <ModeToggle />
            <LangToggle />
          </div>
          {/* This Outlet renders the children (blogs, statistics, etc.) */}
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}
