import type { User, UserStatus } from "@/types";
import { http } from "./http";

export const changeUserStatusApi = {
  action: async (id: number, status: UserStatus): Promise<User> => {
    const { data } = await http.patch(`/admin/users/${id}/status`, {
      status,
    });
    return data.data;
  },
};
