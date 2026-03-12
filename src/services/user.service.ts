import { api } from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IResponse<T> {
  success: boolean;
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
