import { api } from "@/lib/api";

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const auditLogService = {
  getAll: async (): Promise<IResponse<any[]>> => {
    return api.get("/audit-logs");
  },

  getByUserId: async (userId: number): Promise<IResponse<any[]>> => {
    return api.get(`/audit-logs/user/${userId}`);
  },
};
