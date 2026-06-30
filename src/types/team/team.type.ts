import type { TeamStatus } from "../shared/enums";
import { type TeamMember } from "./team-member.type";

export interface Team {
  id: number;
  name: string;
  is_random: boolean;
  leader: TeamMember;
  created_by: number;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
}
