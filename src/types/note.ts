export interface Note {
  id: number;
  caseFileId: number;
  content: string;
  tags: string[]; // e.g., ["Δικάσιμος", "Συμβόλαιο", "Ευρώπη"]
  createdBy: number; // userId
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
}

export type NewNotePayload = Omit<Note, "id" | "createdAt" | "updatedAt">;
export type UpdateNotePayload = Partial<Pick<Note, "content" | "tags">>;
