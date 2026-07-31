import i18n from "@/i18n";
import {
  EXPORT_TREND,
  NAVY,
  SLATE_500,
  TREND_BAR_COLORS,
  TREND_COLORS,
  type ExportableStat,
  type Framework,
  type ImprovementBand,
  type SideBarItem,
} from "@/types";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
  ExcelStyleOptions,
  ChartOptions,
  Leaderboard,
  PlatformHealth,
  StatTrend,
  Statistic,
} from "@/types";
import { debateRegistrationsQueryOptions } from "@/api/query-options";
import ExcelJS from "exceljs";
import { Chart, registerables, type ChartConfiguration } from "chart.js";

Chart.register(...registerables);

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

export function isDebateAnnouncable(debateId: number) {
  const { data: registrations } = useQuery(
    debateRegistrationsQueryOptions(debateId),
  );
  return (
    registrations?.judges?.length >= 1 &&
    ((registrations?.solo?.length >= 3 && registrations?.teams?.length >= 1) ||
      registrations?.teams?.length >= 2 ||
      registrations?.solo?.length >= 6)
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Chart.js → PNG helper
   ═══════════════════════════════════════════════════════════════════ */
export async function generateChartImage(
  stats: ExportableStat[],
  options: ChartOptions = {},
): Promise<string> {
  const {
    type = "bar",
    title = "Statistics Overview",
    width = 900,
    height = 480,
    backgroundColor = "#ffffff",
    colors = [
      "#4e79a7",
      "#f28e2b",
      "#e15759",
      "#76b7b2",
      "#59a14f",
      "#edc948",
      "#b07aa1",
      "#ff9da7",
    ],
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const labels = stats.map((s) => String(s.label ?? "").slice(0, 40));
  const data = stats.map((s) => {
    const v = s.value;
    return typeof v === "number" ? v : parseFloat(String(v)) || 0;
  });

  const config: ChartConfiguration = {
    type,
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: type === "line" ? colors[0] : colors,
          borderColor: type === "line" ? colors[0] : colors,
          borderWidth: 2,
          tension: 0.3,
          fill: type === "line" ? false : undefined,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 18, weight: "bold" },
          color: "#222",
        },
        legend: {
          display: type === "pie" || type === "doughnut",
        },
      },
      scales:
        type === "pie" || type === "doughnut"
          ? undefined
          : {
              y: {
                beginAtZero: true,
                ticks: { color: "#555" },
                grid: { color: "#eee" },
              },
              x: {
                ticks: { color: "#555", maxRotation: 45 },
                grid: { display: false },
              },
            },
    },
  };

  const chart = new Chart(ctx, config);
  // Give Chart.js a moment to finish painting
  await new Promise((r) => setTimeout(r, 80));
  const dataUrl = canvas.toDataURL("image/png");
  chart.destroy();
  return dataUrl;
}

/* ═══════════════════════════════════════════════════════════════════
   Excel export (ExcelJS) – FIXED ARGB colors
   ═══════════════════════════════════════════════════════════════════ */
const DEFAULT_STYLES: Required<ExcelStyleOptions> = {
  // IMPORTANT: ExcelJS expects 8-char ARGB (FF + 6-digit hex)
  headerBgColor: "FF1F4E79",
  headerFontColor: "FFFFFFFF",
  headerFontSize: 12,
  headerFontName: "Calibri",
  rowBgColor: "FFFFFFFF",
  altRowBgColor: "FFF5F7FA",
  cellFontColor: "FF333333",
  cellFontSize: 11,
  cellFontName: "Calibri",
  valueFontBold: true,
  trendUpColor: "FF006600",
  trendDownColor: "FFCC0000",
  trendNeutralColor: "FF666666",
  badgeBgColor: "FFE8F0FE",
  badgeFontColor: "FF1A73E8",
};

