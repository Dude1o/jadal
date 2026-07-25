import type { TeamStatus } from "../shared/enums";
import type { TeamAdmin } from "./team-admin.type";
import { type TeamMember } from "./team-member.type";

export interface Team {
  id: number;
  name: string;
  is_random: boolean;
  leader: TeamAdmin;
  created_by: number;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
}
