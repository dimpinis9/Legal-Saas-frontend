import { apiClient } from "./apiClient";
import type {
  CaseFile,
  NewCasePayload,
  UpdateCasePayload,
  CaseStatus,
} from "../types/case.ts";

export interface CaseFilters {
  status?: CaseStatus;
  clientId?: number;
}

export const casesApi = {
  getCases: async (filters?: CaseFilters): Promise<CaseFile[]> => {
    const params = filters || {};
    const { data } = await apiClient.get<CaseFile[]>("/cases", { params });
    return data;
  },
  getCase: async (id: number): Promise<CaseFile> => {
    const { data } = await apiClient.get<CaseFile>(`/cases/${id}`);
    return data;
  },
  createCase: async (payload: NewCasePayload): Promise<CaseFile> => {
    const { data } = await apiClient.post<CaseFile>("/cases", payload);
    return data;
  },
  updateCase: async (
    id: number,
    payload: UpdateCasePayload
  ): Promise<CaseFile> => {
    const { data } = await apiClient.put<CaseFile>(`/cases/${id}`, payload);
    return data;
  },
};

