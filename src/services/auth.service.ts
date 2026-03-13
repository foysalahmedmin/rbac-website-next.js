import { api, setAccessToken } from "@/lib/api";
import { ILoginResponse, IRefreshTokenResponse } from "@/types/auth.type";

interface IResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

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

  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<IResponse<unknown>> => {
    return api.patch("/auth/change-password", data);
  },

  forgetPassword: async (data: {
    email: string;
  }): Promise<IResponse<unknown>> => {
    return api.post("/auth/forget-password", data);
  },

  resetPassword: async (
    data: { email: string; password: string },
    token: string,
  ): Promise<IResponse<unknown>> => {
    return api.patch("/auth/reset-password", data, {
      headers: { Authorization: token },
    });
  },

  logout: async () => {
    setAccessToken(null);
    localStorage.removeItem("user");
  },
};
