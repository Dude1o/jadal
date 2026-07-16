// components/survey/survey-details.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  Edit,
  BarChart3,
  Share2,
  Trash2,
  MoreVertical,
  ArrowRight,
  Target,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import getTime, {
  cn,
  isClosed,
  isUrgent,
  getTranslation,
  isRTL,
} from "@/lib/utils";
import { surveyQueryOptions } from "@/api/query-options";
import type { SurveyQuestion } from "@/types";

// ────────────────────────────────────────────────────────────
// Sub‑components
// ────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  gradientClass: string;
  iconColor: string;
}

function SurveyMetricWidget({
  icon: Icon,
  label,
  value,
  gradientClass,
  iconColor,
}: MetricCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          gradientClass,
        )}
      >
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function SurveyQuestionItem({
  question,
  index,
  t,
}: {
  question: SurveyQuestion;
  index: number;
  t: any;
}) {
  return (
    <Card className="group relative border-border/80 shadow-sm bg-card/60 hover:shadow-xl hover:border-accent/20 transition-all duration-300 rounded-2xl overflow-hidden">
      {/* Subtle border glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-warning/0 to-warning/0 group-hover:from-accent/[0.02] group-hover:to-warning/[0.02] transition-all pointer-events-none" />

      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* Pro Max Number Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-warning/10 flex items-center justify-center text-sm font-black text-accent shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h4 className="text-base font-bold text-foreground tracking-tight leading-snug">
                {question.question_text}
              </h4>
              <Badge
                variant="secondary"
                className="w-fit shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border/40 capitalize"
              >
                {question.type === "rating" &&
                  getTranslation(t, "surveys.details.rating")}
                {question.type === "mcq" &&
                  getTranslation(t, "surveys.details.multipleChoice")}
                {question.type === "open_text" &&
                  getTranslation(t, "surveys.details.openText")}
              </Badge>
            </div>

            {/* Render Preview Contexts */}
            {question.type === "rating" && question.options && (
              <div className="space-y-2 max-w-md pt-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground px-0.5">
                  <span>
                    {getTranslation(t, "common.labels.min") || "Min"}:{" "}
                    {question.options.min ?? 1}
                  </span>
                  <span>
                    {getTranslation(t, "common.labels.max") || "Max"}:{" "}
                    {question.options.max ?? 10}
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full p-[2px] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent via-warning to-warning rounded-full shadow-md shadow-accent/50"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
            )}

            {question.type === "mcq" && Array.isArray(question.options) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {question.options.map((option, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl border border-border bg-muted/40 text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    <span className="truncate">{option}</span>
                  </div>
                ))}
              </div>
            )}

            {question.type === "open_text" && (
              <div className="mt-4 border-2 border-dashed border-border/60 rounded-2xl p-6 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                <Sparkles className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                {getTranslation(t, "surveys.details.textResponseArea")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────
interface SurveyDetailsProps {
  surveyId: number;
  onBack?: () => void;
}

export function SurveyDetails({ surveyId, onBack }: SurveyDetailsProps) {
  const [startTime] = useState(() => Date.now());
  const { t } = useTranslation();
  const rtl = isRTL();

  const { data: survey } = useSuspenseQuery(surveyQueryOptions(surveyId));

  if (!survey) return null;

  const {
    title,
    description,
    target_roles = [],
    closes_at,
    questions = [],
    already_responded,
    created_by,
    responses_count = 0,
    status,
  } = survey;

  const closed = isClosed(closes_at, startTime);
  const urgent = isUrgent(closes_at, startTime);

  const closesLabel = closes_at
    ? getTime(closes_at)
    : getTranslation(t, "surveys.dates.noCloseDate");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack || (() => window.history.back())}
            className="group gap-2 px-3 hover:bg-muted rounded-xl font-semibold text-muted-foreground hover:text-foreground transition-all"
            aria-label={getTranslation(t, "common.actions.back")}
          >
            {rtl ? (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            )}
            <span>{getTranslation(t, "surveys.details.back")}</span>
          </Button>

          <div className="flex items-center gap-3">
            {already_responded && (
              <Badge className="gap-1.5 px-3 py-1.5 bg-success/10 hover:bg-success/10 border border-success/20 text-success rounded-xl text-xs font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                {getTranslation(t, "surveys.details.responded")}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-card shadow-sm border-border/80"
                  aria-label="Action context menu"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-xl border-border/80"
              >
                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                  {getTranslation(t, "common.actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                  {getTranslation(t, "common.actions.share")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium">
                  <Trash2 className="w-4 h-4" />
                  {getTranslation(t, "common.actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hero Banner Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl rounded-3xl bg-accent-foreground text-sidebar-foreground min-h-[240px] flex items-end">
          {/* Immersive background graphic elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-warning to-warning opacity-85 mix-blend-multiply" />
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-5%] w-80 h-80 rounded-full bg-warning/20 blur-3xl pointer-events-none" />

          <CardContent className="relative z-10 w-full p-6 md:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider backdrop-blur-md shadow-inner",
                    closed
                      ? "bg-destructive/20 border-destructive/40 text-destructive-foreground"
                      : urgent
                        ? "bg-warning/20 border-warning/40 text-warning-foreground animate-pulse"
                        : "bg-success/20 border-success/40 text-success-foreground",
                  )}
                >
                  {closed
                    ? getTranslation(t, "surveys.details.closed")
                    : urgent
                      ? getTranslation(t, "surveys.details.closingSoon")
                      : getTranslation(t, "surveys.details.active")}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none text-primary-foreground drop-shadow-sm">
                {title}
              </h1>

              {description && (
                <p className="text-primary-foreground/90 text-sm md:text-base font-medium max-w-2xl leading-relaxed drop-shadow-xs">
                  {description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question Feed Arena - Left Side (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  {getTranslation(t, "surveys.details.surveyQuestions")}
                </h2>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  {getTranslation(
                    t,
                    "surveys.details.reviewLayoutDescription",
                  ) || "Review the structured architecture of this survey."}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-sm font-bold bg-card border-border text-muted-foreground rounded-xl px-3 py-0.5 shadow-xs"
              >
                {questions.length}
              </Badge>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {[...questions]
                  .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                  .map((question, idx) => (
                    <SurveyQuestionItem
                      key={question.id ?? idx}
                      question={question}
                      index={idx}
                      t={t}
                    />
                  ))}
              </div>
            ) : (
              <Card className="p-16 text-center border-dashed border-2 border-border bg-card/40 rounded-2xl">
                <HelpCircle className="w-14 h-14 mx-auto text-border mb-4 stroke-[1.5]" />
                <h3 className="text-base font-bold text-card-foreground mb-1">
                  {getTranslation(t, "surveys.details.noQuestionsTitle") ||
                    "No Questions Extracted"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {getTranslation(t, "surveys.details.noQuestions")}
                </p>
              </Card>
            )}
          </div>

          {/* Contextual Intelligence Sidebar - Right Side (4/12) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Quick Micro-Metrics Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <SurveyMetricWidget
                icon={BarChart3}
                label={getTranslation(t, "surveys.card.responses")}
                value={responses_count}
                gradientClass="bg-accent/10"
                iconColor="text-accent"
              />
              <SurveyMetricWidget
                icon={Clock}
                label={getTranslation(t, "surveys.form.fields.closesAt")}
                value={closesLabel}
                gradientClass="bg-chart-5/10"
                iconColor="text-chart-5"
              />
            </div>

            {/* Target Criteria Analytics */}
            <Card className="rounded-2xl border-border/80 shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  {getTranslation(t, "surveys.labels.targetRoles")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {target_roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {target_roles.map((role) => (
                      <Badge
                        key={role}
                        className="px-3 py-1 capitalize font-semibold rounded-lg bg-muted text-foreground border border-border text-xs shadow-xs"
                      >
                        {getTranslation(t, `users.roles.${role}`) ?? role}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground italic">
                    {getTranslation(t, "surveys.details.allRolesTargeted") ||
                      "Open public submission (All roles accessible)"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Response Interaction State Card */}
            <Card className="rounded-2xl border-border/80 shadow-sm bg-card overflow-hidden text-center">
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex p-3.5 rounded-2xl bg-muted shadow-inner">
                  {closed ? (
                    <AlertCircle className="w-7 h-7 text-destructive" />
                  ) : already_responded ? (
                    <CheckCircle2 className="w-7 h-7 text-success" />
                  ) : (
                    <Users className="w-7 h-7 text-accent" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    {closed
                      ? getTranslation(t, "surveys.details.surveyClosed")
                      : already_responded
                        ? getTranslation(t, "surveys.details.youResponded")
                        : getTranslation(
                            t,
                            "surveys.details.informationalSurvey",
                          )}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {closed
                      ? getTranslation(t, "surveys.details.closedMessage")
                      : already_responded
                        ? getTranslation(
                            t,
                            "surveys.details.alreadyRespondedMessage",
                          )
                        : getTranslation(
                            t,
                            "surveys.details.notRespondedMessage",
                          )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Matrix Menu */}
            <Card className="rounded-2xl border-border/80 shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {getTranslation(t, "common.labels.quickActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 rounded-xl border-border text-card-foreground font-semibold text-sm h-11 bg-card hover:bg-muted/60 transition-colors shadow-xs"
                >
                  <Edit className="w-4 h-4 text-muted-foreground shrink-0" />
                  {getTranslation(t, "common.actions.edit")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 rounded-xl border-border text-card-foreground font-semibold text-sm h-11 bg-card hover:bg-muted/60 transition-colors shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  {getTranslation(t, "common.actions.share")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
