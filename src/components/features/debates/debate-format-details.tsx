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
    <div
      className="w-full space-y-4 text-slate-900 dark:text-slate-100"
      dir={i18n.dir()}
    >
      {/* ── Header Section (Merged Hero & Total Duration) ── */}
      <div className="flex items-start justify-between gap-4 border-b pb-3 border-slate-100 dark:border-slate-800/80">
        <div className="flex gap-3 items-center min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {debateFormat.name}
            </h1>
            {debateFormat.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-0.5">
                {debateFormat.description}
              </p>
            )}
          </div>
        </div>

        <Badge className="px-2.5 py-1 text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 rounded-lg shrink-0 flex items-center gap-1.5 shadow-none">
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/10 dark:to-amber-950/10 border border-orange-200/40 dark:border-orange-800/20">
              <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.speakersPerSide") ||
                  "Speakers / Side"}
              </p>
              <p className="text-base font-black text-orange-700 dark:text-orange-300">
                {parsedDetails.speakers_per_side}
              </p>
            </div>
          )}

          {parsedDetails.main_speech_duration && (
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10 border border-blue-200/40 dark:border-blue-800/20">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.mainSpeech") ||
                  "Main Speech"}
              </p>
              <p className="text-base font-black text-blue-700 dark:text-blue-300">
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10 border border-blue-200/40 dark:border-blue-800/20">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.replySpeech") ||
                  "Reply Speech"}
              </p>
              <p className="text-base font-black text-blue-700 dark:text-blue-300">
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
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/10 dark:to-teal-950/10 border border-emerald-200/40 dark:border-emerald-800/20">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                {getTranslation(t, "debateFormats.details.crossExamination") ||
                  "Cross Exam"}
              </p>
              <p className="text-base font-black text-emerald-700 dark:text-emerald-300">
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
        <Card className="border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl overflow-hidden shadow-none">
          <CardHeader className="py-2 px-4 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-row items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-violet-500" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                ? "from-blue-50/60 to-blue-50/20 dark:from-blue-950/10 dark:to-transparent border-blue-100 dark:border-blue-900/30"
                : "from-rose-50/60 to-rose-50/20 dark:from-rose-950/10 dark:to-transparent border-rose-100 dark:border-rose-900/30";

              const badgeColor = isProposition
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300";

              return (
                <div
                  key={`${phase.name}-${idx}`}
                  className={`flex items-center justify-between gap-3 p-2 rounded-lg border bg-gradient-to-r ${bgColor}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                      {phase.order_index || idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                        {phase.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize font-medium leading-none mt-0.5">
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
        <div className="p-6 text-center border border-dashed rounded-xl border-slate-200 dark:border-slate-800">
          <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {getTranslation(t, "debateFormats.messages.noPhases") ||
              "No phases configured."}
          </p>
        </div>
      )}
    </div>
  );
}
