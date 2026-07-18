import { http } from "./http";
import type { DebateRegistrations } from "@/types";

export const debateRegistrationsApi = {
  getByDebateId: async (debateId: number): Promise<DebateRegistrations> => {
    const { data } = await http.get(
      `/debates/${debateId}/registrations`,
    );
    return data.data;
  },
};
