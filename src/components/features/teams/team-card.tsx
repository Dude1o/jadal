// components/features/teams/team-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Crown,
  Handshake,
  Dices,
  CircleX,
  CircleCheck,
  MoreHorizontal,
  Edit,
  Trash,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Team } from "@/types";
import { getTranslation, cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/services";
import DeleteItem from "@/components/common/delete-item";
import TeamForm from "./team-form";
import TeamDetails from "./team-details";
import { Button } from "@/components/ui/button";

interface TeamCardProps {
  team: Team;
  onEdit?: (id: number, values: Partial<Team>) => void;
  onDelete?: (id: number) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const { t, i18n } = useTranslation();
  const dialog = useDialogStore();
  const isRtl = i18n.dir() === "rtl";
  const isActive = team.status === "active";

  const accentColor = isActive ? "var(--primary)" : "var(--destructive)";
  const backgroundGradient = `linear-gradient(135deg, color-mix(in oklch, ${accentColor} 6%, transparent) 0%, color-mix(in oklch, ${accentColor} 2%, transparent) 40%, transparent 100%)`;

  const memberCount = team.members?.length ?? 0;
  const createdDate = new Date(team.created_at).toLocaleDateString(
    i18n.language,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const openViewDialog = () => {
    dialog.open({
      title: getTranslation(t, "teams.single"),
      children: <TeamDetails team_id={team.id} />,
      closable: true,
    });
  };

  const handleUpdateTeam = async (id: number, data: Partial<Team>) => {
    await onEdit?.(id, data);
  };

  const handleDeleteTeam = async (id: number) => {
    await onDelete?.(id);
  };

  const openEditDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      const id = dialog.open({
        title: getTranslation(t, "common.actions.edit"),
        closeOnOutsideClick: true,
        children: (
          <TeamForm
            onSubmit={(values) => {
              handleUpdateTeam(team.id, values);
              dialog.close(id);
            }}
            team_id={team.id}
          />
        ),
        closable: true,
      });
    }, 0);
  };

  const openDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => {
      const id = dialog.open({
        title: getTranslation(t, "common.actions.delete"),
        closeOnOutsideClick: true,
        children: (
          <DeleteItem
            itemName={getTranslation(t, "teams.single")}
            gender="female"
            onDelete={() => {
              handleDeleteTeam(team.id);
              dialog.close(id);
            }}
            onCancel={() => dialog.close(id)}
          />
        ),
        closable: true,
      });
    }, 0);
  };

  return (
    <Card
      dir={i18n.dir()}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border shadow-sm bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 cursor-pointer",
      )}
      style={{ background: backgroundGradient }}
      onClick={openViewDialog}
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-chart-5 to-primary opacity-80" />

      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-0">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-full ring-2 ring-card shadow-md">
          <AvatarFallback
            className={cn(
              "text-sm sm:text-base font-bold text-white",
              "bg-gradient-to-br from-primary to-accent",
            )}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-full shrink-0",
                "text-muted-foreground border border-border/70 bg-background/80 backdrop-blur",
                "hover:bg-accent hover:text-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              )}
              aria-label={getTranslation(t, "teams.card.teamActions")}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align={isRtl ? "start" : "end"}
            className="min-w-[160px]"
          >
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              {getTranslation(t, "common.labels.actions")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2"
              onClick={openEditDialog}
              disabled={!team.is_random}
            >
              <Edit className="h-4 w-4" />
              {getTranslation(t, "common.actions.edit")}
              {!team.is_random && (
                <span className="ml-auto text-xs text-destructive">
                  {getTranslation(t, "common.labels.unAuthorized")}
                </span>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={openDeleteDialog}
            >
              <Trash className="h-4 w-4" />
              {getTranslation(t, "common.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-6 gap-4">
        <h3 className="text-lg font-bold tracking-tight text-card-foreground leading-tight line-clamp-2 min-h-[2.5em]">
          {team.name}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {/* Status */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-destructive/10 text-destructive border border-destructive/20",
            )}
          >
            {isActive ? (
              <CircleCheck className="h-3.5 w-3.5" />
            ) : (
              <CircleX className="h-3.5 w-3.5" />
            )}
            {getTranslation(t, `teams.statuses.${team.status}`)}
          </span>

          {/* Type */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              team.is_random
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-muted/50 text-muted-foreground border border-border/50",
            )}
          >
            {team.is_random ? (
              <Dices className="h-3.5 w-3.5" />
            ) : (
              <Handshake className="h-3.5 w-3.5" />
            )}
            {getTranslation(
              t,
              team.is_random
                ? "teams.form.options.random"
                : "teams.form.options.manual",
            )}
          </span>

          {/* Members */}
          {memberCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              <Users className="h-3.5 w-3.5" />
              {memberCount}
            </span>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 truncate">
            <Crown className="h-3.5 w-3.5 text-warning shrink-0" />
            <span className="truncate">{team.leader.name}</span>
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            {createdDate}
          </span>
        </div>
      </div>

      {/* View Button - Clean & Prominent */}
      <div className="px-5 pb-5 pt-2 border-t border-border/60 bg-card/80 backdrop-blur-sm">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            openViewDialog();
          }}
          className="w-full font-medium shadow-sm hover:shadow transition-all"
          variant="default"
        >
          <Eye className="h-4 w-4 mr-2" />
          {getTranslation(t, "common.actions.view")}
        </Button>
      </div>

      {/* Hover highlight */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-primary via-accent to-primary group-hover:w-full transition-all duration-500" />
    </Card>
  );
}
