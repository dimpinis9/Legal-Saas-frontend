export type ActivityType =
  | "CASE_CREATED"
  | "CASE_UPDATED"
  | "DEADLINE_ADDED"
  | "DEADLINE_COMPLETED"
  | "TASK_ADDED"
  | "TASK_COMPLETED"
  | "DOCUMENT_UPLOADED"
  | "NOTE_ADDED"
  | "CLIENT_ASSIGNED";

export interface Activity {
  id: number;
  caseFileId: number;
  type: ActivityType;
  description: string;
  userId: number; // Who performed the action
  userName?: string; // For display
  createdAt: string; // ISO date
  metadata?: Record<string, unknown>; // Extra data (e.g., documentId, taskId)
}
