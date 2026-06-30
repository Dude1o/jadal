import type { WinningSide } from "../shared/enums";

export interface DebateResult {
  id: number;
  debate_id: number;
  judge_id: number;
  winning_side: WinningSide;
  scores: Record<string, unknown>;
  summary_notes: string | null;
  submitted_at: string;
}
