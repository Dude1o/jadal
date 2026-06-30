import type { PhaseStatus } from "../shared/enums";

export interface DebatePhase {
  id: number;
  debate_id: number;
  name: string;
  order_index: number;
  duration_seconds: number;
  status: PhaseStatus;
  started_at: string | null;
  ended_at: string | null;
}
