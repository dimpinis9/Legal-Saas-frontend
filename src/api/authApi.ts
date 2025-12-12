import { apiClient } from "./apiClient";
import type { AuthCredentials, AuthResponse } from "../types/auth.ts";

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return data;
  },
};

