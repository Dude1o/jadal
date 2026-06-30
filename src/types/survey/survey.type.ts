import type { SurveyQuestionType, UserRole } from "../shared/enums";
import type { User } from "../user/user.type";

export interface Survey {
  id: number;
  title: string;
  description: string | null;
  target_roles: UserRole[];
  closes_at: string | null;
  is_closed: boolean;
  created_by: User;
  already_responded: boolean;
  questions?: SurveyQuestion[];
  created_at: string;
}

export interface SurveyQuestion {
  id: number;
  survey_id: number;
  question_text: string;
  type: SurveyQuestionType;
  options: string[] | null;
  order_index: number;
}

export interface SurveyResponse {
  id: number;
  survey_id: number;
  user_id: number;
  answers: Record<string, unknown>;
  created_at: string | null;
}
