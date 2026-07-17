import i18n from "@/i18n";
import type { Framework, ImprovementBand, SideBarItem } from "@/types";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { avatarPalette } from "./constants";
import { cn } from "./cn";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { FileImage, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FilterOptions } from "@/components/layout/toolbar/toolbar-filter";
import { useLocation } from "@tanstack/react-router";

export { cn };

import {
  Users,
  DollarSign,
  ShoppingCart,
  Star,
  TrendingUp,
  Activity,
  Package,
  AlertCircle,
  Scale,
  Trophy,
  UserX,
  UserCheck,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Percent,
  AlertTriangle,
} from "lucide-react";
import type {
  ComplaintAccountability,
  EngagementChurn,
  Leaderboard,
  PlatformHealth,
  StatTrend,
  Statistic,
} from "@/types";

export const getSampleStats = (t: TFunction): Statistic[] => [
  {
    id: "1",
    label: getTranslation(t, "statistics.totalRevenue"),
    value: 84320,
    prefix: "$",
    trend: "up",
    trendValue: "+18.2%",
    trendLabel: getTranslation(t, "statistics.vsLastMonth"),
    icon: DollarSign,
    variant: "success",
    description: getTranslation(t, "statistics.acrossAllChannels"),
  },
  {
    id: "2",
    label: getTranslation(t, "statistics.activeUsers"),
    value: 12540,
    trend: "up",
    trendValue: "+5.7%",
    trendLabel: getTranslation(t, "statistics.vsLastWeek"),
    icon: Users,
    variant: "default",
    description: getTranslation(t, "statistics.registeredAccounts"),
  },
  {
    id: "3",
    label: getTranslation(t, "statistics.newOrders"),
    value: 3287,
    trend: "down",
    trendValue: "-3.1%",
    trendLabel: getTranslation(t, "statistics.vsYesterday"),
    icon: ShoppingCart,
    variant: "accent",
    description: getTranslation(t, "statistics.pendingFulfillment"),
  },
  {
    id: "4",
    label: getTranslation(t, "statistics.avgRating"),
    value: 94,
    suffix: "%",
    trend: "up",
    trendValue: "+1.4%",
    trendLabel: getTranslation(t, "statistics.satisfactionScore"),
    icon: Star,
    variant: "warning",
    description: getTranslation(t, "statistics.basedOnReviews"),
  },
];

export function frameworkToStatistic(f: Framework, t: TFunction): Statistic {
  const propPct = f.prop_win_rate * 100;
  const oppPct = f.opp_win_rate * 100;
  const drawPct = Math.max(0, 100 - propPct - oppPct);

  return {
    id: String(f.framework_id),
    label: f.label,
    value: Math.round(propPct * 10) / 10,
    suffix: "%",
    icon: Scale,
    variant: f.flagged ? "destructive" : "default",
    badge: f.flagged ? getTranslation(t, "statistics.flagged") : undefined,
    description:
      drawPct > 0.5
        ? getTranslation(t, "statistics.oppositionAndDraws", {
            opposition: oppPct.toFixed(1),
            draws: drawPct.toFixed(1),
          })
        : getTranslation(t, "statistics.oppositionWinRate", {
            opposition: oppPct.toFixed(1),
          }),
    trend:
      f.prop_win_rate === f.opp_win_rate
        ? "neutral"
        : f.prop_win_rate > f.opp_win_rate
          ? "up"
          : "down",
    trendValue: getTranslation(t, "statistics.imbalance", {
      value: f.imbalance_score.toFixed(2),
    }),
    trendLabel: getTranslation(t, "statistics.debatesCount", {
      count: f.n_debates,
    }),
  };
}

const bandTrend: Record<ImprovementBand, StatTrend> = {
  strong_upward: "up",
  improving: "up",
  stable: "neutral",
  regressing: "down",
  sharp_decline: "down",
};

export function leaderboardToStatistics(
  data: Leaderboard,
  t: TFunction,
): Statistic[] {
  return data.entries.map((e) => {
    const isPercent = data.board === "win_rate";
    const value = isPercent ? Math.round(e.value * 1000) / 10 : e.value;

    return {
      id: `lb-${e.user_id}`,
      label: `#${e.rank} ${e.name}`,
      value,
      suffix: isPercent ? "%" : undefined,
      icon: Trophy,
      variant:
        e.band === "sharp_decline" || e.band === "regressing"
          ? "destructive"
          : "default",
      description: getTranslation(t, "statistics.debatesCount", {
        count: e.n_debates,
      }),
      trend: e.band ? bandTrend[e.band] : undefined,
      trendValue: e.band
        ? getTranslation(t, `statistics.improvement.${e.band}`)
        : undefined,
    };
  });
}

