export type NotificationType =
  | "DEADLINE_REMINDER" // Υπενθύμιση προθεσμίας
  | "HEARING_REMINDER" // Υπενθύμιση δικασίμου
  | "TASK_ASSIGNED" // Ανάθεση task
  | "DOCUMENT_UPLOADED" // Νέο έγγραφο
  | "CASE_UPDATE" // Ενημέρωση υπόθεσης
  | "SYSTEM";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedCaseId?: number;
  relatedDeadlineId?: number;
  isRead: boolean;
  createdAt: string; // ISO date
}

export type MarkAsReadPayload = {
  notificationIds: number[];
};
