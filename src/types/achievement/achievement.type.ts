export type AchievementType =
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "HONORABLE"
  | "PARTICIPATION";

export const ACHIEVEMENT_TYPES: {
  value: AchievementType;
  label: string;
}[] = [
  { value: "GOLD", label: "achievements.types.gold" },
  { value: "SILVER", label: "achievements.types.silver" },
  { value: "BRONZE", label: "achievements.types.bronze" },
  { value: "HONORABLE", label: "achievements.types.honorable" },
  { value: "PARTICIPATION", label: "achievements.types.participation" },
];

export interface AchievementCatalog {
  id: number;
  name: string;
  type: AchievementType;
  image_url: string | null;
  assigned_count: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementAssignment {
  id: number;
  user_id: number;
  achievement: AchievementCatalog;
  assigned_at: string;
  assigned_by: {
    id: number;
    name: string;
    role: string;
    avatar_url: string | null;
    points: number;
    created_at: string;
  } | null;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  name: string;
  rank: string;
  image_url: string | null;
  awarded_at: string;
}
