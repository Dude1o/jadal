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
import {
  debateRegistrationsQueryOptions,
  teamQueryOptions,
} from "@/api/query-options";


interface AnnounceFormProps {
  debateId: number;
  onSubmit?: (values: {
    judges: number[];
    teams: ({ team_id: number } | { user_ids: number[] })[];
  }) => Promise<void> | void;
  onCancel?: () => void;
}

function TeamMembersPreview({ teamId }: { teamId: number }) {
  const { t } = useTranslation();
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
        {expanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {getTranslation(t, "debates.form.fields.viewMembers", {
          count: team.members.length,
        })}
      </button>
      {expanded && (
        <div className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 text-xs">
              <Avatar className="h-5 w-5">
                <AvatarImage src={member.user.avatar_url || ""} />
                <AvatarFallback className="text-[10px]">
                  {member.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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

export default function AnnounceForm({
  debateId,
  onSubmit,
  onCancel,
}: AnnounceFormProps) {
  const { t, i18n } = useTranslation();

  const { data: registrations, isLoading } = useQuery(
    debateRegistrationsQueryOptions(debateId),
  );

  const hasSolo = (registrations?.solo?.length ?? 0) > 0;
  const hasTeams = (registrations?.teams?.length ?? 0) > 1;

  const [randomTeam1, setRandomTeam1] = useState<number[]>([]);
  const [randomTeam2, setRandomTeam2] = useState<number[]>([]);
  const [teamSize, setTeamSize] = useState(3);
  const [selectedTeam1, setSelectedTeam1] = useState<number | null>(null);
  const [selectedTeam2, setSelectedTeam2] = useState<number | null>(null);
  const [team1Type, setTeam1Type] = useState("team");
  const [team2Type, setTeam2Type] = useState(hasSolo ? "" : "team");
  const [team1TeamValue, setTeam1TeamValue] = useState("");
  const [team2TeamValue, setTeam2TeamValue] = useState("");
  const [team1SolosValue, setTeam1SolosValue] = useState<string[]>([]);
  const [team2SolosValue, setTeam2SolosValue] = useState<string[]>([]);

  const soloApplicantMap = useMemo(() => {
    const map = new Map<number, string>();
    registrations?.solo?.forEach((s) => {
      map.set(s.user.id, s.user.name);
    });
    return map;
  }, [registrations]);

  const handleGenerateTeam1Random = () => {
    const allIds = (registrations?.solo ?? []).map((s) => s.user.id);
    const used = new Set([...team2SolosValue.map(Number), ...randomTeam2]);
    const available = allIds.filter((id) => !used.has(id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    setRandomTeam1(shuffled.slice(0, teamSize));
  };

  const handleGenerateTeam2Random = () => {
    const allIds = (registrations?.solo ?? []).map((s) => s.user.id);
    const used = new Set([...team1SolosValue.map(Number), ...randomTeam1]);
    const available = allIds.filter((id) => !used.has(id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    setRandomTeam2(shuffled.slice(0, teamSize));
  };

  const handleTeam1TypeChange = (newType: string) => {
    setTeam1Type(newType);
    if (newType === "team" && team2Type === "team") {
      setTeam2Type("");
      setTeam2TeamValue("");
      setSelectedTeam2(null);
    }
    if (newType !== "team") { setTeam1TeamValue(""); setSelectedTeam1(null); }
    if (newType !== "solo") setTeam1SolosValue([]);
  };

  const handleTeam2TypeChange = (newType: string) => {
    setTeam2Type(newType);
    if (newType === "team" && team1Type === "team") {
      setTeam1Type("");
      setTeam1TeamValue("");
      setSelectedTeam1(null);
    }
    if (newType !== "team") { setTeam2TeamValue(""); setSelectedTeam2(null); }
    if (newType !== "solo") setTeam2SolosValue([]);
  };

  const typeOptions = (forTeam: 1 | 2) => {
    const otherType = forTeam === 1 ? team2Type : team1Type;
    const opts: { value: string; label: string }[] = [];
    if (hasTeams && otherType !== "team") {
      opts.push({
        value: "team",
        label: getTranslation(t, "debates.form.fields.registeredTeam"),
      });
    }
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

  const formDefaultValues = { judges: [] as string[] };

  const judgesField: FieldConfig<{ judges: string[] }> = {
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

  const formRows: FormRow<{ judges: string[] }>[] = [
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

  const handleSubmit = async (values: { judges: string[] }) => {
    const payload = {
      judges: values.judges.map(Number),
      teams: [
        buildTeamEntry(team1Type, team1TeamValue, team1SolosValue, randomTeam1),
        buildTeamEntry(team2Type, team2TeamValue, team2SolosValue, randomTeam2),
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
        <DynamicForm<{ judges: string[] }>
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="announce-form"
          showSubmitButton={false}
        />

        {/* Teams Section */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debates.form.sections.teams")}
          </p>
          <Separator />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Team 1 Column */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {getTranslation(t, "debates.form.fields.teamOne")}
              </label>
              <Select value={team1Type} onValueChange={handleTeam1TypeChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions(1).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {team1Type === "team" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {getTranslation(t, "debates.form.fields.selectTeam")}
                </label>
                <Select
                  value={team1TeamValue}
                  onValueChange={(v) => {
                    setTeam1TeamValue(v);
                    setSelectedTeam1(v ? Number(v) : null);
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder={getTranslation(t, "debates.form.fields.selectTeam")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(registrations?.teams ?? [])
                      .filter((reg) => String(reg.team.id) !== team2TeamValue)
                      .map((reg) => (
                        <SelectItem key={reg.team.id} value={String(reg.team.id)}>
                          {reg.team.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {team1Type === "solo" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {getTranslation(t, "debates.form.fields.selectSolos")}
                </label>
                <div className="mt-1 space-y-2">
                  {(registrations?.solo ?? [])
                    .filter((s) => !team2SolosValue.includes(String(s.user.id)) && !randomTeam2.includes(s.user.id))
                    .map((s) => (
                      <div key={s.user.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`team1-solo-${s.user.id}`}
                          checked={team1SolosValue.includes(String(s.user.id))}
                          onChange={(e) => {
                            const id = String(s.user.id);
                            setTeam1SolosValue((prev) =>
                              e.target.checked
                                ? [...prev, id]
                                : prev.filter((v) => v !== id),
                            );
                          }}
                          className="h-4 w-4 rounded border-border"
                        />
                        <label
                          htmlFor={`team1-solo-${s.user.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {s.user.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {team1Type === "random" && (
              <div className="rounded-lg border border-border p-3 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">1</Badge>
                    <span className="text-xs font-medium">
                      {getTranslation(t, "debates.form.fields.randomTeam")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={String(teamSize)} onValueChange={(v) => setTeamSize(Number(v))}>
                      <SelectTrigger className="w-16 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="sm" variant="default" onClick={handleGenerateTeam1Random} className="h-7 text-xs gap-1 px-2">
                      <Shuffle className="h-3 w-3" />
                      {getTranslation(t, "debates.form.fields.generateRandom")}
                    </Button>
                  </div>
                </div>
                <div>
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
              </div>
            )}
          </div>

          {/* Team 2 Column */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                {getTranslation(t, "debates.form.fields.teamTwo")}
              </label>
              <Select value={team2Type} onValueChange={handleTeam2TypeChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions(2).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {team2Type === "team" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {getTranslation(t, "debates.form.fields.selectTeam")}
                </label>
                <Select
                  value={team2TeamValue}
                  onValueChange={(v) => {
                    setTeam2TeamValue(v);
                    setSelectedTeam2(v ? Number(v) : null);
                  }}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder={getTranslation(t, "debates.form.fields.selectTeam")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(registrations?.teams ?? [])
                      .filter((reg) => String(reg.team.id) !== team1TeamValue)
                      .map((reg) => (
                        <SelectItem key={reg.team.id} value={String(reg.team.id)}>
                          {reg.team.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {team2Type === "solo" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {getTranslation(t, "debates.form.fields.selectSolos")}
                </label>
                <div className="mt-1 space-y-2">
                  {(registrations?.solo ?? [])
                    .filter((s) => !team1SolosValue.includes(String(s.user.id)) && !randomTeam1.includes(s.user.id))
                    .map((s) => (
                      <div key={s.user.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`team2-solo-${s.user.id}`}
                          checked={team2SolosValue.includes(String(s.user.id))}
                          onChange={(e) => {
                            const id = String(s.user.id);
                            setTeam2SolosValue((prev) =>
                              e.target.checked
                                ? [...prev, id]
                                : prev.filter((v) => v !== id),
                            );
                          }}
                          className="h-4 w-4 rounded border-border"
                        />
                        <label
                          htmlFor={`team2-solo-${s.user.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {s.user.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {team2Type === "random" && (
              <div className="rounded-lg border border-border p-3 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">2</Badge>
                    <span className="text-xs font-medium">
                      {getTranslation(t, "debates.form.fields.randomTeam")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={String(teamSize)} onValueChange={(v) => setTeamSize(Number(v))}>
                      <SelectTrigger className="w-16 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" size="sm" variant="default" onClick={handleGenerateTeam2Random} className="h-7 text-xs gap-1 px-2">
                      <Shuffle className="h-3 w-3" />
                      {getTranslation(t, "debates.form.fields.generateRandom")}
                    </Button>
                  </div>
                </div>
                <div>
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
              </div>
            )}
          </div>
        </div>

        {/* Team Members Previews */}
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
            type="button"
            className="flex-1 bg-accent hover:bg-accent/80"
            onClick={() => {
              document.getElementById("announce-form")?.requestSubmit();
            }}
          >
            {getTranslation(t, "debates.form.fields.confirmAnnounce")}
          </Button>
        </div>
      </div>
    </div>
  );
}
