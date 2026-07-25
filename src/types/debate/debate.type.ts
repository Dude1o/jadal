import type {
  DebateStatus,
  ParticipantRole,
  ParticipantSide,
  ParticipantStatus,
} from "../shared/enums";
import type { User } from "../user/user.type";
import type { DebateFormat } from "./debate-format.type";
import type { DebatePhase } from "./debate-phase.type";
import type { DebateResult } from "./debate-result.type";
import type { Motion } from "./motion.type";

export interface Debate {
  id: number;
  title: string;
  tag: string;
  status: DebateStatus;
  livekit_room_name: string;
  format: DebateFormat;
  motion: Motion;
  scheduled_at: string;
  created_by: User;
  participants: {
    id: number;
    is_attended: boolean;
    is_chair: boolean;
    is_reply_speaker: boolean;
    role: null | ParticipantRole;
    side: ParticipantSide | null;
    speaking_phase_order: number | null;
    status: ParticipantStatus;
    team_id: number;
    user: User;
  }[];
  feedbacks: string[];
  result: DebateResult | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  description: string | null;
  recording_url: string | null;
  transcript: string | null;
  updated_at: string;
  phases: DebatePhase[];
}