export function platformHealthToStatistics(
  data: PlatformHealth,
  t: TFunction,
): Statistic[] {
  const bucket = data.buckets[data.buckets.length - 1];
  if (!bucket) return [];

  const newUsersTotal =
    bucket.new_users.debater +
    bucket.new_users.trainer +
    bucket.new_users.judge +
    bucket.new_users.admin;

  return [
    {
      id: "ph-new-users",
      label: getTranslation(t, "statistics.newUsers"),
      value: newUsersTotal,
      icon: Users,
      variant: "default",
    },
    {
      id: "ph-created",
      label: getTranslation(t, "statistics.debatesCreated"),
      value: bucket.debates_created,
      icon: Calendar,
      variant: "default",
    },
    {
      id: "ph-completed",
      label: getTranslation(t, "statistics.debatesCompleted"),
      value: bucket.debates_completed,
      icon: CheckCircle2,
      variant: "success",
    },
    {
      id: "ph-cancelled",
      label: getTranslation(t, "statistics.debatesCancelled"),
      value: bucket.debates_cancelled,
      icon: XCircle,
      variant: bucket.debates_cancelled > 0 ? "warning" : "default",
    },
    {
      id: "ph-completion-rate",
      label: getTranslation(t, "statistics.completionRate"),
      value:
        bucket.completion_rate === null
          ? 0
          : Math.round(bucket.completion_rate * 1000) / 10,
      suffix: "%",
      icon: Percent,
      variant: "default",
    },
    {
      id: "ph-avg-per-debater",
      label: getTranslation(t, "statistics.avgDebatesPerActive"),
      value:
        bucket.avg_debates_per_active_debater === null
          ? 0
          : Math.round(bucket.avg_debates_per_active_debater * 10) / 10,
      icon: Activity,
      variant: "default",
    },
  ];
}

export function engagementChurnToStatistics(
  data: EngagementChurn,
  t: TFunction,
): Statistic[] {
  return data.entries.map((e) => ({
    id: `ec-${e.user_id}`,
    label: e.name,
    value: e.days_since_last_debate,
    suffix: getTranslation(t, "statistics.days"),
    icon:
      e.risk === "churn_risk"
        ? UserX
        : e.risk === "ramping_up"
          ? UserCheck
          : User,
    variant:
      e.risk === "churn_risk"
        ? "destructive"
        : e.risk === "ramping_up"
          ? "success"
          : "default",
    badge:
      e.risk === "churn_risk"
        ? getTranslation(t, "statistics.atRisk")
        : undefined,
    description: getTranslation(t, "statistics.recentAndBaseline", {
      recent: e.recent_n_debates,
      baseline: e.baseline_n_debates,
    }),
  }));
}

export function complaintAccountabilityToStatistics(
  data: ComplaintAccountability,
  t: TFunction,
): Statistic[] {
  return data.entries.map((e) => ({
    id: `ca-${e.user_id}-${e.target_role}`,
    label: `${e.name} (${e.target_role})`,
    value: Math.round(e.complaints_per_100_debates * 10) / 10,
    icon: AlertTriangle,
    variant: "default",
    description: getTranslation(t, "statistics.complaintsAndDebates", {
      complaints: e.complaints_total,
      debates: e.debates_involved,
    }),
    trend:
      e.avg_time_to_last_update_hours_approx !== null ? "neutral" : undefined,
    trendValue:
      e.avg_time_to_last_update_hours_approx !== null
        ? getTranslation(t, "statistics.hoursApprox", {
            count: Math.round(e.avg_time_to_last_update_hours_approx),
          })
        : undefined,
    trendLabel:
      e.avg_time_to_last_update_hours_approx !== null
        ? getTranslation(t, "statistics.averageResolution")
        : undefined,
  }));
}

export function formatRelativeTime(iso: string, t: TFunction): string {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return getTranslation(t, "statistics.justNow");
  if (diffMin < 60)
    return getTranslation(t, "statistics.minutesAgo", { count: diffMin });
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24)
    return getTranslation(t, "statistics.hoursAgo", { count: diffHr });
  return getTranslation(t, "statistics.daysAgo", {
    count: Math.round(diffHr / 24),
  });
}

