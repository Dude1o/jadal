import type { User } from "../user/user.type";
import type { Team } from "../team/team.type";

export interface RegisteredTeam {
  id: number;
  team: Pick<Team, "id" | "name">;
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
