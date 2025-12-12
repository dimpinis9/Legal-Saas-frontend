import { QueryClient, QueryClientConfig } from "@tanstack/react-query";
import type { ApiError } from "../api/httpClient.ts";

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Cache time: Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Retry configuration
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        // Don't retry on 4xx errors (client errors)
        if (
          apiError.status &&
          apiError.status >= 400 &&
          apiError.status < 500
        ) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus in development
      refetchOnWindowFocus: import.meta.env.PROD,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: 1,
    },
  },
};

export const queryClient = new QueryClient(queryConfig);

// Optional: Query error handler
export const onQueryError = (error: Error): void => {
  const apiError = error as ApiError;
  console.error("Query error:", {
    message: apiError.message,
    status: apiError.status,
    data: apiError.data,
  });

  // Could integrate with toast notifications here
  // toast.error(apiError.message);
};
