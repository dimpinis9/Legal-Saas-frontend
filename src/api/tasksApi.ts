import { apiClient } from "./apiClient";
import type {
  Task,
  NewTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
} from "../types/task.ts";

export interface TaskFilters {
  caseFileId?: number;
  status?: TaskStatus;
}

export const tasksApi = {
  getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = filters || {};
    const { data } = await apiClient.get<Task[]>("/tasks", { params });
    return data;
  },
  createTask: async (payload: NewTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>("/tasks", payload);
    return data;
  },
  updateTask: async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  },
  updateTaskStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}/status`, {
      status,
    });
    return data;
  },
};

