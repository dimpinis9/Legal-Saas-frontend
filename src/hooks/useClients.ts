import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { clientsApi } from "../api/clientsApi.ts";
import { queryKeys } from "../api/queryKeys.ts";
import type {
  Client,
  NewClientPayload,
  UpdateClientPayload,
} from "../types/client.ts";
import type { ApiError } from "../api/httpClient.ts";

// Fetch all clients
export const useClients = () => {
  return useQuery({
    queryKey: queryKeys.clients.all(),
    queryFn: () => clientsApi.getClients(),
  });
};

// Fetch single client
export const useClient = (
  id: number,
  options?: Omit<UseQueryOptions<Client, ApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => clientsApi.getClient(id),
    enabled: !!id,
    ...options,
  });
};

// Create client mutation
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewClientPayload) => clientsApi.createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
    },
  });
};

// Update client mutation
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateClientPayload;
    }) => clientsApi.updateClient(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) });
    },
  });
};
