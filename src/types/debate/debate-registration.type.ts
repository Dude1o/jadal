import type { User } from "../user/user.type";
import type { Team } from "../team/team.type";

export interface DebateRegistrations {
  teams: {
    team: Pick<Team, "id" | "name">;
    members_count: number;
    registered_at: string;
  }[];
  judges: {
    user: Pick<User, "id" | "name" | "avatar_url">;
    registered_at: string;
  }[];
  solo: {
    user: Pick<User, "id" | "name">;
    registered_at: string;
  }[];
}
