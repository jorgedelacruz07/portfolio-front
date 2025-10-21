import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better performance
      gcTime: 30 * 60 * 1000, // 30 minutes - increased for better performance
      retry: 2, // Reduced retries for faster failure handling
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Disabled to reduce network requests
      refetchOnMount: false, // Disabled for static data
    },
  },
});
