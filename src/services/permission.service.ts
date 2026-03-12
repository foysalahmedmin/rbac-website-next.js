import { api } from "@/lib/api";

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const permissionService = {
  getAll: async (): Promise<IResponse<any[]>> => {
    return api.get("/permissions");
  },

  getGrouped: async (): Promise<IResponse<any>> => {
    return api.get("/permissions/grouped");
  },
};
