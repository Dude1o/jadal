import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  BarChart2,
  Clock,
  Edit,
  HelpCircle,
  PlayCircle,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import getTime, {
  getInitials,
  getTranslation,
  isClosed,
  isUrgent,
} from "@/lib/utils";
import type { Survey, SurveyQuestion, SurveyResponse } from "@/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import SurveyForm from "./survey-form";
import DeleteItem from "@/components/common/delete-item";
import { useDialogStore } from "@/services";
import { Button } from "@/components/ui/button";

interface SurveyCardProps {
  survey: Survey;
  questions?: SurveyQuestion[];
  responses?: SurveyResponse[];
  createdByName?: string;
  onEdit?: (id, values) => void;
  onDelete?: (id: number) => void | Promise<void>;
}

/**
 * Survey card, built on the debate-format card: one white surface, a coloured
 * banner across the top, header, a two-up stat block, then the action row.
 *
 * The banner is the only thing that varies — it carries the survey's stage, so
 * a wall of these reads as a status board at a glance without a single chip
 * having to shout. Closed is deliberately the quietest of the three.
 */
const STAGE = {
  closed: { color: "#5A7296", icon: Archive, key: "closed" },
  overdue: { color: "#D84857", icon: TriangleAlert, key: "overdue" },
  active: { color: "#157A49", icon: PlayCircle, key: "active" },
} as const;

export function SurveyCard({
  survey,
  questions = [],
  responses = [],
  createdByName,
  onEdit,
  onDelete,
}: SurveyCardProps) {
  const [startTime] = useState(() => Date.now());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  if (!survey) return null;

  const { title, description, target_roles, closes_at, created_by } = survey;
  const closed = isClosed(closes_at, startTime);
  const urgent = isUrgent(closes_at, startTime);

  const stage = closed ? STAGE.closed : urgent ? STAGE.overdue : STAGE.active;
  const StageIcon = stage.icon;

  const closesLabel = closes_at
    ? getTime(closes_at)
    : getTranslation(t, "surveys.dates.noCloseDate");

  const fallbackName =
    typeof created_by === "object" &&
    created_by !== null &&
    "name" in created_by
      ? String(created_by.name)
      : getTranslation(t, "surveys.card.createdByFallback", { id: created_by });
  const displayName = createdByName ?? fallbackName;

  const handleUpdateSurvey = async (id: number, data: Partial<Survey>) => {
    if (onEdit) await onEdit({ id, data });
  };

  const handleDeleteSurvey = async (id: number) => {
    if (onDelete) await onDelete(id);
  };

  const openEditDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "surveys.actions.edit"),
      closeOnOutsideClick: true,
      closable: true,
      children: (
        <SurveyForm
          survey_id={survey.id}
          onSubmit={(values) => {
            handleUpdateSurvey(survey.id!, values);
            dialog.close(id);
          }}
        />
      ),
    });
  };

  const openDeleteDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "common.actions.delete"),
      closeOnOutsideClick: true,
      closable: true,
      children: (
        <DeleteItem
          itemName={getTranslation(t, "surveys.single")}
          gender="male"
          onDelete={() => {
            handleDeleteSurvey(survey.id!);
            dialog.close(id);
          }}
          onCancel={() => dialog.close(id)}
        />
      ),
    });
  };

  return (
    <Card className="jd-card jd-interactive group relative flex h-full w-full flex-col overflow-hidden bg-[var(--table-row)]">
      {/* The stage banner. Same position and weight as the debate-format card;
          only the hue is survey-specific. */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{
          backgroundImage: `linear-gradient(90deg, ${stage.color} 0%, color-mix(in oklab, ${stage.color} 55%, transparent) 100%)`,
        }}
      />

      <CardHeader className="relative px-6 pt-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <CardTitle className="line-clamp-2 text-xl font-bold tracking-tight text-card-foreground">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {description || getTranslation(t, "surveys.labels.noTitle")}
            </CardDescription>
          </div>

          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in oklab, ${stage.color} 16%, transparent)`,
              color: stage.color,
            }}
          >
            <StageIcon className="size-5" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-5 px-6 pt-0 pb-6">
        {/* Two-up metrics, identical shape to the format card. */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {getTranslation(t, "surveys.card.questions")}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground tabular-nums">
              {questions.length}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <BarChart2 className="size-4 text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {getTranslation(t, "surveys.card.responses")}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground tabular-nums">
              {responses.length}
            </p>
          </div>
        </div>

        {/* Stage + deadline. The stage word is coloured, not the whole chip. */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-bold"
            style={{
              background: `color-mix(in oklab, ${stage.color} 14%, transparent)`,
              color: `color-mix(in oklab, ${stage.color} 78%, var(--foreground))`,
            }}
          >
            <StageIcon className="size-3.5" />
            {getTranslation(t, `surveys.status.${stage.key}`)}
          </span>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5 shrink-0" />
            {closesLabel}
          </span>
        </div>

        {target_roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {target_roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize"
              >
                {getTranslation(t, `users.roles.${role}`) ?? role}
              </span>
            ))}
          </div>
        )}

        {displayName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              {getInitials(displayName)}
            </span>
            <span className="truncate">{displayName}</span>
          </div>
        )}

        {/* Action row — the same trio the format card uses. */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="accent"
            className="flex-1"
            onClick={() => navigate({ to: `/surveys/${survey.id}` })}
          >
            {getTranslation(t, "common.actions.view")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={openEditDialog}
            title={getTranslation(t, "common.actions.edit")}
            aria-label={getTranslation(t, "common.actions.edit")}
          >
            <Edit className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={openDeleteDialog}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            title={getTranslation(t, "common.delete.title")}
            aria-label={getTranslation(t, "common.delete.title")}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
