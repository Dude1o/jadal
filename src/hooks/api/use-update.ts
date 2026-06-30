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

interface UseUpdateOptions<
  TData = unknown,
  TVariables extends { id: string | number } = any,
> {
  mutationOptions: UseMutationOptions<TData, ApiError, TVariables>;
  queryKey: QueryKey;
  invalidateKeys?: QueryKey[];
  // Accept either a key pattern OR a function that returns the full key
  getDetailKey?: QueryKey | ((id: string | number) => QueryKey);
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;
}

export const useUpdate = <
  TData = unknown,
  TVariables extends { id: string | number } = any,
>({
  mutationOptions,
  queryKey,
  invalidateKeys = [],
  getDetailKey,
  successMessage = "Updated successfully",
  errorMessage = "Failed to update item",
  showToast = true,
  onSuccess,
  onError,
}: UseUpdateOptions<TData, TVariables>) => {
  if (!mutationOptions.mutationFn) {
    throw new Error("useUpdate: mutationFn is required");
  }

  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptions,

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updateFn = (item: any) =>
          item?.id === variables.id
            ? { ...item, ...(variables.data ?? variables) }
            : item;

        if (Array.isArray(old)) return old.map(updateFn);
        if (old?.data && Array.isArray(old.data)) {
          return { ...old, data: old.data.map(updateFn) };
        }
        if (old?.id === variables.id) {
          return { ...old, ...(variables.data ?? variables) };
        }
        return old;
      });

      return { previous };
    },

    onSuccess: async (data, variables, context) => {
      // Build keys to invalidate
      const keysToInvalidate = [queryKey, ...invalidateKeys];

      // Handle getDetailKey - can be a key pattern or a function
      if (getDetailKey) {
        if (typeof getDetailKey === "function") {
          // If it's a function, call it with the ID
          keysToInvalidate.push(getDetailKey(variables.id));
        } else {
          // If it's a key pattern, append the ID to it (convert to string for type safety)
          keysToInvalidate.push([...getDetailKey, String(variables.id)]);
        }
      }

      await invalidateQueries(queryClient, keysToInvalidate);
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
