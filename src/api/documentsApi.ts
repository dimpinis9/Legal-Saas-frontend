import { apiClient } from "./apiClient";
import type { Document, UpdateDocumentPayload } from "../types/document";

export const documentsApi = {
  getDocuments: async (params?: {
    caseFileId?: number;
  }): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>("/documents", { params });
    return response.data;
  },

  getDocument: async (id: number): Promise<Document> => {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  uploadDocument: async (formData: FormData): Promise<Document> => {
    const response = await apiClient.post<Document>(
      "/documents/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  updateDocument: async (
    id: number,
    payload: UpdateDocumentPayload
  ): Promise<Document> => {
    const response = await apiClient.patch<Document>(
      `/documents/${id}`,
      payload
    );
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  downloadDocument: (id: number): string => {
    return `${import.meta.env.VITE_API_URL}/documents/${id}/download`;
  },
};

