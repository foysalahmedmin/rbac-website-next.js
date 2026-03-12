import { api } from "@/lib/api";
import { IUser } from "@/types/user.type";

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const userService = {
  getAll: async (): Promise<IResponse<IUser[]>> => {
    return api.get("/users");
  },

  getById: async (id: number): Promise<IResponse<IUser>> => {
    return api.get(`/users/${id}`);
  },

  update: async (id: number, data: any): Promise<IResponse<IUser>> => {
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
  ): Promise<IResponse<any>> => {
    return api.post(`/users/assign-permissions`, {
      user_id: userId,
      permission_ids: permissionIds,
    });
  },
};
