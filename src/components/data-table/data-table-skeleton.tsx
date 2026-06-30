// components/data-table/data-table-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  /** Number of body rows to display. Defaults to 5. */
  rowCount?: number;
  /** Number of data table columns to render. Defaults to 4. */
  columnCount?: number;
}

export function DataTableSkeleton({
  rowCount = 5,
  columnCount = 4,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* 1. Header Block Skeleton */}
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* 2. Main Search & Filter Control Bar */}
      <Skeleton className="h-10 w-full" />

      {/* 3. Data Table Layout Wireframe */}
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Table Header Row */}
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              {Array.from({ length: columnCount }).map((_, columnIndex) => (
                <th key={`head-cell-${columnIndex}`} className="p-4">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body Rows */}
          <tbody className="divide-y divide-border">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={`body-row-${rowIndex}`} className="hover:bg-muted/5">
                {Array.from({ length: columnCount }).map((_, columnIndex) => (
                  <td
                    key={`body-cell-${rowIndex}-${columnIndex}`}
                    className="p-4"
                  >
                    {/* Varied widths per column index to look like organic textual data rows */}
                    <Skeleton
                      className="h-4"
                      style={{
                        width:
                          columnIndex === 0
                            ? "65%"
                            : columnIndex === columnCount - 1
                              ? "35%"
                              : "50%",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Layout Pagination Component Footer */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
