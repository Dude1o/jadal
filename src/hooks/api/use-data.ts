import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useData = <TData>(
  queryOptions: UseQueryOptions<TData>,
  options?: Partial<UseQueryOptions<TData>>,
) =>
  useQuery({
    ...queryOptions,
    ...options,
  });
