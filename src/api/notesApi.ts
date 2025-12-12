import { apiClient } from "./apiClient";
import type { Note, NewNotePayload, UpdateNotePayload } from "../types/note";

export const notesApi = {
  getNotes: async (params?: { caseFileId?: number }): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>("/notes", { params });
    return response.data;
  },

  getNote: async (id: number): Promise<Note> => {
    const response = await apiClient.get<Note>(`/notes/${id}`);
    return response.data;
  },

  createNote: async (payload: NewNotePayload): Promise<Note> => {
    const response = await apiClient.post<Note>("/notes", payload);
    return response.data;
  },

  updateNote: async (id: number, payload: UpdateNotePayload): Promise<Note> => {
    const response = await apiClient.patch<Note>(`/notes/${id}`, payload);
    return response.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },

  searchByTag: async (tag: string): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>("/notes/search", {
      params: { tag },
    });
    return response.data;
  },
};

