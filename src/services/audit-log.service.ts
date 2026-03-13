import { api } from "@/lib/api";
import { IAuditLog } from "@/types/audit-log.type";

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

export const auditLogService = {
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<IAuditLog[]>> => {
    return api.get("/audit-logs", { params });
  },

  getMyLogs: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<IAuditLog[]>> => {
    return api.get("/audit-logs/me", { params });
  },
};
