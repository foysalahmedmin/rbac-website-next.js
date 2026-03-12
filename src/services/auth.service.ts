import { api, setAccessToken } from "@/lib/api";
import { ILoginResponse, IRefreshTokenResponse } from "@/types/auth.type";

export const authService = {
  login: async (data: unknown): Promise<ILoginResponse> => {
    return api.post("/auth/signin", data);
  },

  register: async (data: unknown): Promise<ILoginResponse> => {
    return api.post("/auth/signup", data);
  },

  refreshToken: async (): Promise<IRefreshTokenResponse> => {
    return api.post("/auth/refresh-token");
  },

  logout: async () => {
    setAccessToken(null);
    localStorage.removeItem("user");
  },
};
