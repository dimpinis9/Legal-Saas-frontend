export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export type NewClientPayload = Omit<Client, "id">;
export type UpdateClientPayload = Partial<Omit<Client, "id">>;
