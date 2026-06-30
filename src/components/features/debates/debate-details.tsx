"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Trophy,
  PlayCircle,
  FileText,
  UserCheck,
  MoreVertical,
  Award,
  ArrowRight,
  Share2,
  CalendarPlus,
  Zap,
  Info,
  Gavel,
  Quote,
  Flame,
  LayoutGrid,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { debateQueryOptions } from "@/api/query-options";
import { useTranslation } from "react-i18next";
import { getTranslation, isRTL } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

interface DebateDetailsProps {
  debateId: number;
}

export function DebateDetails({ debateId }: DebateDetailsProps) {
  const [isJoining, setIsJoining] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: debate } = useSuspenseQuery(debateQueryOptions(debateId));

  const isLive = debate.status === "live";
  const isCompleted = debate.status === "completed";
  const isScheduled = debate.status === "scheduled";

  const totalDuration = debate.phases.reduce(
    (sum, phase) => sum + phase.duration_seconds,
    0,
  );

  const avatarColors = [
    { bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
    { bg: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { bg: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
    { bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  ];

  const rtl = isRTL();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-orange-500/30 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-10 lg:px-8">
        {/* ── Top Navigation Action Hub ── */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="group rounded-xl px-4 py-2 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-800/60 transition-all font-medium text-slate-600 dark:text-slate-400"
          >
            {rtl ? (
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            )}
            <span className="text-sm font-semibold">
              {getTranslation(t, "debates.details.backToDebates")}
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs font-semibold h-10 px-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              {getTranslation(t, "debates.details.shareLink")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
                >
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl p-1.5 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
              >
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium">
                  {getTranslation(t, "debates.details.editDebate")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 focus:bg-rose-500/10 dark:focus:bg-rose-500/10 font-medium">
                  {getTranslation(t, "debates.details.cancelDebate")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Cyber-Glass Hero Card ── */}
        <Card className="relative overflow-hidden border-0 shadow-xl ring-1 ring-slate-200/60 dark:ring-slate-800/80 mb-6 rounded-3xl bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-yellow-500/5 to-transparent pointer-events-none" />
          <div className="h-28 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-900/40 dark:to-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-10">
              <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  <Gavel className="w-7 h-7" />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {debate.title}
                  </h1>

                  <div className="flex items-center gap-3 flex-wrap pt-0.5">
                    <Badge
                      variant="outline"
                      className={`text-xs px-3 py-0.5 font-bold rounded-md tracking-wide shadow-sm capitalize border ${
                        isLive
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          : isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {isLive && (
                        <span className="relative flex h-2 w-2 ltr:mr-1.5 rtl:ml-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      )}
                      {getTranslation(t, `debates.statuses.${debate.status}`)}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-md">
                      {getTranslation(t, "debates.details.hostedBy")}
                      {": "}
                      <strong className="text-slate-600 dark:text-slate-300 font-bold">
                        {debate.created_by.name}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 self-start md:self-auto pt-2 md:pt-0">
                {isLive && (
                  <Button
                    onClick={() => setIsJoining(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md rounded-xl h-11 px-6 font-bold tracking-wide gap-2 transition-all hover:scale-102"
                  >
                    <PlayCircle className="w-5 h-5 animate-pulse" />
                    {getTranslation(t, "debates.details.joinLive")}
                  </Button>
                )}
                {isCompleted && debate.recording_url && (
                  <Button className="w-full sm:w-auto font-bold tracking-wide h-11 px-6 rounded-xl gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 transition-all shadow-md">
                    <PlayCircle className="w-5 h-5" />
                    {getTranslation(t, "debates.details.watchRecording")}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Motion Card (Cinematic Layout) ── */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 mb-6 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="flex items-center gap-2.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Quote className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </span>
              {getTranslation(t, "debates.details.motion")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-5">
            <blockquote className="text-base md:text-lg font-bold border-l-4 border-orange-500 pl-4 py-2 text-slate-800 dark:text-slate-200 leading-relaxed bg-gradient-to-r from-orange-500/5 to-transparent rounded-r-xl">
              "{debate.motion.text}"
            </blockquote>

            {debate?.motion?.frameworks?.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-2.5">
                  {getTranslation(t, "debates.details.frameworks")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {debate.motion.frameworks.map((fw) => (
                    <Badge
                      key={fw.id}
                      variant="outline"
                      className="text-xs px-3 py-1 font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-sm rounded-md"
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor: fw.color_hex || "#ff9544",
                      }}
                    >
                      {fw.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Row 1: Status · Info · Quick Actions Console ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Status Metric Panel */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isCompleted ? (
                  <>
                    <Award className="w-4 h-4 text-amber-500" />
                    {getTranslation(t, "debates.details.result")}
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-orange-500" />
                    {getTranslation(t, "debates.details.status")}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 flex flex-col justify-center min-h-[120px]">
              {isCompleted && debate.result ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shadow-inner">
                    <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 text-center tracking-wide">
                    {getTranslation(t, "debates.details.winnerTitle", {
                      side: debate.result.winning_side,
                    })}
                  </p>
                </div>
              ) : isLive ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center animate-pulse">
                    <Flame className="w-6 h-6 text-rose-500" />
                  </div>
                  <p className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                    {getTranslation(t, "debates.details.liveNow")}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {getTranslation(t, "debates.details.scheduledFor")}
                  </p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug">
                    {new Date(debate.scheduled_at).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Core Information Ledger */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                <Info className="w-4 h-4 text-orange-500" />
                {getTranslation(t, "debates.details.information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4 space-y-3 text-sm font-medium">
              {[
                {
                  label: getTranslation(t, "debates.details.hostedBy"),
                  value: debate.created_by.name,
                },
                {
                  label: getTranslation(t, "debates.details.scheduledAt"),
                  value: new Date(debate.scheduled_at).toLocaleDateString(),
                },
                {
                  label: getTranslation(t, "debates.details.totalDuration"),
                  value: getTranslation(t, "debates.details.minutes", {
                    count: Math.floor(totalDuration / 60),
                  }),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                >
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    {label}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[150px]">
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  {getTranslation(t, "debates.details.tag")}
                </span>
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0 rounded-md px-2 py-0.5"
                >
                  #{debate.tag}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Quick Actions Console */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                <Zap className="w-4 h-4 text-orange-500" />
                {getTranslation(t, "debates.details.quickActions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-4 flex flex-col gap-2">
              {isScheduled && (
                <Button
                  variant="outline"
                  className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-10 rounded-xl transition-all shadow-sm gap-2"
                >
                  <CalendarPlus className="w-4 h-4 text-orange-500" />
                  {getTranslation(t, "debates.details.setReminder")}
                </Button>
              )}
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-10 rounded-xl transition-all shadow-sm gap-2"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                {getTranslation(t, "debates.details.viewTranscript")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-10 rounded-xl transition-all shadow-sm gap-2"
              >
                <UserCheck className="w-4 h-4 text-violet-500" />
                {getTranslation(t, "debates.details.manageParticipants")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Row 2: Structure + Participants Split view ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Phases/Structure Card */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 dark:border-slate-800/60">
              <CardTitle className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <LayoutGrid className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </span>
                  {getTranslation(t, "debates.details.structure")}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  {getTranslation(t, "debates.details.minTotal")}
                  {": "}
                  {Math.floor(totalDuration / 60)}{" "}
                  {getTranslation(t, "debates.details.min")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {debate.phases
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((phase, idx) => (
                    <div
                      key={phase.id}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 dark:hover:ring-1 dark:hover:ring-orange-500/20 transition-all duration-200"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 flex-shrink-0 border border-slate-200/40 dark:border-slate-700/40">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                          {phase.name}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {Math.floor(phase.duration_seconds / 60)}{" "}
                        {getTranslation(t, "debates.details.min")}
                      </span>

                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2.5 py-0.5 capitalize font-bold rounded-md tracking-wide flex-shrink-0 shadow-sm border ${
                          phase.status === "active"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            : phase.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" // pending
                        }`}
                      >
                        {getTranslation(
                          t,
                          `debates.details.phaseStatus.${phase.status}`,
                        )}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Participants Grid */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 dark:border-slate-800/60">
              <CardTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </span>
                {getTranslation(t, "debates.details.participants", {
                  count: debate.participants.length,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {debate.participants.map((p, i) => {
                  const color = avatarColors[i % avatarColors.length];
                  return (
                    <div
                      key={p.id}
                      onClick={() => navigate({ to: `/users/${p.user.id}` })}
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-orange-500/30 dark:hover:border-orange-500/30 dark:hover:ring-1 dark:hover:ring-orange-500/20 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transform transition-transform duration-200 group-hover:scale-105">
                        <AvatarImage
                          src={p.user.avatar_url || ""}
                          alt={p.user.name}
                          className="object-cover"
                        />
                        <AvatarFallback
                          className={`${color.bg} font-black text-xs rounded-xl`}
                        >
                          {p.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {p.user.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 capitalize mt-0.5 tracking-wide">
                          {getTranslation(t, `users.roles.${p.user.role}`)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
