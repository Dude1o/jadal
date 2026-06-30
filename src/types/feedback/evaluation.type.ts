export interface Evaluation {
  id: number;
  trainer_id: number;
  debater_id: number;
  debate_id: number | null;
  notes: string;
  scores: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
