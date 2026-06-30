import { http } from "./http";

export interface BlogActionResponse {
  id: number;
  status: "pending_review" | "published" | "rejected";
  reviewer_comment?: string; // ← Added field
  updated_at: string;
  [key: string]: any;
}

export const approveRejectBlogApi = {
  action: async (
    id: number,
    type: "approve" | "reject",
    reviewer_comment?: string, // ← New optional parameter
  ): Promise<BlogActionResponse> => {
    const payload = type === "reject" ? { reviewer_comment } : {};
    const { data } = await http.patch(
      `/admin/blog/${id}/${type}`,
      payload, // ← Send comment in payload for rejection
    );
    return data.data;
  },
};
