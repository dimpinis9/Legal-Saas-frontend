import { apiClient } from "./apiClient";
import type { Activity } from "../types/activity";

export const activitiesApi = {
  getActivities: async (params?: {
    caseFileId?: number;
    limit?: number;
  }): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>("/activities", {
      params,
    });
    return response.data;
  },
};

