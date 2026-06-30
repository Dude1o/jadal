export type UserRole = "debater" | "trainer" | "judge" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export type TeamStatus = "active" | "inactive";
export type TeamMemberStatus = "current" | "past";

export type DebateStatus =
  | "scheduled"
  | "announced"
  | "teams-selected"
  | "live"
  | "completed"
  | "cancelled";

export type ParticipantRole = "debater" | "trainer" | "judge" | "viewer";
export type ParticipantSide =
  | "proposition"
  | "opposition"
  | "judge"
  | "trainer"
  | "viewer";
export type ParticipantStatus = "pending" | "approved" | "rejected";

export type PhaseStatus = "pending" | "active" | "completed";
export type WinningSide = "proposition" | "opposition" | "draw";

export type FeedbackType =
  | "judge_to_debater"
  | "trainer_to_debater"
  | "debater_on_session";

export type ComplaintStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "dismissed";

export type BlogPostStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected";

export type SurveyQuestionType = "mcq" | "rating" | "open_text";
