import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { DialogProvider, Toaster } from "@/services";
import ErrorFallback from "@/components/common/error-fallback";
import { GlobalSpinner } from "@/components/common/global-spinner";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <GlobalSpinner />
      <Toaster />
      <DialogProvider />
    </>
  ),
  errorComponent: ErrorFallback,
});
