import type { ComplaintStatus } from "../shared/enums";
import type { User } from "../user/user.type";

export interface Complaint {
  id: number;
  filed_by: User;
  debate_id: number | null;
  description: string;
  status: ComplaintStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}