/* ── Avatar utils ── */
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avatarColor(name: string) {
  return avatarPalette[name.charCodeAt(0) % avatarPalette.length];
}

/* ── Translation utils ── */
export function getTranslation(
  t: TFunction,
  key: string,
  options?: Record<string, any>,
): string {
  return t(key, options);
}

export default function getTime(time: string) {
  return formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: i18n.language === "ar" ? ar : undefined,
  });
}

/* ── Direction utils ── */
export function isRTL() {
  return i18n.language === "ar";
}

export function useRtl() {
  const { i18n } = useTranslation();
  const rtl = i18n.language === "ar";
  return {
    isRTL: rtl,
    dir: rtl ? "rtl" : "ltr",
  };
}

export function rtlFlex(base = "flex items-center gap-2") {
  return cn(base, isRTL() && "flex-row-reverse");
}

export function rtlAuto() {
  return isRTL() ? "mr-auto" : "ml-auto";
}

export function rtlChevron() {
  return isRTL() ? "scale-x-[-1]" : "";
}

/* ── Number / format utils ── */
export function getNumber(number: number) {
  return isRTL() ? new Intl.NumberFormat("ar-EG").format(number) : number;
}

export function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ── Survey / date utils ── */
export const isClosed = (closesAt: string | null, now: number): boolean => {
  if (!closesAt) return false;
  return new Date(closesAt).getTime() < now;
};

export const isUrgent = (closesAt: string | null, now: number): boolean => {
  if (!closesAt) return false;
  const diff = new Date(closesAt).getTime() - now;
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 3; // within 3 days
};

/* ── Sidebar active-state utils ── */
export function isMenuItemActive(
  pathname: string,
  search: Record<string, string>,
  item: SideBarItem,
) {
  const isParentActive =
    pathname === item.url &&
    (!item.search ||
      Object.entries(item.search).every(
        ([key, value]) => search[key] === value,
      ));

  const hasActiveChild = item.subItems?.some(
    (subItem) =>
      pathname === subItem.url &&
      (!subItem.search ||
        Object.entries(subItem.search).every(
          ([key, value]) => search[key] === value,
        )),
  );

  return isParentActive && !hasActiveChild;
}

export function isSubMenuItemActive(
  pathname: string,
  search: Record<string, string>,
  subItem: SideBarItem,
) {
  return (
    pathname === subItem.url &&
    (!subItem.search ||
      Object.entries(subItem.search).every(
        ([key, value]) => search[key] === value,
      ))
  );
}

export function getError(errors?: any[]) {
  return errors?.[0];
}

export function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(str: string) {
  return /^\+?[\d\s\-().]{7,20}$/.test(str);
}

export function removeFromEnd(str: string): string {
  const count: number = isRTL() ? 2 : 1;

  if (count <= 0) return str;

  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const graphemes = Array.from(segmenter.segment(str), (s) => s.segment);

  if (count >= graphemes.length) return "";

  return graphemes.slice(0, graphemes.length - count).join("");
}

export function isImage(file: File) {
  return file.type.startsWith("image/");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(file: File) {
  if (file?.type.startsWith("image/")) return FileImage;
  if (file?.type === "application/pdf") return FileText;
  return File;
}

export function truncate(text: string, max = 15) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function isAsyncOptions(options: any) {
  return typeof options === "function";
}

// Change the name to start with "use"
export function useAsyncData(options: any) {
  const { data: asyncData, isLoading } = useQuery(
    isAsyncOptions(options)
      ? (options as () => any)()
      : { queryKey: ["disabled"], queryFn: async () => null, enabled: false },
  );
  return { asyncData, isLoading };
}

export function resolveOptions(
  options: FilterOptions,
): { label: string; value: string | number }[] {
  // If it's an array, return it directly
  if (Array.isArray(options)) {
    return options as any;
  }
  // If it's a function, it should have been resolved by useQuery already
  return [];
}

export const useMergeSearch = () => {
  const { search } = useLocation();

  return (newSearch?: Record<string, any>) => {
    // If no new search params, return existing ones
    if (!newSearch) {
      return search;
    }

    // Parse existing search params
    const existingParams = new URLSearchParams(
      typeof search === "string"
        ? search
        : new URLSearchParams(search).toString(),
    );
    const existingObj = Object.fromEntries(existingParams);

    // Merge with new params (new params override existing ones)
    return {
      ...existingObj,
      ...newSearch,
    };
  };
};
