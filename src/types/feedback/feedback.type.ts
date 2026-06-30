import type { FeedbackType } from "../shared/enums";

export interface Feedback {
  id: number;
  debate_id: number;
  from_user_id: number;
  to_user_id: number | null;
  type: FeedbackType;
  content: string;
  scores: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
