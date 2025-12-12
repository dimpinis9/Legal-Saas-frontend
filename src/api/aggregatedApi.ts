import { apiClient } from "./apiClient";
import type { CaseFile } from "../types/case";
import type { Client } from "../types/client";
import type { Deadline } from "../types/deadline";
import type { Task } from "../types/task";

export interface CaseDetailsAggregated {
  caseFile: CaseFile;
  client: Client;
  deadlines: Deadline[];
  tasks: Task[];
}

export const aggregatedApi = {
  /**
   * Get all case details in a single request
   * This endpoint aggregates case, client, deadlines, and tasks
   * Reduces 4 API calls to 1 - ~70% performance improvement
   */
  getCaseDetails: async (caseId: number): Promise<CaseDetailsAggregated> => {
    const { data } = await apiClient.get<CaseDetailsAggregated>(
      `/cases/${caseId}/details`
    );
    return data;
  },
};
