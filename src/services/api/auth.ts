import { http } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number | string;
    email: string;
    name?: string;
  };
}

export interface LogoutPayload {
  token: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await http.post("/auth/login", payload);
    return data.data;
  },

  logout: async (payload: LogoutPayload): Promise<void> => {
    await http.post("/auth/logout", payload);
  },
};