function toArgb(color: string): string {
  // Accept both "1F4E79" and "FF1F4E79"
  const c = color.replace(/^#/, "").toUpperCase();
  return c.length === 6 ? `FF${c}` : c;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function exportStatisticsToExcel(
  stats: ExportableStat[],
  fileName: string = "statistics.xlsx",
  styleOptions: ExcelStyleOptions = {},
  includeChart: boolean = true,
  chartOptions: ChartOptions = {},
): Promise<void> {
  if (!stats?.length) {
    console.warn("[exportStatisticsToExcel] No stats provided");
    return;
  }

  // Normalize any 6-digit colors the caller may pass
  const raw = { ...DEFAULT_STYLES, ...styleOptions };
  const styles: Required<ExcelStyleOptions> = {
    ...raw,
    headerBgColor: toArgb(raw.headerBgColor),
    headerFontColor: toArgb(raw.headerFontColor),
    rowBgColor: toArgb(raw.rowBgColor),
    altRowBgColor: toArgb(raw.altRowBgColor),
    cellFontColor: toArgb(raw.cellFontColor),
    trendUpColor: toArgb(raw.trendUpColor),
    trendDownColor: toArgb(raw.trendDownColor),
    trendNeutralColor: toArgb(raw.trendNeutralColor),
    badgeBgColor: toArgb(raw.badgeBgColor),
    badgeFontColor: toArgb(raw.badgeFontColor),
  };

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Statistics Export";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Statistics", {
    views: [{ showGridLines: false }],
  });

  // Columns that match the real data shape
  worksheet.columns = [
    { header: "Label", key: "label", width: 32 },
    { header: "Value", key: "value", width: 14 },
    { header: "Suffix", key: "suffix", width: 10 },
    { header: "Trend", key: "trend", width: 12 },
    { header: "Trend Value", key: "trendValue", width: 18 },
    { header: "Badge", key: "badge", width: 14 },
    { header: "Description", key: "description", width: 42 },
  ];

  // ── Header styling ──────────────────────────────────────────────
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: styles.headerBgColor },
    };
    cell.font = {
      name: styles.headerFontName,
      size: styles.headerFontSize,
      bold: true,
      color: { argb: styles.headerFontColor },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  // ── Data rows ───────────────────────────────────────────────────
  stats.forEach((stat, index) => {
    const isAlt = index % 2 === 1;
    const bgColor = isAlt ? styles.altRowBgColor : styles.rowBgColor;

    const numericValue =
      typeof stat.value === "number"
        ? stat.value
        : parseFloat(String(stat.value)) || 0;

    const row = worksheet.addRow({
      label: stat.label ?? "",
      value: numericValue,
      suffix: stat.suffix ?? "",
      trend: stat.trend ? capitalize(String(stat.trend)) : "",
      trendValue: stat.trendValue ?? "",
      badge: stat.badge ?? "",
      description: stat.description ?? "",
    });

    row.height = 22;

    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgColor },
      };
      cell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: styles.cellFontColor },
        bold: colNumber === 2 && styles.valueFontBold,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 2 || colNumber === 5 ? "right" : "left",
      };
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFDDDDDD" } },
      };

      // Format the pure number so Excel keeps it as a number
      if (colNumber === 2) {
        cell.numFmt = Number.isInteger(numericValue) ? "0" : "0.0";
      }
    });

    // Trend color
    if (stat.trend) {
      const trendCell = row.getCell(4);
      const color =
        stat.trend === "up"
          ? styles.trendUpColor
          : stat.trend === "down"
            ? styles.trendDownColor
            : styles.trendNeutralColor;

      trendCell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: color },
        bold: true,
      };
    }

    // Badge styling
    if (stat.badge) {
      const badgeCell = row.getCell(6);
      badgeCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: styles.badgeBgColor },
      };
      badgeCell.font = {
        name: styles.cellFontName,
        size: styles.cellFontSize,
        color: { argb: styles.badgeFontColor },
        bold: true,
      };
      badgeCell.alignment = { vertical: "middle", horizontal: "center" };
    }
  });

  // ── Optional Chart ─────────────────────────────────────────────
  if (includeChart && stats.length > 0) {
    try {
      const chartDataUrl = await generateChartImage(stats, {
        title: chartOptions.title ?? fileName.replace(/\.xlsx$/i, ""),
        ...chartOptions,
      });
      const base64 = chartDataUrl.split(",")[1];
      if (!base64) throw new Error("Empty chart base64");

      const imageId = workbook.addImage({
        base64,
        extension: "png",
      });

      const startRow = stats.length + 3;
      worksheet.addImage(imageId, {
        tl: { col: 0, row: startRow },
        ext: {
          width: chartOptions.width ?? 900,
          height: chartOptions.height ?? 480,
        },
      });
    } catch (err) {
      console.warn("[exportStatisticsToExcel] Chart generation failed:", err);
    }
  }

  // ── Download ───────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
}
