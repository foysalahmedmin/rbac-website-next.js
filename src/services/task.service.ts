import { api } from "@/lib/api";
import { ITask } from "@/types/task.type";

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

export const taskService = {
  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<IResponse<ITask[]>> => {
    return api.get("/tasks", { params });
  },

  getById: async (id: number): Promise<IResponse<ITask>> => {
    return api.get(`/tasks/${id}`);
  },

  create: async (data: Partial<ITask>): Promise<IResponse<ITask>> => {
    return api.post("/tasks", data);
  },

  update: async (
    id: number,
    data: Partial<ITask>,
  ): Promise<IResponse<ITask>> => {
    return api.patch(`/tasks/${id}`, data);
  },

  delete: async (id: number): Promise<IResponse<null>> => {
    return api.delete(`/tasks/${id}`);
  },
};
