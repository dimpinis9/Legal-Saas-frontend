export type DocumentCategory =
  | "PETITION" // Αίτηση/Αγωγή
  | "DECISION" // Απόφαση
  | "CONTRACT" // Συμβόλαιο
  | "EVIDENCE" // Αποδεικτικό
  | "CORRESPONDENCE" // Αλληλογραφία
  | "OTHER";

export interface Document {
  id: number;
  caseFileId: number;
  fileName: string;
  fileSize: number; // bytes
  fileType: string; // MIME type
  category: DocumentCategory;
  uploadedAt: string; // ISO date
  uploadedBy: number; // userId
  notes?: string;
  url: string; // Download/preview URL
}

export type NewDocumentPayload = Omit<Document, "id" | "uploadedAt" | "url">;
export type UpdateDocumentPayload = Partial<
  Pick<Document, "category" | "notes">
>;
