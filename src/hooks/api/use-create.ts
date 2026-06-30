import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "@/services/toast/useToastStore";
import { isRTL } from "@/lib/utils";

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

interface UseCreateOptions<TData = unknown, TVariables = unknown> {
  mutationOptions: UseMutationOptions<TData, ApiError, TVariables>;
  queryKey: QueryKey; // Usually the LIST key
  invalidateKeys?: QueryKey[];
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
}

export const useCreate = <TData = unknown, TVariables = unknown>({
  mutationOptions,
  queryKey,
  invalidateKeys = [],
  successMessage = "Created successfully",
  errorMessage = "Failed to create item",
  showToast = true,
  onSuccess,
  onError,
}: UseCreateOptions<TData, TVariables>) => {
  if (!mutationOptions.mutationFn) {
    throw new Error("useCreate: mutationFn is required");
  }

  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptions,
    onSuccess: async (newData, variables, context) => {
      try {
        // Invalidate list + any other related queries
        await invalidateQueries(queryClient, [queryKey, ...invalidateKeys]);

        if (showToast) toast.success(successMessage);
        await onSuccess?.(newData);
        await mutationOptions.onSuccess?.(newData, variables, context);
      } catch (err) {
        console.error("useCreate onSuccess error", err);
      }
    },

    onError: async (error, variables, context) => {
      const apiError = normalizeError(error);

      if (showToast) toast.error(getErrorMessage(error.message));

      await onError?.(apiError);
      await mutationOptions.onError?.(error, variables, context);
    },
  });
};

/* ====================== Shared Helpers ====================== */

export async function invalidateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKeys: QueryKey[],
) {
  for (const key of queryKeys) {
    await queryClient.invalidateQueries({
      queryKey: key,
      exact: false, // ← Changed: this is the most important fix
    });
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message || "An error occurred",
      status: (error as any).status,
      code: (error as any).code,
    };
  }
  return { name: "ApiError", message: "An unknown error occurred" } as ApiError;
}

export function getErrorMessage(errorString: string) {
  // إزالة الجزء "(and X more error)" إذا وجد
  const cleaned = errorString
    .replace(/\s*\(and \d+ more error[s]?\)/i, "")
    .trim();

  // تقسيم النص حسب "|"
  const parts = cleaned.split(/\s*\|\s*/);

  // إذا كان هناك جزئين (عربي | English)
  if (parts.length >= 2) {
    return isRTL() ? parts[0].trim() : parts[1].trim();
  }

  // إذا كان النص عربي فقط أو إنجليزي فقط
  return cleaned;
}
