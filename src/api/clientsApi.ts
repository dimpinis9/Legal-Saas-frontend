import { apiClient } from "./apiClient";
import type {
  Client,
  NewClientPayload,
  UpdateClientPayload,
} from "../types/client.ts";

export const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    const { data } = await apiClient.get<Client[]>("/clients");
    return data;
  },
  getClient: async (id: number): Promise<Client> => {
    const { data } = await apiClient.get<Client>(`/clients/${id}`);
    return data;
  },
  createClient: async (payload: NewClientPayload): Promise<Client> => {
    const { data } = await apiClient.post<Client>("/clients", payload);
    return data;
  },
  updateClient: async (
    id: number,
    payload: UpdateClientPayload
  ): Promise<Client> => {
    const { data } = await apiClient.put<Client>(`/clients/${id}`, payload);
    return data;
  },
};

