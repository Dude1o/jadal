export interface ExportableStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  badge?: string;
  description?: string;
}

export interface ExcelStyleOptions {
  headerBgColor?: string; // e.g. "1F4E79"
  headerFontColor?: string; // e.g. "FFFFFF"
  headerFontSize?: number;
  headerFontName?: string;
  rowBgColor?: string; // e.g. "F2F2F2"
  altRowBgColor?: string; // e.g. "FFFFFF"
  cellFontColor?: string;
  cellFontSize?: number;
  cellFontName?: string;
  valueFontBold?: boolean;
  trendUpColor?: string; // e.g. "006600"
  trendDownColor?: string; // e.g. "CC0000"
  trendNeutralColor?: string; // e.g. "666666"
  badgeBgColor?: string;
  badgeFontColor?: string;
}

export interface ChartOptions {
  type?: "bar" | "line" | "pie" | "doughnut";
  title?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  colors?: string[]; // custom palette for datasets
}

export const TREND_COLORS: Record<string, string> = {
  up: "FF16A34A", // green-600
  down: "FFDC2626", // red-600
  neutral: "FF6B7280", // gray-500
};

export const TREND_BAR_COLORS: Record<string, string> = {
  up: "#16A34A",
  down: "#DC2626",
  neutral: "#6366F1",
};

export const EXPORT_TREND = {
  up: {
    text: "FF3F6B4E",
    accent: "FF5B8C72",
    rowFill: "FFF6FAF7",
    cardFill: "FFEFF6F1",
    chart: "#5B8C72",
  },
  down: {
    text: "FF8C4A4A",
    accent: "FFB15C5C",
    rowFill: "FFFDF6F6",
    cardFill: "FFFBEFEF",
    chart: "#B15C5C",
  },
  neutral: {
    text: "FF475569",
    accent: "FF94A3B8",
    rowFill: "FFFAFAFA",
    cardFill: "FFF1F5F9",
    chart: "#94A3B8",
  },
} as const;

export const NAVY = "FF1E293B";
export const SLATE_500 = "FF64748B";

export type UserRole = "debater" | "trainer" | "judge" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export type TeamStatus = "active" | "inactive";
export type TeamMemberStatus = "current" | "past";

export type DebateStatus =
  | "scheduled"
  | "announced"
  | "teams-selected"
  | "live"
  | "completed"
  | "cancelled";

export type ParticipantRole = "debater" | "trainer" | "judge" | "viewer";
export type ParticipantSide =
  | "proposition"
  | "opposition"
  | "judge"
  | "trainer"
  | "viewer";
export type ParticipantStatus = "pending" | "approved" | "rejected";

export type PhaseStatus = "pending" | "active" | "completed";
export type WinningSide = "proposition" | "opposition" | "draw";

export type FeedbackType =
  | "judge_to_debater"
  | "trainer_to_debater"
  | "debater_on_session";

export type ComplaintStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "dismissed";

export type BlogPostStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected";

export type SurveyQuestionType = "mcq" | "rating" | "open_text";

export type LeaderboardBoard =
  | "most_improved"
  | "win_rate"
  | "avg_score"
  | "most_active";

export type ImprovementBand =
  | "strong_upward"
  | "improving"
  | "stable"
  | "regressing"
  | "sharp_decline";

export type ChurnRisk = "churn_risk" | "ramping_up" | "stable";

export type TargetRole = "debater" | "trainer" | "judge" | "chair";

export type ComplaintStatusBreakdown = Partial<Record<ComplaintStatus, number>>;

export type StatTrend = "up" | "down" | "neutral";

export type StatVariant =
  | "default"
  | "accent"
  | "destructive"
  | "success"
  | "warning";
