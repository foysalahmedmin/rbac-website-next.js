import { api } from "@/lib/api";
import { IReport } from "@/types/report.type";

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

export const reportService = {
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<IReport[]>> => {
    return api.get("/reports", { params });
  },

  getById: async (id: number): Promise<IResponse<IReport>> => {
    return api.get(`/reports/${id}`);
  },

  create: async (data: Partial<IReport>): Promise<IResponse<IReport>> => {
    return api.post("/reports", data);
  },

  update: async (
    id: number,
    data: Partial<IReport>,
  ): Promise<IResponse<IReport>> => {
    return api.patch(`/reports/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<null>> => {
    return api.delete(`/reports/${id}`);
  },
};
