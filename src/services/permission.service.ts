import { api } from "@/lib/api";

interface IResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export const permissionService = {
  getAll: async (): Promise<IResponse<unknown[]>> => {
    return api.get("/permissions");
  },

  getGrouped: async (): Promise<IResponse<unknown>> => {
    return api.get("/permissions/grouped");
  },
};
