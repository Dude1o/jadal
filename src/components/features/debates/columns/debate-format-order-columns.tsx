// lib/columns/debate-format-order-columns.ts
import { getTranslation } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { DebateFormat } from "@/types";
import type { TFunction } from "i18next";

export const debateFormatOrderColumns = (
  t: TFunction,
): ColumnDef<DebateFormat>[] => [
  {
    accessorKey: "name",
    header: getTranslation(t, "debateFormats.form.fields.name"),
  },

  {
    accessorKey: "description",
    header: getTranslation(t, "debateFormats.form.fields.description"),
    cell: ({ row }) => {
      const desc = row.original.description;
      return desc ? (
        <span className="line-clamp-2 max-w-md text-sm text-muted-foreground">
          {desc}
        </span>
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
