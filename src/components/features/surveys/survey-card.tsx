import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Clock,
  BarChart2,
  HelpCircle,
  MoreHorizontal,
  Edit,
  Trash,
  User,
  Users,
} from "lucide-react";
import getTime, {
  cn,
  getInitials,
  getTranslation,
  isClosed,
  isUrgent,
} from "@/lib/utils";
import type {
  Survey,
  SurveyQuestion,
  SurveyResponse,
} from "@/types/survey/survey.type";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const closesLabel = closes_at
    ? getTime(closes_at)
    : getTranslation(t, "surveys.dates.noCloseDate");

  const responseRate =
    responses.length > 0 && target_roles.length > 0
      ? Math.min(
          100,
          Math.round((responses.length / (target_roles.length * 50)) * 100),
        )
      : undefined;

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

  // Determine accent color for card tint based on status
  const statusColor = closed
    ? "var(--destructive)"
    : urgent
      ? "oklch(0.78 0.17 75)" // amber
      : "var(--primary)";
  const backgroundGradient = `linear-gradient(135deg, color-mix(in oklch, ${statusColor} 6%, transparent) 0%, color-mix(in oklch, ${statusColor} 2%, transparent) 40%, transparent 100%)`;

  return (
    <Card
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 cursor-pointer"
      onClick={() => navigate({ to: `/surveys/${survey.id}` })}
      style={{ background: backgroundGradient }}
    >
      {/* Top accent gradient */}
      <div
        className={cn(
          "h-1.5 w-full bg-gradient-to-r",
          closed
            ? "from-destructive via-red-400 to-destructive/60"
            : urgent
              ? "from-amber-500 via-yellow-500 to-amber-500/60"
              : "from-primary via-violet-500 to-primary/60",
        )}
      />

      <CardContent className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-4">
          {/* Header with title & actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <h3 className="line-clamp-1 text-base font-bold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-primary">
                {title}
              </h3>
              <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {description || getTranslation(t, "surveys.labels.noTitle")}
              </p>
            </div>

            {/* Context Actions Dropdown */}
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-muted-foreground opacity-60 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-foreground group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">
                      {getTranslation(t, "common.actions.openMenu")}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {getTranslation(t, "common.labels.actions")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        const id = dialog.open({
                          title: getTranslation(t, "surveys.actions.edit"),
                          closeOnOutsideClick: true,
                          children: (
                            <SurveyForm
                              onSubmit={(values) => {
                                handleUpdateSurvey(survey.id!, values);
                                dialog.close(id);
                              }}
                              survey_id={survey.id}
                            />
                          ),
                          closable: true,
                        });
                      }, 0);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    {getTranslation(t, "common.actions.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-sm text-destructive focus:text-destructive cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        const id = dialog.open({
                          title: getTranslation(t, "common.actions.delete"),
                          closeOnOutsideClick: true,
                          children: (
                            <DeleteItem
                              itemName={getTranslation(t, "surveys.single")}
                              gender="male"
                              onDelete={() => {
                                handleDeleteSurvey(survey.id!);
                                dialog.close(id);
                              }}
                              onCancel={() => {
                                dialog.close(id);
                              }}
                            />
                          ),
                          closable: true,
                        });
                      }, 0);
                    }}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    {getTranslation(t, "common.delete.title")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Metrics pills */}
          <div className="flex flex-wrap items-center gap-2">
            {questions.length > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                <HelpCircle className="h-3 w-3" />
                <span>
                  {questions.length}{" "}
                  {questions.length === 1
                    ? getTranslation(t, "surveys.card.question")
                    : getTranslation(t, "surveys.card.questions")}
                </span>
              </div>
            )}
            {responses.length > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <BarChart2 className="h-3 w-3" />
                <span>
                  {responses.length}{" "}
                  {responses.length === 1
                    ? getTranslation(t, "surveys.card.response")
                    : getTranslation(t, "surveys.card.responses")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Target Roles Tags – now translated */}
        {target_roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 mt-auto">
            {target_roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 capitalize"
              >
                {getTranslation(t, `users.roles.${role}`) ?? role}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-5 py-3 text-xs">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "flex items-center gap-1.5 font-medium",
              urgent && !closed && "text-amber-600 dark:text-amber-400",
              closed && "text-destructive/80",
            )}
          >
            <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
            {closesLabel}
          </span>
          {responseRate !== undefined && (
            <span className="font-semibold text-primary/90">
              {responseRate}
              {getTranslation(t, "surveys.card.rate")}
            </span>
          )}
        </div>

        {displayName && (
          <div className="flex items-center gap-2 max-w-[40%]">
            <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
              {getInitials(displayName) || <User className="h-2.5 w-2.5" />}
            </div>
            <span className="truncate text-muted-foreground">
              {displayName}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
