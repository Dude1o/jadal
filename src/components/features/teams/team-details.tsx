// components/features/teams/team-details.tsx
"use client";

import { useTranslation } from "react-i18next";
import { useData } from "@/hooks/api/use-data";
import { teamQueryOptions } from "@/api/query-options";
import { getTranslation } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, CircleDot, Crown } from "lucide-react";
import type { Team, TeamMember } from "@/types";

interface TeamDetailsProps {
  team_id: number;
}

export default function TeamDetails({ team_id }: TeamDetailsProps) {
  const { t, i18n } = useTranslation();

  const { data: team, isLoading } = useData<Team>(teamQueryOptions(team_id), {
    enabled: !!team_id,
  });

  const members: TeamMember[] = Array.isArray(team?.members)
    ? team.members
    : [];
  const totalMembers = members.length;
  const isActive = team?.status === "active";

  if (isLoading) {
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {getTranslation(t, "teams.details.messages.notFound") ||
          "Team details unavailable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 text-foreground" dir={i18n.dir()}>
      {/* ── Header Section (Merged Hero & Member Count) ── */}
      <div className="flex items-start justify-between gap-4 border-b pb-3 border-border/80">
        <div className="flex gap-3 items-center min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-warning text-accent-foreground shadow-sm flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
              {team.name}
            </h1>
            {team.leader?.name && (
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium mt-0.5">
                {getTranslation(t, "teams.details.leaderPrefix") || "Led by"}{" "}
                {team.leader.name}
              </p>
            )}
          </div>
        </div>

        <Badge className="px-2.5 py-1 text-xs font-bold bg-accent text-accent-foreground border border-accent/30 rounded-lg shrink-0 flex items-center gap-1.5 shadow-none">
          <Users className="w-3.5 h-3.5" />
          <span>
            {totalMembers}{" "}
            <span className="font-semibold">
              {getTranslation(t, "teams.details.members") || "members"}
            </span>
          </span>
        </Badge>
      </div>

      {/* ── Compact Key Team Metrics Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
            {getTranslation(t, "teams.details.leader") || "Leader"}
          </p>
          <p className="text-base font-black text-primary truncate">
            {team.leader?.name ??
              getTranslation(t, "teams.details.noLeader") ??
              "—"}
          </p>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isActive
              ? "bg-success/10 border-success/20"
              : "bg-muted border-border/60"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
              isActive ? "text-success" : "text-muted-foreground"
            }`}
          >
            {getTranslation(t, "common.labels.status") || "Status"}
          </p>
          <p
            className={`text-base font-black flex items-center gap-1 ${
              isActive ? "text-success" : "text-muted-foreground"
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            {getTranslation(t, `teams.statuses.${team.status}`) || team.status}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-0.5">
            {getTranslation(t, "teams.details.teamSize") || "Team Size"}
          </p>
          <p className="text-base font-black text-accent">{totalMembers}</p>
        </div>
      </div>

      {/* ── Internal Scrollable Member List ── */}
      {members.length > 0 ? (
        <Card className="border border-border/80 bg-muted/40 rounded-xl overflow-hidden shadow-none">
          <CardHeader className="py-2 px-4 border-b border-border/60 bg-card flex flex-row items-center gap-2">
            <UserCog className="w-3.5 h-3.5 text-chart-5" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {getTranslation(t, "teams.form.fields.teamMembers") ||
                "Team Members"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-2 max-h-[240px] overflow-y-auto space-y-1.5 scrollbar-thin">
            {members.map((member, idx) => {
              const isLeader = team.leader?.id === member.user.id;
              const bgColor = isLeader
                ? "from-primary/10 to-primary/5 border-primary/20"
                : "from-muted to-muted/50 border-border/60";

              const badgeColor = isLeader
                ? "bg-primary text-primary-foreground"
                : "bg-muted-foreground/20 text-muted-foreground";

              return (
                <div
                  key={member.id ?? idx}
                  className={`flex items-center justify-between gap-3 p-2 rounded-lg border bg-gradient-to-r ${bgColor}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground border border-border">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-card-foreground truncate leading-snug">
                        {member.user.name}
                      </p>
                    </div>
                  </div>

                  {isLeader && (
                    <Badge
                      className={`text-[10px] font-bold rounded-md px-2 py-0.5 shadow-none border-0 flex items-center gap-1 ${badgeColor}`}
                    >
                      <Crown className="w-3 h-3" />
                      {getTranslation(t, "teams.details.leaderBadge") ||
                        "Leader"}
                    </Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <div className="p-6 text-center border border-dashed rounded-xl border-border">
          <Users className="w-8 h-8 mx-auto text-border mb-2" />
          <p className="text-xs font-medium text-muted-foreground">
            {getTranslation(t, "teams.messages.noMembers") ||
              "No members configured."}
          </p>
        </div>
      )}
    </div>
  );
}
