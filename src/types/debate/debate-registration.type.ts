import type { User } from "../user/user.type";
import type { Team } from "../team/team.type";
import type { TeamMember } from "../team/team-member.type";

export interface RegisteredTeam {
  id: number;
  team: Pick<Team, "id" | "name"> & {
    members?: TeamMember[];
  };
}

export interface RegisteredJudge {
  id: number;
  user: Pick<User, "id" | "name" | "avatar_url">;
}

export interface DebateRegistrations {
  teams: RegisteredTeam[];
  judges: RegisteredJudge[];
  solo_applicants: { id: number; user: Pick<User, "id" | "name"> }[];
}
