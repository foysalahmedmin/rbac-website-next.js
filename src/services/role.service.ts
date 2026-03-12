import { api } from "@/lib/api";

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const roleService = {
  getAll: async (): Promise<IResponse<any[]>> => {
    return api.get("/roles");
  },

  getById: async (id: number): Promise<IResponse<any>> => {
    return api.get(`/roles/${id}`);
  },

  create: async (data: any): Promise<IResponse<any>> => {
    return api.post("/roles", data);
  },

  update: async (id: number, data: any): Promise<IResponse<any>> => {
    return api.patch(`/roles/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<any>> => {
    return api.delete(`/roles/${id}`);
  },

  assignPermissions: async (
    roleId: number,
    permissionIds: number[],
  ): Promise<IResponse<any>> => {
    return api.post(`/roles/assign-permissions`, {
      role_id: roleId,
      permission_ids: permissionIds,
    });
  },
};
