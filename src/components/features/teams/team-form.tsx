// components/features/teams/team-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useData } from "@/hooks/api/use-data";
import { Spinner } from "@/components/ui/spinner";
import { useMemo } from "react";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import { teamQueryOptions, usersQueryOptions } from "@/api/query-options";
import { TEAM_STATUSES } from "@/lib/constants";
import type { TeamMember, User } from "@/types";
import { AlertCircle } from "lucide-react";

type AssignmentType = "manual" | "random";
type TeamStatus = "active" | "inactive";

interface TeamFormValues {
  name: string;
  assignment_type: AssignmentType;
  leader: User;
  status: TeamStatus;
  members: TeamMember[];
}

interface TeamFormProps {
  defaultValues?: Partial<TeamFormValues>;
  onSubmit?: (values: any) => Promise<void> | void;
  onCancel?: () => void;
  team_id?: number;
}

export default function TeamForm({
  defaultValues,
  onSubmit,
  onCancel,
  team_id,
}: TeamFormProps) {
  const { data: team, isLoading } = useData({
    ...teamQueryOptions(team_id!),
    enabled: team_id !== undefined,
  });
  const { t, i18n } = useTranslation();

  const formKey = useFormKey(team);

  const formDefaultValues: TeamFormValues = useMemo(
    () => ({
      name: team?.name ?? defaultValues?.name ?? "",
      assignment_type: (team
        ? team.is_random
          ? "random"
          : "manual"
        : (defaultValues?.assignment_type ?? "manual")) as AssignmentType,
      leader: team?.leader.id
        ? String(team.leader.id)
        : (defaultValues?.leader.id ?? null),
      status: (team?.status ?? defaultValues?.status ?? "active") as TeamStatus,
      members:
        team?.members?.map((m: TeamMember) => String(m.id)) ??
        defaultValues?.members ??
        [],
    }),
    [team, defaultValues],
  );

  const nameField: FieldConfig<TeamFormValues> = {
    name: "name",
    label: `${getTranslation(t, "teams.form.fields.name")} *`,
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "teams.validation.nameRequired")
          : value.trim().length < 2
            ? getTranslation(t, "teams.validation.nameTooShort")
            : undefined,
    },
  };

  const leaderField: FieldConfig<TeamFormValues> = {
    name: "leader_id",
    label: `${getTranslation(t, "teams.form.fields.leader")} *`,
    type: "async-select",
    queryOptions: () =>
      usersQueryOptions({
        perPage: 1000,
      }),
    getOptionLabel: (user: User) => user.name,
    getOptionValue: (user: User) => String(user.id),
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "teams.validation.leaderIsRequired")
          : undefined,
    },
    onChange: (value, currentValues, { setFieldValue }) => {
      if (!value) {
        // Optional: clear leader from members if leader is cleared
        setFieldValue(
          "members",
          (currentValues.members || []).filter(
            (id) => id !== currentValues.leader_id,
          ),
        );
        return;
      }

      const leaderId = String(value);
      let members = [...(currentValues.members || [])];

      // Remove old leader (if different)
      if (currentValues.leader_id && currentValues.leader_id !== leaderId) {
        members = members.filter(
          (id) => String(id) !== String(currentValues.leader_id),
        );
      }

      // Add new leader if not present
      if (!members.includes(leaderId)) {
        members.push(leaderId);
      }

      setFieldValue("members", members);
    },
  };

  const statusField: FieldConfig<TeamFormValues> = {
    name: "status",
    label: `${getTranslation(t, "common.labels.status")} *`,
    type: "select",
    options: () =>
      TEAM_STATUSES.map((s) => ({
        label: getTranslation(t, `teams.statuses.${s.value}`),
        value: s.value,
      })),
    validators: {
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "teams.validation.statusRequired")
          : undefined,
    },
  };

  const assignmentField: FieldConfig<TeamFormValues> = {
    name: "assignment_type",
    label: getTranslation(t, "teams.form.fields.assignmentType"),
    type: "select",
    options: () => [
      {
        label: getTranslation(t, "teams.form.options.manual"),
        value: "manual",
      },
      {
        label: getTranslation(t, "teams.form.options.random"),
        value: "random",
      },
    ],
  };

  const teamMembersField: FieldConfig<TeamFormValues> = {
    name: "members",
    label: getTranslation(t, "teams.form.fields.teamMembers") + "*",
    type: "async-multi-select",
    queryOptions: () =>
      usersQueryOptions({
        perPage: 1000,
      }),
    getOptionLabel: (user: User) => user.name,
    getOptionValue: (user: User) => String(user.id),
    validators: {
      onChange: ({ value, fieldApi }) => {
        const leader = fieldApi.form.getFieldValue("leader_id");
        if (!value || value.length === 0) {
          return getTranslation(t, "teams.validation.teamMembersRequired");
        }
        if (leader && !value.includes(String(leader))) {
          return getTranslation(t, "teams.validation.leaderMustBeMember");
        }
        return undefined;
      },
      onSubmit: ({ value, values }) => {
        if (!value || value.length === 0) {
          return getTranslation(t, "teams.validation.teamMembersRequired");
        }
        if (values.leader_id && !value.includes(String(values.leader_id))) {
          return getTranslation(t, "teams.validation.leaderMustBeMember");
        }
        return undefined;
      },
    },
  };

  const formRows: FormRow<TeamFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "teams.form.sections.info")}
          </p>
          <Separator />
        </div>
      ),
    },
    { kind: "fields", columns: 2, fields: [nameField, leaderField] },
    { kind: "fields", columns: 1, fields: [teamMembersField] },
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "teams.form.sections.settings")}
          </p>
          <Separator />
        </div>
      ),
    },
    { kind: "fields", columns: 2, fields: [statusField, assignmentField] },
  ];

  const handleSubmit = async (values: TeamFormValues) => {
    const payload = {
      name: values.name,
      is_random: values.assignment_type === "random",
      leader_id: values.leader_id ? Number(values.leader_id) : null,
      status: values.status,
      member_ids: values.members.map(Number),
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm bg-background/50">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col gap-4" dir={i18n.dir()}>
        <DynamicForm
          key={formKey}
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="team-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="team-form"
            className="flex-1 bg-accent hover:bg-accent/80"
          >
            {getTranslation(t, "common.actions.save")}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onCancel}
            >
              {getTranslation(t, "common.actions.cancel")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
