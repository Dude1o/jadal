import type { ParticipantRole, UserStatus } from "../shared/enums";

export interface TeamAdmin {
  age: number;
  avatar_url: string;
  birth_date: string;
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  lang: string | null;
  location: string | null;
  name: string;
  phone: string | null;
  points: number;
  role: ParticipantRole;
  status: UserStatus;
  theme: null;
}
