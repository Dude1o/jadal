import type { UserRole, UserStatus } from "../shared/enums";

export interface User {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  phone: string | null;
  points: number;
  lang: string;
  theme?: string;
  email_verified_at?: string | null;
  created_at?: string;
  livekit_token?: string | null;
  updated_at?: string;
}
