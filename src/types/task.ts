export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  caseFileId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}

export type NewTaskPayload = Omit<Task, "id">;
export type UpdateTaskPayload = Partial<Omit<Task, "id">>;
