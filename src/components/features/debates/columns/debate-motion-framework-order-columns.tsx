// lib/columns/debate-motion-framework-order-columns.ts
import { getTranslation } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { MotionFramework } from "@/types";
import type { TFunction } from "i18next";

export const debateMotionFrameworkOrderColumns = (
  t: TFunction,
): ColumnDef<MotionFramework>[] => [
  {
    accessorKey: "name",
    header: getTranslation(t, "debateMotionFrameworks.form.fields.name"),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },

  {
    accessorKey: "color_hex",
    header: getTranslation(t, "debateMotionFrameworks.form.fields.color"),
    cell: ({ row }) => {
      const color = row.original.color_hex;
      return color ? (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md border border-border"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-xs text-muted-foreground uppercase">
            {color}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: getTranslation(t, "common.labels.createdAt"),
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date ? (
        <span>{new Date(date).toLocaleDateString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
