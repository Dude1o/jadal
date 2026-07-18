"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { debateRegistrationsQueryOptions } from "@/api/query-options";
import type { DebateRegistrations } from "@/types";

interface AnnounceFormValues {
  judges: string[];
  team_1_type: string;
  team_1_team: string;
  team_1_solos: string[];
  team_2_type: string;
  team_2_team: string;
  team_2_solos: string[];
}

interface AnnounceFormProps {
  debateId: number;
  onSubmit?: (values: {
    judges: number[];
    teams: ({ team_id: number } | { user_ids: number[] })[];
  }) => Promise<void> | void;
  onCancel?: () => void;
}

export default function AnnounceForm({
  debateId,
  onSubmit,
  onCancel,
}: AnnounceFormProps) {
  const { t, i18n } = useTranslation();

  const { data: registrations, isLoading } = useQuery(
    debateRegistrationsQueryOptions(debateId),
  );

  const hasSolo = (registrations?.solo_applicants?.length ?? 0) > 0;

  const formDefaultValues: AnnounceFormValues = {
    judges: [],
    team_1_type: "team",
    team_1_team: "",
    team_1_solos: [],
    team_2_type: hasSolo ? "" : "team",
    team_2_team: "",
    team_2_solos: [],
  };

  const typeOptions = () => {
    const opts: { value: string; label: string }[] = [
      {
        value: "team",
        label: getTranslation(t, "debates.form.fields.registeredTeam"),
      },
    ];
    if (hasSolo) {
      opts.push({
        value: "solo",
        label: getTranslation(t, "debates.form.fields.buildFromSolo"),
      });
    }
    return opts;
  };

  const judgesField: FieldConfig<AnnounceFormValues> = {
    name: "judges",
    label: `${getTranslation(t, "debates.form.fields.judges")} *`,
    type: "multi-select",
    options: () =>
      (registrations?.judges ?? []).map((j) => ({
        label: j.user.name,
        value: String(j.user.id),
      })),
    validators: {
      onChange: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debates.validation.judgesRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debates.validation.judgesRequired")
          : undefined,
    },
  };

  const team1TypeField: FieldConfig<AnnounceFormValues> = {
    name: "team_1_type",
    label: getTranslation(t, "debates.form.fields.teamOne"),
    type: "select",
    options: typeOptions,
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
  };

  const team1TeamField: FieldConfig<AnnounceFormValues> = {
    name: "team_1_team",
    label: getTranslation(t, "debates.form.fields.selectTeam"),
    type: "select",
    visible: (v) => v.team_1_type === "team",
    // Exclude whichever team is already selected as team 2
    options: (v) =>
      (registrations?.teams ?? [])
        .filter((reg) => String(reg.team.id) !== String(v.team_2_team ?? ""))
        .map((reg) => ({
          label: reg.team.name,
          value: String(reg.team.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
  };

  const team1SolosField: FieldConfig<AnnounceFormValues> = {
    name: "team_1_solos",
    label: getTranslation(t, "debates.form.fields.selectSolos"),
    type: "multi-select",
    visible: (v) => v.team_1_type === "solo",
    // Exclude solo applicants already picked for team 2
    options: (v) =>
      (registrations?.solo_applicants ?? [])
        .filter(
          (s) =>
            !(v.team_2_solos ?? []).some(
              (id) => String(id) === String(s.user.id),
            ),
        )
        .map((s) => ({
          label: s.user.name,
          value: String(s.user.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debates.validation.solosRequired")
          : undefined,
    },
  };

  const team2TypeField: FieldConfig<AnnounceFormValues> = {
    name: "team_2_type",
    label: getTranslation(t, "debates.form.fields.teamTwo"),
    type: "select",
    options: typeOptions,
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
  };

  const team2TeamField: FieldConfig<AnnounceFormValues> = {
    name: "team_2_team",
    label: getTranslation(t, "debates.form.fields.selectTeam"),
    type: "select",
    visible: (v) => v.team_2_type === "team",
    // Exclude whichever team is already selected as team 1
    options: (v) =>
      (registrations?.teams ?? [])
        .filter((reg) => String(reg.team.id) !== String(v.team_1_team ?? ""))
        .map((reg) => ({
          label: reg.team.name,
          value: String(reg.team.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
  };

  const team2SolosField: FieldConfig<AnnounceFormValues> = {
    name: "team_2_solos",
    label: getTranslation(t, "debates.form.fields.selectSolos"),
    type: "multi-select",
    visible: (v) => v.team_2_type === "solo",
    // Exclude solo applicants already picked for team 1
    options: (v) =>
      (registrations?.solo_applicants ?? [])
        .filter(
          (s) =>
            !(v.team_1_solos ?? []).some(
              (id) => String(id) === String(s.user.id),
            ),
        )
        .map((s) => ({
          label: s.user.name,
          value: String(s.user.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debates.validation.solosRequired")
          : undefined,
    },
  };

  const formRows: FormRow<AnnounceFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debates.form.sections.judges")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 1,
      fields: [judgesField],
    },
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debates.form.sections.teams")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [team1TypeField, team2TypeField],
    },
    {
      kind: "fields",
      columns: 2,
      fields: [team1TeamField, team2TeamField],
    },
    {
      kind: "fields",
      columns: 2,
      fields: [team1SolosField, team2SolosField],
    },
  ];

  const buildTeamEntry = (
    type: string,
    teamId: string,
    solos: string[],
  ): { team_id: number } | { user_ids: number[] } => {
    if (type === "team") return { team_id: Number(teamId) };
    return { user_ids: solos.map(Number) };
  };

  const handleSubmit = async (values: AnnounceFormValues) => {
    const payload = {
      judges: values.judges.map(Number),
      teams: [
        buildTeamEntry(
          values.team_1_type,
          values.team_1_team,
          values.team_1_solos,
        ),
        buildTeamEntry(
          values.team_2_type,
          values.team_2_team,
          values.team_2_solos,
        ),
      ],
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <Spinner />
        </div>
      )}

      <div className="flex flex-col gap-4" dir={i18n.dir()}>
        <DynamicForm
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="announce-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
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
          <Button
            type="submit"
            form="announce-form"
            className="flex-1 bg-accent hover:bg-accent/80"
          >
            {getTranslation(t, "debates.form.fields.confirmAnnounce")}
          </Button>
        </div>
      </div>
    </div>
  );
}
