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
}

export interface QueryLike<T> {
  data?: T;
  isLoading: boolean;
  isError: boolean;
}
