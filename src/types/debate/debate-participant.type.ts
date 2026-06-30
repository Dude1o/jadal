import type {
  ParticipantRole,
  ParticipantSide,
  ParticipantStatus,
} from "../shared/enums";

export interface DebateParticipant {
  id: number;
  debate_id: number;
  user_id: number;
  team_id: number | null;
  role: ParticipantRole;
  side: ParticipantSide | null;
  status: ParticipantStatus;
  is_chair: boolean;
  is_attended: boolean;
  speaking_phase_order: number | null;
  created_at: string;
  updated_at: string;
}
