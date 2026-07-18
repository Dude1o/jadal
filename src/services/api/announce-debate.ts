import { http } from "./http";

export interface AnnouncePayload {
  judges: number[];
  teams: ({ team_id: number } | { user_ids: number[] })[];
}

export const announceDebateApi = {
  action: async (id: number, payload: AnnouncePayload) => {
    const { data } = await http.post(`/admin/debates/${id}/announce`, payload);
    return data.data;
  },
};
