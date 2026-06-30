import { useMutation } from "@tanstack/react-query";
import Login from "@/components/features/auth/login";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { loginMutationOptions } from "@/api/mutation-options";
import { useToastStore } from "@/services/toast/useToastStore";
import { useAuthStore } from "@/store/use-auth-store";
import { requireNoAuth } from "@/lib/route-guards";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    requireNoAuth();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { add: addToast } = useToastStore();
  const { setAuth } = useAuthStore();
  const { t } = useTranslation();

  const {
    mutate: login,
    isPending: isLoading,
    error,
  } = useMutation({
    ...loginMutationOptions(),
    onSuccess: (data) => {
      console.log(data);
      setAuth({ user: data.user as any, accessToken: data.token });
      console.log(useAuthStore.getState());
      addToast({
        title: getTranslation(t, "common.toasts.success"),
        description: getTranslation(t, "auth.login.successMessage"),
        variant: "success",
      });
      navigate({ to: "/" });
    },
    onError: (err: any) => {
      addToast({
        title: getTranslation(t, "common.toasts.error"),
        description:
          err?.response?.data?.message || getTranslation(t, "auth.login.errorMessage"),
        variant: "error",
      });
    },
  });

  const handleSubmit = async (
    email: string,
    password: string,
    remember: boolean,
  ) => {
    login({ email, password });
  };

  return (
    <Login
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error?.message}
    />
  );
}
