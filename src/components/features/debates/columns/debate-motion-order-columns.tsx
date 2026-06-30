// components/motion/columns/motion-order-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Motion } from "@/types";
import { getTranslation } from "@/lib/utils";
import type { TFunction } from "i18next";

export const debateMotionOrderColumns = (t: TFunction): ColumnDef<Motion>[] => [
  {
    accessorKey: "text",
    header: getTranslation(t, "debateMotions.form.fields.motion"),
    cell: ({ row }) => (
      <div className="max-w-md line-clamp-2 text-sm">{row.original.text}</div>
    ),
  },
  {
    id: "frameworks",
    header: getTranslation(t, "debateMotions.form.fields.frameworks"),
    cell: ({ row }) => {
      const frameworks = row.original.frameworks || [];
      return (
        <div className="flex flex-wrap gap-1">
          {frameworks.slice(0, 3).map((framework) => (
            <Badge
              key={framework.id}
              variant="outline"
              className="text-xs font-medium"
              style={{
                borderColor: framework.color_hex || undefined,
                color: framework.color_hex || undefined,
              }}
            >
              {framework.name}
            </Badge>
          ))}
          {frameworks.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{frameworks.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: getTranslation(t, "common.labels.createdAt"),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at || "");
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
];
