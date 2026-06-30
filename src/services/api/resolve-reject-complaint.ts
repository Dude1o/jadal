import type { ComplaintStatus } from "@/types";
import { http } from "./http";

export interface ComplaintActionResponse {
  id: number;
  status: ComplaintStatus;
  admin_response?: string; // ← Added field
  updated_at: string;
}

export const approveRejectComplaintApi = {
  action: async (
    id: number,
    type: "resolved" | "dismissed",
    admin_response?: string, // ← New optional parameter
  ): Promise<ComplaintActionResponse> => {
    const payload = {
      status: type,
      admin_response: admin_response ?? "",
    };
    const { data } = await http.patch(
      `/admin/complaints/${id}`,
      payload, // ← Send comment in payload for rejection
    );
    return data.data;
  },
};
