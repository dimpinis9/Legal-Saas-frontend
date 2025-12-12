export type DeadlineType = "COURT_HEARING" | "FILING" | "INTERNAL" | "OTHER";

export interface Deadline {
  id: number;
  caseFileId: number;
  title: string;
  dueDate: string; // ISO
  type: DeadlineType;
  completed: boolean;
}

export type NewDeadlinePayload = Omit<Deadline, "id" | "completed"> & {
  completed?: boolean;
};
export type UpdateDeadlinePayload = Partial<Omit<Deadline, "id">>;
