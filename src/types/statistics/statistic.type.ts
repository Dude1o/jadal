import type { LucideIcon } from "lucide-react";
import type { StatTrend, StatVariant } from "../shared/enums";

export interface Statistic {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: StatTrend;
  trendValue?: string;
  trendLabel?: string;
  icon: LucideIcon;
  variant?: StatVariant;
  description?: string;
  badge?: string;

  /** Historical points, rendered as a sparkline in the card. */
  series?: number[];
  /** Parts of a whole, rendered as a donut. Values are absolute, not %. */
  parts?: { label: string; value: number; color: string }[];
  /** Upper bound for the progress bar. Defaults to the section maximum. */
  max?: number;
}

export interface QueryLike<T> {
  data?: T;
  isLoading: boolean;
  isError: boolean;
}
