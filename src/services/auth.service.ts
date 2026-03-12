import { api } from "@/lib/api";
import { ILoginResponse } from "@/types/auth.type";

export const authService = {
  login: async (data: any): Promise<ILoginResponse> => {
    return api.post("/auth/signin", data);
  },

  register: async (data: any): Promise<ILoginResponse> => {
    return api.post("/auth/signup", data);
  },

  refreshToken: async (): Promise<any> => {
    return api.post("/auth/refresh-token");
  },

  logout: async () => {
    // Usually a post to clear cookie or just client-side clear
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },
};
