export type CaseStatus = "OPEN" | "PENDING_HEARING" | "UNDER_APPEAL" | "CLOSED";

export interface CaseFile {
  id: number;
  title: string;
  caseNumber: string;
  status: CaseStatus;
  clientId: number; // Primary client (backwards compatible)
  clientIds?: number[]; // Multiple clients (new feature)
  court?: string;
  firstHearingDate?: string; // ISO yyyy-MM-dd
}

export type NewCasePayload = Omit<CaseFile, "id">;
export type UpdateCasePayload = Partial<Omit<CaseFile, "id">>;
