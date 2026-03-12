import { api } from "@/lib/api";
import { ILead } from "@/types/lead.type";

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

export const leadService = {
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<ILead[]>> => {
    return api.get("/leads", { params });
  },

  getById: async (id: number): Promise<IResponse<ILead>> => {
    return api.get(`/leads/${id}`);
  },

  create: async (data: Partial<ILead>): Promise<IResponse<ILead>> => {
    return api.post("/leads", data);
  },

  update: async (
    id: number,
    data: Partial<ILead>,
  ): Promise<IResponse<ILead>> => {
    return api.patch(`/leads/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<null>> => {
    return api.delete(`/leads/${id}`);
  },
};
