import { Cell } from "@/lib/cells";
import { getTranslation } from "@/lib/utils";
import type { Team } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

export const teamOrderColumns = (t: TFunction): ColumnDef<Team>[] => [
  {
    accessorKey: "name",
    header: getTranslation(t, "common.labels.name"),
  },
  {
    accessorKey: "status",
    header: getTranslation(t, "common.labels.statuses"),
    cell: Cell.Status("teams"),
  },
  {
    id: "type",
    accessorFn: (row) => (row.is_random ? "random" : "manual"),
    header: getTranslation(t, "teams.form.fields.assignmentType"),
    cell: Cell.TeamType(),
    filterFn: "equals",
  },
  {
    accessorKey: "leader_id",
    header: getTranslation(t, "teams.fields.leader"),
  },
];
