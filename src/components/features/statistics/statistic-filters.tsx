import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { ToolbarFilters, type ToolbarFilter } from "@/components/layout/toolbar/toolbar-filter";
import { debateFormatsQueryOptions } from "@/api/query-options";
import type { DebateFormat } from "@/types";

function formatOptions(t: ReturnType<typeof useTranslation>["t"], prefix: string, map: Record<string, string>): { label: string; value: string }[] {
  return Object.entries(map).map(([value]) => ({
    label: getTranslation(t, `${prefix}.${value}` as any),
    value,
  }));
}

interface FilterBarProps {
  defs: ToolbarFilter[];
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

function FilterBar({ defs, onFilterChange, onResetFilters }: FilterBarProps) {
  if (defs.length === 0) return null;
  return (
    <div className="mb-6">
      <ToolbarFilters
        filters={defs}
        onChange={onFilterChange}
        onReset={onResetFilters}
      />
    </div>
  );
}

/* ── Framework Fairness ─────────────────────────────────── */

export interface FrameworkFairnessFilterValues {
  ff_min_n_debates?: string;
  ff_from?: string;
  ff_to?: string;
  ff_formats?: string;
}

interface FFProps {
  values: FrameworkFairnessFilterValues;
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

export function FrameworkFairnessFilters({ values, onFilterChange, onResetFilters }: FFProps) {
  const { t } = useTranslation();
  const defs: ToolbarFilter[] = [
    {
      id: "ff_min_n_debates",
      label: getTranslation(t, "statistics.filters.minDebates"),
      value: values.ff_min_n_debates,
      options: [
        { label: "5", value: "5" },
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
      ],
    },
    {
      id: "ff_formats",
      label: getTranslation(t, "statistics.filters.formats"),
      value: values.ff_formats,
      options: debateFormatsQueryOptions as unknown as (() => any),
      getOptionLabel: (item: DebateFormat) => item.name,
      getOptionValue: (item: DebateFormat) => item.id,
    },
  ];
  return <FilterBar defs={defs} onFilterChange={onFilterChange} onResetFilters={onResetFilters} />;
}

/* ── Leaderboard ────────────────────────────────────────── */

export interface LeaderboardFilterValues {
  lb_board?: string;
  lb_limit?: string;
  lb_min_n_debates?: string;
  lb_from?: string;
  lb_to?: string;
  lb_formats?: string;
}

interface LBProps {
  values: LeaderboardFilterValues;
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

export function LeaderboardFilters({ values, onFilterChange, onResetFilters }: LBProps) {
  const { t } = useTranslation();
  const defs: ToolbarFilter[] = [
    {
      id: "lb_board",
      label: getTranslation(t, "statistics.filters.board"),
      value: values.lb_board,
      options: formatOptions(t, "statistics.filters.boardOptions", {
        most_improved: "",
        win_rate: "",
        avg_score: "",
        most_active: "",
      }),
    },
    {
      id: "lb_min_n_debates",
      label: getTranslation(t, "statistics.filters.minDebates"),
      value: values.lb_min_n_debates,
      options: [
        { label: "3", value: "3" },
        { label: "5", value: "5" },
        { label: "10", value: "10" },
        { label: "20", value: "20" },
      ],
    },
    {
      id: "lb_limit",
      label: getTranslation(t, "statistics.filters.limit"),
      value: values.lb_limit,
      options: [
        { label: "10", value: "10" },
        { label: "25", value: "25" },
        { label: "50", value: "50" },
      ],
    },
    {
      id: "lb_formats",
      label: getTranslation(t, "statistics.filters.formats"),
      value: values.lb_formats,
      options: debateFormatsQueryOptions as unknown as (() => any),
      getOptionLabel: (item: DebateFormat) => item.name,
      getOptionValue: (item: DebateFormat) => item.id,
    },
  ];
  return <FilterBar defs={defs} onFilterChange={onFilterChange} onResetFilters={onResetFilters} />;
}

/* ── Platform Health ────────────────────────────────────── */

export interface PlatformHealthFilterValues {
  ph_group_by?: string;
  ph_from?: string;
  ph_to?: string;
  ph_series?: string;
  ph_formats?: string;
}

interface PHProps {
  values: PlatformHealthFilterValues;
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

export function PlatformHealthFilters({ values, onFilterChange, onResetFilters }: PHProps) {
  const { t } = useTranslation();
  const defs: ToolbarFilter[] = [
    {
      id: "ph_group_by",
      label: getTranslation(t, "statistics.filters.groupBy"),
      value: values.ph_group_by,
      options: formatOptions(t, "statistics.filters.groupByOptions", {
        none: "",
        year: "",
        month: "",
      }),
    },
    {
      id: "ph_series",
      label: getTranslation(t, "statistics.filters.series"),
      value: values.ph_series,
      options: formatOptions(t, "statistics.filters.seriesOptions", {
        none: "",
        role: "",
        debate_format: "",
      }),
    },
    {
      id: "ph_formats",
      label: getTranslation(t, "statistics.filters.formats"),
      value: values.ph_formats,
      options: debateFormatsQueryOptions as unknown as (() => any),
      getOptionLabel: (item: DebateFormat) => item.name,
      getOptionValue: (item: DebateFormat) => item.id,
    },
  ];
  return <FilterBar defs={defs} onFilterChange={onFilterChange} onResetFilters={onResetFilters} />;
}

/* ── Engagement & Churn ─────────────────────────────────── */

export interface EngagementChurnFilterValues {
  ec_risk_filter?: string;
  ec_recent_window_days?: string;
  ec_baseline_window_days?: string;
  ec_churn_threshold_days?: string;
}

interface ECProps {
  values: EngagementChurnFilterValues;
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

export function EngagementChurnFilters({ values, onFilterChange, onResetFilters }: ECProps) {
  const { t } = useTranslation();
  const defs: ToolbarFilter[] = [
    {
      id: "ec_risk_filter",
      label: getTranslation(t, "statistics.filters.riskFilter"),
      value: values.ec_risk_filter,
      options: formatOptions(t, "statistics.filters.riskFilterOptions", {
        all: "",
        churn_risk: "",
        ramping_up: "",
      }),
    },
  ];
  return <FilterBar defs={defs} onFilterChange={onFilterChange} onResetFilters={onResetFilters} />;
}

/* ── Complaint Accountability ───────────────────────────── */

export interface ComplaintAccountabilityFilterValues {
  ca_min_debates_involved?: string;
  ca_target_role?: string;
  ca_status?: string;
  ca_from?: string;
  ca_to?: string;
  ca_formats?: string;
}

interface CAProps {
  values: ComplaintAccountabilityFilterValues;
  onFilterChange: (id: string, value: string) => void;
  onResetFilters: () => void;
}

export function ComplaintAccountabilityFilters({ values, onFilterChange, onResetFilters }: CAProps) {
  const { t } = useTranslation();
  const defs: ToolbarFilter[] = [
    {
      id: "ca_min_debates_involved",
      label: getTranslation(t, "statistics.filters.minDebates"),
      value: values.ca_min_debates_involved,
      options: [
        { label: "3", value: "3" },
        { label: "5", value: "5" },
        { label: "10", value: "10" },
        { label: "20", value: "20" },
      ],
    },
    {
      id: "ca_target_role",
      label: getTranslation(t, "statistics.filters.targetRole"),
      value: values.ca_target_role,
      options: formatOptions(t, "statistics.filters.targetRoleOptions", {
        debater: "",
        trainer: "",
        judge: "",
        chair: "",
      }),
    },
    {
      id: "ca_status",
      label: getTranslation(t, "statistics.filters.status"),
      value: values.ca_status,
      options: formatOptions(t, "statistics.filters.statusOptions", {
        open: "",
        under_review: "",
        resolved: "",
        dismissed: "",
      }),
    },
    {
      id: "ca_formats",
      label: getTranslation(t, "statistics.filters.formats"),
      value: values.ca_formats,
      options: debateFormatsQueryOptions as unknown as (() => any),
      getOptionLabel: (item: DebateFormat) => item.name,
      getOptionValue: (item: DebateFormat) => item.id,
    },
  ];
  return <FilterBar defs={defs} onFilterChange={onFilterChange} onResetFilters={onResetFilters} />;
}
