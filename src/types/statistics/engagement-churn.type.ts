import type { ChurnRisk } from "../shared/enums";

export interface EngagementChurnEntry {
  user_id: number;
  name: string;
  risk: ChurnRisk;
  days_since_last_debate: number;
  recent_n_debates: number;
  baseline_n_debates: number;
}

export interface EngagementChurn {
  stat: string;
  generated_at: string; // ISO timestamp
  entries: EngagementChurnEntry[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}
