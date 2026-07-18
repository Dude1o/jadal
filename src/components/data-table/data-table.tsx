import { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import { useSuspenseQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import {
  getNumber,
  getTranslation,
  isAsyncOptions,
  isRTL,
  resolveOptions,
  useAsyncData,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";

import { AppToolbar } from "../layout/toolbar/app-toolbar";

export interface CustomAction<TData> {
  icon: React.ReactNode;
  label: string;
  action: (item: TData) => void;
  show?: (item: TData) => boolean;
  color?: "default" | "red" | "orange" | "violet" | "emerald";
}

const getActionColorClasses = (color?: string): string => {
  const colorMap: Record<string, string> = {
    red: "text-destructive focus:text-destructive focus:bg-destructive/10",
    orange: "text-accent focus:text-accent focus:bg-accent/10",
    violet: "text-chart-5 focus:text-chart-5 focus:bg-chart-5/10",
    emerald: "text-success focus:text-success focus:bg-success/10",
    default: "",
  };
  return colorMap[color || "default"] || "";
};

export interface StrictFilter<TData> {
  id: keyof TData;
  value: string | number | boolean | unknown;
}

export interface FacetedFilterProps<TData> {
  columnId: keyof TData;
  title: string;
  options: { label: string; value: string }[] | (() => any);
  getOptionLabel?: (item: any) => string;
  getOptionValue?: (item: any) => string | number;
}

interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface DataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  queryOptions?: QueryOptions<PaginatedApiResponse<TData>>;
  filterKey: keyof TData;
  filterValue?: string;
  facetedFilters?: FacetedFilterProps<TData>[];
  initialFilters?: StrictFilter<TData>[];
  pluralName?: string;
  onRowClick?: (id: number) => void;
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  onActions?: CustomAction<TData>[];
  filterChange?: (id: string, value: string) => void;
  onResetFilters?: () => void;
  onPageChange?: (page: number) => void;
  onSearchChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  title,
  columns,
  data: staticData,
  queryOptions,
  filterKey,
  filterValue,
  facetedFilters = [],
  initialFilters = [],
  onRowClick,
  onEdit,
  onDelete,
  onActions = [],
  filterChange,
  pluralName,
  onResetFilters,
  onPageChange,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialFilters
      .filter((f) => f.value !== undefined && f.value !== "")
      .map((f) => ({ id: String(f.id), value: f.value })),
  );

  const { data: queryResponse } = useSuspenseQuery({
    queryKey: queryOptions?.queryKey ?? ["__static_data_noop__"],
    queryFn: queryOptions?.queryFn ?? (async () => null),
    ...queryOptions,
  });

  const tableData = queryOptions
    ? (queryResponse?.data ?? [])
    : (staticData ?? []);

  const [pageSize, setPageSize] = useState(12);
  const [localPageIndex, setLocalPageIndex] = useState(0);

  // Handle async filters safely
  const asyncFilters = useMemo(
    () => facetedFilters.filter((f) => isAsyncOptions(f.options)),
    [facetedFilters],
  );

  const asyncResults = asyncFilters.map((filter) =>
    useAsyncData(filter.options),
  );

  const getFilterOptions = (filter: FacetedFilterProps<TData>) => {
    if (!isAsyncOptions(filter.options)) {
      return resolveOptions(filter.options);
    }

    const index = asyncFilters.findIndex((f) => f.columnId === filter.columnId);
    if (index === -1) return [];

    const asyncData = asyncResults[index]?.asyncData;
    const raw = Array.isArray(asyncData)
      ? asyncData
      : ((asyncData as any)?.data ?? []);

    return raw.map((item: any) => ({
      label: filter.getOptionLabel
        ? filter.getOptionLabel(item)
        : item.label || item.name || "",
      value: filter.getOptionValue
        ? filter.getOptionValue(item)
        : item.value || item.id || "",
      color_hex: item?.color_hex ?? item?.color ?? "",
    }));
  };

  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">
                  {getTranslation(t, "common.actions.openMenu")}
                </span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>
                {getTranslation(t, "common.labels.actions")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Custom actions */}
              {onActions
                .filter(
                  (customAction) =>
                    !customAction.show || customAction.show(item),
                )
                .map((customAction, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      customAction.action(item);
                    }}
                    className={`gap-2 ${getActionColorClasses(customAction.color)}`}
                  >
                    {customAction.icon}
                    {customAction.label}
                  </DropdownMenuItem>
                ))}

              {/* Separator only when both custom and built-in actions exist */}
              {onActions.length > 0 && (onEdit || onDelete) && (
                <DropdownMenuSeparator />
              )}

              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                  }}
                  className="gap-2 text-chart-6 focus:text-chart-6 focus:bg-chart-6/10"
                >
                  <Edit className="h-4 w-4" />
                  {getTranslation(t, "common.actions.edit")}
                </DropdownMenuItem>
              )}

              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                  }}
                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                  {getTranslation(t, "common.actions.delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  const finalColumns = useMemo(() => [...columns, actionColumn], [columns]);

  const table = useReactTable({
    data: tableData,
    columns: finalColumns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: queryOptions
          ? (queryResponse?.meta?.current_page ?? 1) - 1
          : localPageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const prev = {
        pageIndex: queryOptions
          ? (queryResponse?.meta?.current_page ?? 1) - 1
          : localPageIndex,
        pageSize,
      };
      const nextState = typeof updater === "function" ? updater(prev) : updater;
      setPageSize(nextState.pageSize);
      if (queryOptions) {
        onPageChange?.(nextState.pageIndex + 1);
      } else {
        setLocalPageIndex(nextState.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!queryOptions,
    pageCount: queryOptions ? (queryResponse?.meta?.last_page ?? 1) : undefined,
  });

  // Derived pagination display values.
  // For static/local data these now come from the table's own filtered
  // row model and page count, instead of being hardcoded to 1.
  const filteredRowCount = table.getFilteredRowModel().rows.length;

  const totalItems = queryOptions
    ? (queryResponse?.meta?.total ?? tableData?.length)
    : filteredRowCount;
  const currentPage = queryOptions
    ? (queryResponse?.meta?.current_page ?? 1)
    : localPageIndex + 1;
  const lastPage = queryOptions
    ? (queryResponse?.meta?.last_page ?? 1)
    : table.getPageCount();

  useEffect(() => {
    if (filterValue !== undefined) {
      table.getColumn(String(filterKey))?.setFilterValue(filterValue);
    }
  }, [filterValue, filterKey, table]);

  return (
    <div className="w-full space-y-4">
      <AppToolbar
        pluralName={pluralName}
        search={{
          title,
          value:
            (table.getColumn(String(filterKey))?.getFilterValue() as string) ??
            "",
          onChange: (value) => {
            table.getColumn(String(filterKey))?.setFilterValue(value);
            onSearchChange?.(value);
            onPageChange?.(1);
          },
        }}
        filters={facetedFilters.map((f) => ({
          id: String(f.columnId),
          label: getTranslation(t, f.title),
          value:
            table.getColumn(String(f.columnId))?.getFilterValue() || undefined,
          options: getFilterOptions(f),
        }))}
        onFilterChange={(id, value) => {
          table.getColumn(id)?.setFilterValue(value);
          filterChange?.(id, value);
        }}
        onResetFilters={() => {
          table.resetColumnFilters();
          onResetFilters?.();
        }}
      />

      <div className="rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="rtl:text-right">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.((row.original as any)?.id)}
                  className="hover:cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  {getTranslation(t, "table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="text-sm text-muted-foreground">
          {getTranslation(t, "table.rowTotal")}: {getNumber(totalItems)}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {isRTL() ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            {getTranslation(t, "table.previous")}
          </Button>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {getTranslation(t, "table.page")} {getNumber(currentPage)}{" "}
            {getTranslation(t, "table.of")} {getNumber(lastPage)}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {getTranslation(t, "table.next")}
            {isRTL() ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
