import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Calendar,
  Shield,
  Zap,
  MessageSquare,
  Edit,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Clock,
  Star,
  Activity,
  Sliders,
  Award,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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

import type { UserRole, UserStatus } from "@/types";
import { UserDetailsSkeleton } from "./user-details-skeleton";
import { userQueryOptions } from "@/api/query-options";
import { useTranslation } from "react-i18next";
import { getTranslation, isRTL } from "@/lib/utils.ts";

export function UserDetails({ userId }: { userId: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const { data: user, isLoading, isError } = useQuery(userQueryOptions(userId));

  if (isLoading) return <UserDetailsSkeleton />;

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 backdrop-blur-sm">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 mb-4 animate-pulse">
          <Shield className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {getTranslation(t, "users.details.userNotFound")}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center">
          {getTranslation(t, "users.details.userNotFoundDesc")}
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm transition-all"
          onClick={() => window.history.back()}
        >
          {getTranslation(t, "users.details.goBack")}
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: UserStatus) => {
    const colors = {
      active:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      suspended:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      banned:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
    return colors[status] || "";
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      debater:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      trainer:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      judge:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      admin:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
    return colors[role] || "";
  };

  const rtl = isRTL();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-orange-500/30 selection:text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="group rounded-xl px-4 py-2 hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-800/60 transition-all font-medium text-slate-600 dark:text-slate-400"
            aria-label={getTranslation(t, "users.details.back")}
          >
            {rtl ? (
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            )}
            <span className="text-sm font-semibold">
              {getTranslation(t, "users.details.back")}
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold h-10 px-4 transition-all"
            >
              <Edit className="w-4 h-4 text-slate-500" />
              {getTranslation(t, "users.details.edit")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl p-1.5 shadow-xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
              >
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium">
                  {getTranslation(t, "users.details.sendMessage")}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium">
                  {getTranslation(t, "users.details.resetPassword")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                {user.status !== "suspended" && (
                  <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-orange-600 dark:text-orange-400 focus:text-orange-600 dark:focus:text-orange-400 focus:bg-orange-500/10 dark:focus:bg-orange-500/10 font-medium">
                    {getTranslation(t, "users.details.suspendAccount")}
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 focus:bg-rose-500/10 dark:focus:bg-rose-500/10 font-medium">
                    {getTranslation(t, "users.details.banAccount")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hero Identity Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl ring-1 ring-slate-200/60 dark:ring-slate-800/80 mb-8 rounded-3xl bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-yellow-500/5 to-transparent pointer-events-none" />
          <div className="h-32 md:h-40 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-900/40 dark:to-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-14 md:-mt-16">
              <div className="flex-shrink-0 self-start md:self-auto">
                <Avatar className="w-28 h-28 md:w-32 md:h-32 rounded-2xl ring-4 ring-white dark:ring-slate-900 shadow-2xl transform transition-transform duration-300 hover:scale-102">
                  <AvatarImage
                    src={user.avatar_url || ""}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-extrabold bg-gradient-to-tr from-orange-500 to-amber-600 text-white rounded-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    {user.name}
                  </h1>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs px-2.5 py-0.5 font-bold rounded-md tracking-wide shadow-sm border ${getStatusColor(user.status)}`}
                    >
                      {getTranslation(t, `users.statuses.${user.status}`)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs px-2.5 py-0.5 font-bold rounded-md tracking-wide shadow-sm border ${getRoleColor(user.role)}`}
                    >
                      {getTranslation(t, `users.roles.${user.role}`)}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  {user.email}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs md:text-sm font-semibold text-slate-400 dark:text-slate-500">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : getTranslation(t, "users.details.unknownDate")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400">
                    <Star className="w-3.5 h-3.5 opacity-70" />
                    {getTranslation(t, `users.roles.${user.role}`)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Widget */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 dark:hover:ring-orange-500/30">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </span>
                {getTranslation(t, "users.details.contactInfo")}
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.email")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {user.email}
                    {user.email_verified_at && (
                      <span className="w-2 stroke-[3] h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.phone")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.phone ||
                      getTranslation(t, "users.details.notProvided")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Sliders className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "settings.language.title")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="capitalize rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-0"
                  >
                    {getTranslation(
                      t,
                      `settings.language.${user.lang || "en"}`,
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Governance Widget */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 dark:hover:ring-violet-500/30">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </span>
                {getTranslation(t, "users.details.accountInfo")}
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Star className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.role")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize tracking-wide">
                    {getTranslation(t, `users.roles.${user.role}`)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.status")}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize tracking-wide">
                    {getTranslation(t, `users.statuses.${user.status}`)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.themePreference")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="capitalize rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-0"
                  >
                    {user.theme ||
                      getTranslation(t, "users.details.systemTheme")}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnostics & Activity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Gamification Points Panel */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 dark:hover:ring-orange-500/20">
            <div className="p-6 relative">
              <div className="absolute right-6 top-6 w-24 h-24 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </span>
                {getTranslation(t, "users.details.pointsActivity")}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    {getTranslation(t, "users.details.totalPoints")}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-[200px] leading-relaxed">
                    {getTranslation(t, "users.details.pointsDesc")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black tracking-tight bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
                    {user.points}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* System Timeline Panel */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 dark:hover:ring-slate-700/30">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </span>
                {getTranslation(t, "users.details.timeline")}
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {getTranslation(t, "users.details.memberSince")}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : getTranslation(t, "users.details.unknownDate")}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {getTranslation(t, "users.details.lastUpdated")}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {user.updated_at
                      ? new Date(user.updated_at).toLocaleDateString()
                      : getTranslation(t, "users.details.unknownDate")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Console */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
          <div className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              {getTranslation(t, "users.details.quickActions")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <MessageSquare className="w-4 h-4 text-orange-500" />
                {getTranslation(t, "users.details.sendMessage")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Zap className="w-4 h-4 text-orange-600" />
                {getTranslation(t, "users.details.viewActivity")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Shield className="w-4 h-4 text-violet-500" />
                {getTranslation(t, "users.details.managePermissions")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Award className="w-4 h-4 text-emerald-500" />
                {getTranslation(t, "users.details.viewDebates")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
