"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Users, Shuffle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { debateRegistrationsQueryOptions, teamQueryOptions } from "@/api/query-options";
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

function TeamMembersPreview({ teamId }: { teamId: number }) {
  const { data: team, isLoading } = useQuery({
    ...teamQueryOptions(teamId),
    enabled: !!teamId,
  });
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return <Spinner className="h-3 w-3" />;
  }

  if (!team?.members || team.members.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {getTranslation(useTranslation().t, "debates.form.fields.viewMembers", { count: team.members.length })}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 text-xs">
              <Avatar className="h-5 w-5">
                <AvatarImage src={member.user.avatar_url || ""} />
                <AvatarFallback className="text-[10px]">
                  {member.user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground">{member.user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function shuffleAndPartition(
  ids: number[],
  teamSize: number,
): number[][] {
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const teams: number[][] = [];
  for (let i = 0; i < shuffled.length; i += teamSize) {
    const team = shuffled.slice(i, i + teamSize);
    if (team.length === teamSize) teams.push(team);
  }
  return teams;
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

  const [randomTeam1, setRandomTeam1] = useState<number[]>([]);
  const [randomTeam2, setRandomTeam2] = useState<number[]>([]);
  const [teamSize, setTeamSize] = useState(2);

  const soloApplicantMap = useMemo(() => {
    const map = new Map<number, string>();
    registrations?.solo_applicants?.forEach((s) => {
      map.set(s.user.id, s.user.name);
    });
    return map;
  }, [registrations]);

  const handleGenerateRandom = () => {
    const ids = (registrations?.solo_applicants ?? []).map((s) => s.user.id);
    const teams = shuffleAndPartition(ids, teamSize);
    setRandomTeam1(teams[0] ?? []);
    setRandomTeam2(teams[1] ?? []);
  };

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
      opts.push({
        value: "random",
        label: getTranslation(t, "debates.form.fields.randomTeam"),
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
    onChange: (value) => {
      setTeam1Type(value ?? "team");
    },
  };

  const team1TeamField: FieldConfig<AnnounceFormValues> = {
    name: "team_1_team",
    label: getTranslation(t, "debates.form.fields.selectTeam"),
    type: "select",
    visible: (v) => v.team_1_type === "team",
    options: (v) =>
      (registrations?.teams ?? [])
        .filter((reg) => String(reg.team.id) !== String(v.team_2_team ?? ""))
        .map((reg) => ({
          label: `${reg.team.name}`,
          value: String(reg.team.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
    onChange: (value) => {
      setSelectedTeam1(value ? Number(value) : null);
    },
  };

  const team1SolosField: FieldConfig<AnnounceFormValues> = {
    name: "team_1_solos",
    label: getTranslation(t, "debates.form.fields.selectSolos"),
    type: "multi-select",
    visible: (v) => v.team_1_type === "solo",
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
    onChange: (value) => {
      setTeam2Type(value ?? "");
    },
  };

  const team2TeamField: FieldConfig<AnnounceFormValues> = {
    name: "team_2_team",
    label: getTranslation(t, "debates.form.fields.selectTeam"),
    type: "select",
    visible: (v) => v.team_2_type === "team",
    options: (v) =>
      (registrations?.teams ?? [])
        .filter((reg) => String(reg.team.id) !== String(v.team_1_team ?? ""))
        .map((reg) => ({
          label: `${reg.team.name}`,
          value: String(reg.team.id),
        })),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.teamRequired")
          : undefined,
    },
    onChange: (value) => {
      setSelectedTeam2(value ? Number(value) : null);
    },
  };

  const team2SolosField: FieldConfig<AnnounceFormValues> = {
    name: "team_2_solos",
    label: getTranslation(t, "debates.form.fields.selectSolos"),
    type: "multi-select",
    visible: (v) => v.team_2_type === "solo",
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
    randomUsers: number[],
  ): { team_id: number } | { user_ids: number[] } => {
    if (type === "team") return { team_id: Number(teamId) };
    if (type === "random") return { user_ids: randomUsers };
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
          randomTeam1,
        ),
        buildTeamEntry(
          values.team_2_type,
          values.team_2_team,
          values.team_2_solos,
          randomTeam2,
        ),
      ],
    };
    await onSubmit?.(payload);
  };

  const [selectedTeam1, setSelectedTeam1] = useState<number | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<number | null>(null);
  const [team1Type, setTeam1Type] = useState("team");
  const [team2Type, setTeam2Type] = useState(hasSolo ? "" : "team");

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

        {(team1Type === "random" || team2Type === "random") && (
          <div className="rounded-lg border border-border p-4 bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">
                  {getTranslation(t, "debates.form.fields.randomTeam")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(teamSize)} onValueChange={(v) => setTeamSize(Number(v))}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={handleGenerateRandom}
                  className="h-8 text-xs gap-1"
                >
                  <Shuffle className="h-3 w-3" />
                  {getTranslation(t, "debates.form.fields.generateRandom")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {team1Type === "random" && (
                <div className="rounded-md border border-border bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      1
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {getTranslation(t, "debates.form.fields.teamOne")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {randomTeam1.length}/{teamSize}
                    </span>
                  </div>
                  {randomTeam1.length > 0 ? (
                    <div className="space-y-1">
                      {randomTeam1.map((id) => (
                        <div key={id} className="flex items-center gap-2 text-xs">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {(soloApplicantMap.get(id) ?? "?").split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{soloApplicantMap.get(id) ?? `User #${id}`}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {getTranslation(t, "debates.form.fields.clickToGenerate")}
                    </p>
                  )}
                </div>
              )}
              {team2Type === "random" && (
                <div className="rounded-md border border-border bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      2
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {getTranslation(t, "debates.form.fields.teamTwo")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {randomTeam2.length}/{teamSize}
                    </span>
                  </div>
                  {randomTeam2.length > 0 ? (
                    <div className="space-y-1">
                      {randomTeam2.map((id) => (
                        <div key={id} className="flex items-center gap-2 text-xs">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {(soloApplicantMap.get(id) ?? "?").split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{soloApplicantMap.get(id) ?? `User #${id}`}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {getTranslation(t, "debates.form.fields.clickToGenerate")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTeam1 && (
          <div className="rounded-lg border border-border p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {getTranslation(t, "debates.form.fields.teamMembers")}
              </span>
            </div>
            <TeamMembersPreview teamId={selectedTeam1} />
          </div>
        )}

        {selectedTeam2 && (
          <div className="rounded-lg border border-border p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {getTranslation(t, "debates.form.fields.teamMembers")}
              </span>
            </div>
            <TeamMembersPreview teamId={selectedTeam2} />
          </div>
        )}

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
