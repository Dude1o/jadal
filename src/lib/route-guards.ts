// lib/route-guards.ts
import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/use-auth-store";

export const requireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthStore.getState();

  // If store is still loading persisted data, don't decide yet
  if (isLoading) {
    return; // let the route load, the component can handle it
  }

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
      replace: true,
    });
  }
};

export const requireNoAuth = () => {
  const { isAuthenticated, isLoading } = useAuthStore.getState();

  if (isLoading) return;

  if (isAuthenticated) {
    throw redirect({
      to: "/dashboard",
      replace: true,
    });
  }
};
