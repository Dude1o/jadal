import { Cell } from "@/lib/cells";
import type { ColumnDef } from "@tanstack/react-table";
import type { Debate } from "@/types";
import type { TFunction } from "i18next";
import { getTranslation } from "@/lib/utils";

export const debateOrderColumns = (t: TFunction): ColumnDef<Debate>[] => [
  {
    accessorKey: "title",
    header: getTranslation(t, "debates.form.fields.title"),
  },

  {
    accessorKey: "description",
    header: getTranslation(t, "debates.form.fields.description"),
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
    accessorKey: "tag",
    header: getTranslation(t, "debates.form.fields.tag"),
    cell: ({ row }) => {
      const desc = row.original.tag;
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
    accessorKey: "motion",
    header: getTranslation(t, "debates.form.fields.motion"),
    cell: ({ row }) => {
      const motion = row.original.motion;
      return motion?.text ? (
        <span className="font-medium line-clamp-1">{motion.text}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },

  {
    accessorKey: "status",
    header: getTranslation(t, "debates.fields.state"),
    cell: Cell.Status("debates"),
  },

  {
    accessorKey: "scheduled_at",
    header: getTranslation(t, "debates.form.fields.scheduledAt"),
    cell: ({ row }) => {
      const date = row.original.scheduled_at;
      return date ? (
        <span>{new Date(date).toLocaleDateString()}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];
