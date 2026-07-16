"use client";

import { useTranslation } from "react-i18next";
import { useData } from "@/hooks/api/use-data";
import { debateFormatQueryOptions } from "@/api/query-options";
import { getTranslation, isRTL } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, LayoutGrid, FileText, Users } from "lucide-react";
import type { DebateFormat } from "@/types";

interface DebateFormatDetailsProps {
  debate_format_id: number;
}

// Parse description to extract key information
function parseFormatDescription(description: string) {
  const details: Record<string, string> = {};

  const speakersMatch = description.match(/(\d+)\s*speakers?\s*per\s*side/i);
  if (speakersMatch) details.speakers_per_side = speakersMatch[1];

  const mainSpeechMatch = description.match(/(\d+)[\s-]*minute\s*speeches?/i);
  if (mainSpeechMatch) details.main_speech_duration = mainSpeechMatch[1];

  const replySpeechMatch = description.match(
    /reply\s*speeches?\s*\((\d+)\s*min/i,
  );
  if (replySpeechMatch) details.reply_speech_duration = replySpeechMatch[1];

  const crossExamMatch = description.match(/cross[\s-]*exami?nation/i);
  if (crossExamMatch) {
    const durationMatch = description.match(
      /cross[\s-]*exami?nation\s*\((\d+)\s*min/i,
    );
    if (durationMatch) details.cross_examination_duration = durationMatch[1];
  }

  return details;
}

export default function DebateFormatDetails({
  debate_format_id,
}: DebateFormatDetailsProps) {
  const { t, i18n } = useTranslation();

  const { data: debateFormat, isLoading } = useData<DebateFormat>(
    debateFormatQueryOptions(debate_format_id),
    { enabled: !!debate_format_id },
  );

  const normalizedPhases = (() => {
    if (
      !debateFormat?.phase_config ||
      !Array.isArray(debateFormat.phase_config)
    )
      return [];

    return [...debateFormat.phase_config]
      .map((p: any) => ({
        name: p.name ?? "",
        duration_seconds: p.duration_seconds ?? p.duration ?? 300,
        role: p.role ?? p.side ?? "proposition",
        order_index: p.order_index ?? 0,
      }))
      .sort((a, b) => a.order_index - b.order_index);
  })();

  const parsedDetails = debateFormat
    ? parseFormatDescription(debateFormat.description || "")
    : {};
  const totalDuration = normalizedPhases.reduce(
    (sum, phase) => sum + phase.duration_seconds,
    0,
  );

  if (isLoading) {
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!debateFormat) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {getTranslation(t, "debateFormats.details.messages.notFound") ||
          "Format details unavailable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 text-foreground" dir={i18n.dir()}>
      {/* ── Header Section (Merged Hero & Total Duration) ── */}
      <div className="flex items-start justify-between gap-4 border-b pb-3 border-border/80">
        <div className="flex gap-3 items-center min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-warning text-accent-foreground shadow-sm flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
              {debateFormat.name}
            </h1>
            {debateFormat.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium mt-0.5">
                {debateFormat.description}
              </p>
            )}
          </div>
        </div>

        <Badge className="px-2.5 py-1 text-xs font-bold bg-accent text-accent-foreground border border-accent/30 rounded-lg shrink-0 flex items-center gap-1.5 shadow-none">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {Math.floor(totalDuration / 60)}{" "}
            <span className="font-semibold">
              {getTranslation(t, "debateFormats.details.min") || "min"}
            </span>
          </span>
        </Badge>
      </div>

      {/* ── Compact Key Format Metrics Grid ── */}
      {Object.keys(parsedDetails).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {parsedDetails.speakers_per_side && (
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.speakersPerSide") ||
                  "Speakers / Side"}
              </p>
              <p className="text-base font-black text-accent">
                {parsedDetails.speakers_per_side}
              </p>
            </div>
          )}

          {parsedDetails.main_speech_duration && (
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.mainSpeech") ||
                  "Main Speech"}
              </p>
              <p className="text-base font-black text-primary">
                {parsedDetails.main_speech_duration}
                {/* 1. Add an explicit space here: */}{" "}
                {/* 2. Alternatively, bump ml-0.5 up to ml-1 or ml-1.5 for visual spacing: */}
                <span className="text-[10px] font-bold ml-1">
                  {getTranslation(t, "debateFormats.details.min") || "min"}
                </span>
              </p>
            </div>
          )}

          {parsedDetails.reply_speech_duration && (
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.replySpeech") ||
                  "Reply Speech"}
              </p>
              <p className="text-base font-black text-primary">
                {parsedDetails.reply_speech_duration}
                {/* 1. Add an explicit space here: */}{" "}
                {/* 2. Alternatively, bump ml-0.5 up to ml-1 or ml-1.5 for visual spacing: */}
                <span className="text-[10px] font-bold ml-1">
                  {getTranslation(t, "debateFormats.details.min") || "min"}
                </span>
              </p>
            </div>
          )}

          {parsedDetails.cross_examination_duration && (
            <div className="p-2.5 rounded-xl bg-success/10 border border-success/20">
              <p className="text-[10px] font-bold text-success uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.crossExamination") ||
                  "Cross Exam"}
              </p>
              <p className="text-base font-black text-success">
                {parsedDetails.cross_examination_duration}
                <span className="text-[10px] font-bold ml-0.5">
                  {getTranslation(t, "debateFormats.details.min") || "min"}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Internal Scrollable Phase Structure Timeline ── */}
      {normalizedPhases.length > 0 ? (
        <Card className="border border-border/80 bg-muted/40 rounded-xl overflow-hidden shadow-none">
          <CardHeader className="py-2 px-4 border-b border-border/60 bg-card flex flex-row items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-chart-5" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {getTranslation(t, "debateFormats.form.sections.phases") ||
                "Phase Structure"}
            </CardTitle>
          </CardHeader>

          {/* Setting a specific constraints max-height layout with internal scrolling */}
          <CardContent className="p-2 max-h-[240px] overflow-y-auto space-y-1.5 scrollbar-thin">
            {normalizedPhases.map((phase, idx) => {
              const isProposition =
                phase.role === "proposition" || phase.role === "pro";

              const bgColor = isProposition
                ? "from-primary/10 to-primary/5 border-primary/20"
                : "from-accent/10 to-accent/5 border-accent/20";

              const badgeColor = isProposition
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground";

              return (
                <div
                  key={`${phase.name}-${idx}`}
                  className={`flex items-center justify-between gap-3 p-2 rounded-lg border bg-gradient-to-r ${bgColor}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold text-muted-foreground border border-border">
                      {phase.order_index || idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-card-foreground truncate leading-snug">
                        {phase.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground capitalize font-medium leading-none mt-0.5">
                        {getTranslation(
                          t,
                          `debateFormats.roles.${phase.role}`,
                        ) || phase.role}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold rounded-md px-2 py-0.5 shadow-none border-0 ${badgeColor}`}
                  >
                    {Math.floor(phase.duration_seconds / 60)}{" "}
                    {getTranslation(t, "debateFormats.details.min") || "min"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <div className="p-6 text-center border border-dashed rounded-xl border-border">
          <Users className="w-8 h-8 mx-auto text-border mb-2" />
          <p className="text-xs font-medium text-muted-foreground">
            {getTranslation(t, "debateFormats.messages.noPhases") ||
              "No phases configured."}
          </p>
        </div>
      )}
    </div>
  );
}
