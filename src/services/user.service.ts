import { api } from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export const userService = {
  getMe: async (): Promise<IResponse<IUser>> => {
    return api.get("/users/me");
  },

  updateMe: async (data: unknown): Promise<IResponse<IUser>> => {
    return api.patch("/users/me", data);
  },

  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<IUser[]>> => {
    return api.get("/users", { params });
  },

  getById: async (id: number): Promise<IResponse<IUser>> => {
    return api.get(`/users/${id}`);
  },

  update: async (id: number, data: unknown): Promise<IResponse<IUser>> => {
    return api.patch(`/users/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<IUser>> => {
    return api.delete(`/users/${id}`);
  },

  permanentDelete: async (id: number): Promise<IResponse<IUser>> => {
    return api.delete(`/users/${id}/permanent`);
  },

  restore: async (id: number): Promise<IResponse<IUser>> => {
    return api.patch(`/users/${id}/restore`);
  },

  suspend: async (id: number): Promise<IResponse<IUser>> => {
    return api.patch(`/users/${id}/suspend`);
  },

  ban: async (id: number): Promise<IResponse<IUser>> => {
    return api.patch(`/users/${id}/ban`);
  },

  assignPermissions: async (
    userId: number,
    permissionIds: number[],
  ): Promise<IResponse<IUser>> => {
    return api.post(`/users/assign-permissions`, {
      user_id: userId,
      permission_ids: permissionIds,
    });
  },
};
