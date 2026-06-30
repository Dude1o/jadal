import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "@/services/toast/useToastStore";
import {
  getErrorMessage,
  invalidateQueries,
  normalizeError,
  type ApiError,
} from "./use-create";

interface UseDeleteOptions<TData = unknown, TVariables = string | number> {
  mutationOptions: UseMutationOptions<TData, ApiError, TVariables>;
  queryKey: QueryKey;
  invalidateKeys?: QueryKey[];
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;
}

export const useDelete = <TData = unknown, TVariables = string | number>({
  mutationOptions,
  queryKey,
  invalidateKeys = [],
  successMessage = "Deleted successfully",
  errorMessage = "Failed to delete item",
  showToast = true,
  onSuccess,
  onError,
}: UseDeleteOptions<TData, TVariables>) => {
  if (!mutationOptions.mutationFn) {
    throw new Error("useDelete: mutationFn is required");
  }

  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptions,

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      const id =
        typeof variables === "object" && variables !== null
          ? ((variables as any).id ?? variables)
          : variables;

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const filterFn = (item: any) => item?.id !== id;

        if (Array.isArray(old)) return old.filter(filterFn);
        if (old?.data && Array.isArray(old.data)) {
          return { ...old, data: old.data.filter(filterFn) };
        }
        return old;
      });

      return { previous };
    },

    onSuccess: async (data, variables, context) => {
      await invalidateQueries(queryClient, [queryKey, ...invalidateKeys]);
      if (showToast) toast.success(successMessage);
      await onSuccess?.(data, variables);
      await mutationOptions.onSuccess?.(data, variables, context);
    },

    onError: async (error, variables, context) => {
      const apiError = normalizeError(error);
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      if (showToast) toast.error(getErrorMessage(error.message));
      await onError?.(apiError, variables);
      await mutationOptions.onError?.(error, variables, context);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey, exact: false });
    },
  });
};
