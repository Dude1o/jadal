import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { DialogProvider, Toaster } from "@/services";
import ErrorFallback from "@/components/common/error-fallback";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <DialogProvider />
    </>
  ),
  errorComponent: ErrorFallback,
});
