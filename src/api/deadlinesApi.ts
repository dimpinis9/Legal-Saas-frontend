import { apiClient } from "./apiClient";
import type {
  Deadline,
  NewDeadlinePayload,
  UpdateDeadlinePayload,
  DeadlineType,
} from "../types/deadline.ts";

export interface DeadlineFilters {
  caseFileId?: number;
  fromDate?: string; // ISO
  toDate?: string; // ISO
  completed?: boolean;
  type?: DeadlineType;
  nextDays?: number; // convenience for dashboard
}

export const deadlinesApi = {
  getDeadlines: async (filters?: DeadlineFilters): Promise<Deadline[]> => {
    const params = filters || {};
    const { data } = await apiClient.get<Deadline[]>("/deadlines", { params });
    return data;
  },
  createDeadline: async (payload: NewDeadlinePayload): Promise<Deadline> => {
    const { data } = await apiClient.post<Deadline>("/deadlines", payload);
    return data;
  },
  updateDeadline: async (
    id: number,
    payload: UpdateDeadlinePayload
  ): Promise<Deadline> => {
    const { data } = await apiClient.put<Deadline>(
      `/deadlines/${id}`,
      payload
    );
    return data;
  },
  completeDeadline: async (id: number): Promise<Deadline> => {
    const { data } = await apiClient.post<Deadline>(
      `/deadlines/${id}/complete`,
      {}
    );
    return data;
  },
};

