// lib/columns/user-order-columns.ts
import { Cell } from "@/lib/cells";
import { getTranslation } from "@/lib/utils";
import type { User } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

export const userOrderColumns = (t: TFunction): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: getTranslation(t, "users.form.fields.name"),
  },
  {
    accessorKey: "email",
    header: getTranslation(t, "users.form.fields.email"),
  },
  {
    accessorKey: "role",
    header: getTranslation(t, "users.form.fields.role"),
    cell: Cell.Role("users"),
  },
  {
    accessorKey: "phone",
    header: getTranslation(t, "users.form.fields.phone"),
  },
  {
    accessorKey: "status",
    header: getTranslation(t, "users.form.fields.status"),
    cell: Cell.UserStatus(),
  },
];
