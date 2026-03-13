import { api } from "@/lib/api";
import { IRole } from "@/types/role.type";

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

export const roleService = {
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<IRole[]>> => {
    return api.get("/roles", { params });
  },

  getById: async (id: number): Promise<IResponse<IRole>> => {
    return api.get(`/roles/${id}`);
  },

  create: async (data: Partial<IRole>): Promise<IResponse<IRole>> => {
    return api.post("/roles", data);
  },

  update: async (
    id: number,
    data: Partial<IRole>,
  ): Promise<IResponse<IRole>> => {
    return api.patch(`/roles/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<{ id: number }>> => {
    return api.delete(`/roles/${id}`);
  },

  assignPermissions: async (
    roleId: number,
    permissionIds: number[],
  ): Promise<IResponse<IRole>> => {
    return api.post(`/roles/assign-permissions`, {
      role_id: roleId,
      permission_ids: permissionIds,
    });
  },
};
