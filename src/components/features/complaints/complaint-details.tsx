import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Shield,
  User,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Inbox,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ComplaintStatus } from "@/types";
import { complaintQueryOptions } from "@/api/query-options";
import { getTranslation, isRTL } from "@/lib/utils";

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// ── Configuration Constants ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { colorClass: string; icon: React.ComponentType<any>; glow: string }
> = {
  under_review: {
    colorClass: "bg-warning/10 text-warning border-warning/20",
    icon: Clock,
    glow: "shadow-[0_0_15px_var(--warning)/15]",
  },
  resolved: {
    colorClass: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
    glow: "shadow-[0_0_15px_var(--success)/15]",
  },
  dismissed: {
    colorClass: "bg-muted/10 text-muted-foreground border-border/20",
    icon: XCircle,
    glow: "shadow-[0_0_15px_var(--muted-foreground)/15]",
  },
  open: {
    colorClass: "bg-primary/10 text-primary border-primary/20",
    icon: Inbox,
    glow: "shadow-[0_0_15px_var(--primary)/15]",
  },
};

// ── Modular Sub-components ────────────────────────────────────────────────────

function HeroSection({ complaint, t }: { complaint: any; t: any }) {
  const currentStatus =
    STATUS_CONFIG[complaint.status as ComplaintStatus] || STATUS_CONFIG.open;
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div variants={itemVariants} className="relative w-full">
      <Card
        className={`overflow-hidden border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300 ${currentStatus.glow}`}
      >
        <div className="h-32 bg-gradient-to-r from-muted via-border to-muted relative overflow-hidden flex items-center px-6 md:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
        </div>

        <CardContent className="px-6 md:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl border-4 border-card shadow-xl bg-gradient-to-tr from-accent to-warning flex items-center justify-center shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <AlertCircle className="w-9 h-9 text-accent-foreground" />
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight break-words">
                {complaint.description}
              </h1>
              <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5">
                <span>
                  {getTranslation(t, "complaints.details.id")} #{complaint.id}
                </span>
                {complaint.debate_id != null && (
                  <>
                    <span className="text-border">
                      •
                    </span>
                    <span className="text-accent font-semibold">
                      {getTranslation(t, "complaints.details.debateId")} #
                      {complaint.debate_id}
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="sm:self-end mt-2 sm:mt-0">
              <Badge
                variant="outline"
                className={`capitalize px-3 py-1 text-xs font-semibold tracking-wide border rounded-xl flex items-center gap-1.5 ${currentStatus.colorClass}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {getTranslation(t, `complaints.statuses.${complaint.status}`)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FilerProfile({ filer, t }: { filer: any; t: any }) {
  return (
    <Card className="border-border/80 bg-card/40 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-border/60">
        <CardTitle className="text-base font-bold flex items-center gap-2.5 text-card-foreground">
          <div className="p-1.5 bg-accent/10 rounded-lg text-accent">
            <User className="w-4 h-4" />
          </div>
          {getTranslation(t, "complaints.details.filedBy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5 flex-1">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 border border-border/40">
          <Avatar className="w-12 h-12 ring-2 ring-accent/20">
            <AvatarImage src={filer.avatar_url ?? ""} alt={filer.name} />
            <AvatarFallback className="text-sm font-bold bg-gradient-to-tr from-accent to-warning text-accent-foreground">
              {filer.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">
              {filer.name}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {filer.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl border border-border/50 bg-card/20">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {getTranslation(t, "users.details.role")}
            </span>
            <span className="text-xs font-semibold text-card-foreground mt-1 block capitalize">
              {getTranslation(t, `users.roles.${filer.role}`)}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-border/50 bg-card/20">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {getTranslation(t, "users.details.status")}
            </span>
            <span className="text-xs font-semibold text-card-foreground mt-1 block capitalize">
              {getTranslation(t, `users.statuses.${filer.status}`)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminResponse({ response, t }: { response: string | null; t: any }) {
  return (
    <Card className="border-border/80 bg-card/40 backdrop-blur-md shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <CardHeader className="pb-4 border-b border-border/60">
        <CardTitle className="text-base font-bold flex items-center gap-2.5 text-card-foreground">
          <div className="p-1.5 bg-chart-5/10 rounded-lg text-chart-5">
            <Shield className="w-4 h-4" />
          </div>
          {getTranslation(t, "complaints.details.adminResponse")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 flex-1 flex flex-col justify-center">
        {response ? (
          <div className="p-4 rounded-xl bg-chart-5/5 border border-chart-5/20">
            <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-wrap">
              {response}
            </p>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-border bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium italic">
              {getTranslation(t, "complaints.details.noResponse")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimelineTracker({
  createdAt,
  updatedAt,
  t,
}: {
  createdAt: string;
  updatedAt: string;
  t: any;
}) {
  const formatDate = (dateString: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString(undefined, {
          dateStyle: "medium",
        })
      : getTranslation(t, "users.details.unknownDate");

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-border/80 bg-gradient-to-br from-card/60 to-background/60 backdrop-blur-md shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 relative justify-around">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-muted rounded-xl text-muted-foreground mt-0.5 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {getTranslation(t, "complaints.details.filedOn")}
                </span>
                <span className="text-sm font-semibold text-card-foreground mt-1 block">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-border my-1" />

            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-muted rounded-xl text-muted-foreground mt-0.5 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {getTranslation(t, "users.details.lastUpdated")}
                </span>
                <span className="text-sm font-semibold text-card-foreground mt-1 block">
                  {formatDate(updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Skeleton UI Loading View ──────────────────────────────────────────────────

function ComplaintDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-9 w-24 rounded-xl bg-border" />
        <div className="h-56 rounded-2xl bg-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 rounded-2xl bg-border" />
          <div className="h-48 rounded-2xl bg-border" />
        </div>
        <div className="h-24 rounded-2xl bg-border" />
      </div>
    </div>
  );
}

// ── Master Component ──────────────────────────────────────────────────────────

export function ComplaintDetails({ complaintId }: { complaintId: number }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: complaint,
    isLoading,
    error,
  } = useSuspenseQuery(complaintQueryOptions(complaintId));

  if (isLoading) return <ComplaintDetailsSkeleton />;

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {getTranslation(t, "complaints.details.notFound")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {getTranslation(t, "complaints.details.notFoundDesc")}
        </p>
        <Button
          variant="outline"
          className="rounded-xl px-5"
          onClick={() => window.history.back()}
        >
          {getTranslation(t, "complaints.details.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-card to-background p-4 md:p-8 selection:bg-accent/20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* ── Action Back Header ── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="rounded-xl font-semibold text-xs tracking-wide bg-muted hover:bg-muted/70 text-muted-foreground gap-2 transition-all duration-200"
          >
            {isRTL() ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            {getTranslation(t, "complaints.details.back")}
          </Button>
        </motion.div>

        {/* ── Hero Info Accent Card ── */}
        <HeroSection complaint={complaint} t={t} />

        {/* ── Split Information Grid ── */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FilerProfile filer={complaint.filed_by} t={t} />
          <AdminResponse response={complaint.admin_response} t={t} />
        </motion.div>

        {/* ── Dynamic Timestamp Timeline ── */}
        <TimelineTracker
          createdAt={complaint.created_at}
          updatedAt={complaint.updated_at}
          t={t}
        />

        {/* ── Contextual Responsive Quick Actions ── */}
        <AnimatePresence>
          {(complaint.status === "under_review" ||
            complaint.debate_id != null) && (
            <motion.div variants={itemVariants} layout className="w-full">
              <Card className="border-border/80 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-card-foreground">
                      {getTranslation(t, "users.details.quickActions")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Execute status moderation and dynamic navigation anchors.
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {complaint.status === "under_review" && (
                      <>
                        <Button
                          variant="default"
                          className="text-xs font-semibold h-9 rounded-xl px-4 bg-success hover:bg-success/90 text-success-foreground shadow-md shadow-success/10 transition-all"
                        >
                          {getTranslation(t, "complaints.details.resolve")}
                        </Button>
                        <Button
                          variant="destructive"
                          className="text-xs font-semibold h-9 rounded-xl px-4 shadow-md transition-all"
                        >
                          {getTranslation(t, "complaints.details.dismiss")}
                        </Button>
                      </>
                    )}
                    {complaint.debate_id != null && (
                      <Button
                        variant="secondary"
                        className="text-xs font-semibold h-9 rounded-xl px-4 border border-border gap-1.5 transition-all"
                        onClick={() =>
                          navigate({ to: `/debates/${complaint.debate_id}` })
                        }
                      >
                        {getTranslation(t, "complaints.details.viewDebate")}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
