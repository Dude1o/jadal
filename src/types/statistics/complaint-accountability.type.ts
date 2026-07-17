import type { ComplaintStatusBreakdown, TargetRole } from "../shared/enums";

export interface ComplaintAccountabilityEntry {
  user_id: number;
  name: string;
  target_role: TargetRole;
  complaints_total: number;
  debates_involved: number;
  complaints_per_100_debates: number;
  status_breakdown: ComplaintStatusBreakdown;
  avg_time_to_last_update_hours_approx: number | null;
}

export interface ComplaintAccountability {
  stat: string;
  unattributed_total: number;
  entries: ComplaintAccountabilityEntry[];
}
