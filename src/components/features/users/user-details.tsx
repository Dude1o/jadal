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
        <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4 animate-pulse">
          <Shield className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {getTranslation(t, "users.details.userNotFound")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm text-center">
          {getTranslation(t, "users.details.userNotFoundDesc")}
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl font-semibold border-border hover:bg-muted shadow-sm transition-all"
          onClick={() => window.history.back()}
        >
          {getTranslation(t, "users.details.goBack")}
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: UserStatus) => {
    const colors = {
      active: "bg-success text-success-foreground border-success/20",
      suspended: "bg-warning text-warning-foreground border-warning/20",
      banned:
        "bg-destructive text-destructive-foreground border-destructive/20",
    };
    return colors[status] || "";
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      debater: "bg-primary text-primary-foreground border-primary/20",
      trainer: "bg-success text-success-foreground border-success/20",
      judge: "bg-warning text-warning-foreground border-warning/20",
      admin: "bg-destructive text-destructive-foreground border-destructive/20",
    };
    return colors[role] || "";
  };

  const rtl = isRTL();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="group rounded-xl px-4 py-2 hover:bg-card dark:hover:text-accent hover:shadow-sm ring-1 ring-transparent hover:ring-border/60 transition-all font-medium text-muted-foreground"
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
              className="gap-2 rounded-xl bg-card border-border shadow-sm hover:bg-muted text-sm font-semibold h-10 px-4 transition-all"
            >
              <Edit className="w-4 h-4 text-muted-foreground" />
              {getTranslation(t, "users.details.edit")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-card border-border hover:bg-muted shadow-sm transition-all"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl p-1.5 shadow-xl border-border bg-card/80 backdrop-blur-md"
              >
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium">
                  {getTranslation(t, "users.details.sendMessage")}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium">
                  {getTranslation(t, "users.details.resetPassword")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted" />
                {user.status !== "suspended" && (
                  <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-warning focus:text-warning focus:bg-warning/10 font-medium">
                    {getTranslation(t, "users.details.suspendAccount")}
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium">
                    {getTranslation(t, "users.details.banAccount")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hero Identity Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl ring-1 ring-border/60 mb-8 rounded-3xl bg-card">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-warning/5 to-transparent pointer-events-none" />
          <div className="h-32 md:h-40 bg-gradient-to-r from-muted via-border to-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-14 md:-mt-16">
              <div className="flex-shrink-0 self-start md:self-auto">
                <Avatar className="w-28 h-28 md:w-32 md:h-32 rounded-2xl ring-4 ring-card shadow-2xl transform transition-transform duration-300 hover:scale-102">
                  <AvatarImage
                    src={user.avatar_url || ""}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-extrabold bg-gradient-to-tr from-accent to-warning text-accent-foreground rounded-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-none">
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

                <p className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
                  {user.email}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs md:text-sm font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : getTranslation(t, "users.details.unknownDate")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md text-muted-foreground">
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
          <Card className="border-0 shadow-sm ring-1 ring-border bg-card overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:ring-accent/30">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-foreground mb-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </span>
                {getTranslation(t, "users.details.contactInfo")}
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.email")}
                  </span>
                  <span className="font-semibold text-card-foreground flex items-center gap-2">
                    {user.email}
                    {user.email_verified_at && (
                      <span className="w-2 stroke-[3] h-2 rounded-full bg-success ring-4 ring-success/20" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.phone")}
                  </span>
                  <span className="font-semibold text-card-foreground">
                    {user.phone ||
                      getTranslation(t, "users.details.notProvided")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Sliders className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "settings.language.title")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="capitalize rounded-md bg-muted text-card-foreground font-bold border-0"
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
          <Card className="border-0 shadow-sm ring-1 ring-border bg-card overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:ring-chart-5/30">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-foreground mb-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-chart-5" />
                </span>
                {getTranslation(t, "users.details.accountInfo")}
              </h3>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Star className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.role")}
                  </span>
                  <span className="font-bold text-card-foreground capitalize tracking-wide">
                    {getTranslation(t, `users.roles.${user.role}`)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <UserCheck className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.status")}
                  </span>
                  <span className="font-bold text-card-foreground capitalize tracking-wide">
                    {getTranslation(t, `users.statuses.${user.status}`)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-70" />{" "}
                    {getTranslation(t, "users.details.themePreference")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="capitalize rounded-md bg-muted text-card-foreground font-bold border-0"
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
          <Card className="border-0 shadow-sm ring-1 ring-border bg-card overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:ring-accent/20">
            <div className="p-6 relative">
              <div className="absolute right-6 top-6 w-24 h-24 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="flex items-center gap-3 text-base font-bold text-foreground mb-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </span>
                {getTranslation(t, "users.details.pointsActivity")}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {getTranslation(t, "users.details.totalPoints")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 max-w-[200px] leading-relaxed">
                    {getTranslation(t, "users.details.pointsDesc")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black tracking-tight bg-gradient-to-br from-accent via-warning to-warning bg-clip-text text-transparent drop-shadow-sm">
                    {user.points}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* System Timeline Panel */}
          <Card className="border-0 shadow-sm ring-1 ring-border bg-card overflow-hidden rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:ring-border">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-base font-bold text-foreground mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </span>
                {getTranslation(t, "users.details.timeline")}
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/50">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {getTranslation(t, "users.details.memberSince")}
                  </p>
                  <p className="text-sm font-bold text-card-foreground mt-1">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : getTranslation(t, "users.details.unknownDate")}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/50">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {getTranslation(t, "users.details.lastUpdated")}
                  </p>
                  <p className="text-sm font-bold text-card-foreground mt-1">
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
        <Card className="border-0 shadow-sm ring-1 ring-border bg-card overflow-hidden rounded-2xl">
          <div className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {getTranslation(t, "users.details.quickActions")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-border hover:bg-muted h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <MessageSquare className="w-4 h-4 text-accent" />
                {getTranslation(t, "users.details.sendMessage")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-border hover:bg-muted h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Zap className="w-4 h-4 text-accent" />
                {getTranslation(t, "users.details.viewActivity")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-border hover:bg-muted h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Shield className="w-4 h-4 text-chart-5" />
                {getTranslation(t, "users.details.managePermissions")}
              </Button>
              <Button
                variant="outline"
                className="justify-start text-xs font-bold border-border hover:bg-muted h-11 rounded-xl transition-all shadow-sm gap-2"
              >
                <Award className="w-4 h-4 text-success" />
                {getTranslation(t, "users.details.viewDebates")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
