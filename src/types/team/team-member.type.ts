import type { TeamMemberStatus } from "../shared/enums";
import type { User } from "../user/user.type";

export interface TeamMember {
  id: number;
  team_id: number;
  user: User;
  user_id: number;
  priority: number;
  status: TeamMemberStatus;
  created_at: string | null;
  updated_at: string | null;
}
