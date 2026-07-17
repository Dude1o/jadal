export type NewUsersByRole = {
  debater: number;
  trainer: number;
  judge: number;
  admin: number;
};

export type CancellationBreakdown = Partial<{
  no_participants_at_motion_reveal: number;
  no_judge_at_scheduled: number;
  manual: number;
  unspecified: number;
}>;

export interface PlatformHealthByFormat {
  format_id: number;
  format_name: string;
  debates_created: number;
  debates_completed: number;
  debates_cancelled: number;
}

export interface PlatformHealthBucket {
  label: string; // e.g. "2026-06" or "all"
  new_users: NewUsersByRole;
  debates_created: number;
  debates_completed: number;
  debates_cancelled: number;
  cancellation_breakdown: CancellationBreakdown;
  completion_rate: number | null; // can exceed 1, don't clamp
  avg_debates_per_active_debater: number | null;
  by_format?: PlatformHealthByFormat[]; // present when series = debate_format
  by_role?: NewUsersByRole; // present when series = role (mirrors new_users)
}

export interface PlatformHealth {
  stat: string;
  series: "none" | "role" | "debate_format";
  buckets: PlatformHealthBucket[];
}
