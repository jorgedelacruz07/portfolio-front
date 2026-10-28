import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "../../lib/api";
import type { TGithubStats } from "../../types/github";

export const githubKeys = {
  stats: ["github", "stats"] as const,
};

/** Recover incomplete activity without requiring the visitor to reload the page. */
export const useGithubStats = () => {
  return useQuery({
    queryKey: githubKeys.stats,
    queryFn: async (): Promise<TGithubStats> => {
      try {
        return await api.getGithubStats();
      } catch (error) {
        throw handleApiError(error);
      }
    },
    staleTime: (query) => (query.state.data?.contributions && query.state.data.calendar ? 30 * 60 * 1000 : 0),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: (query) => (query.state.data?.contributions && query.state.data.calendar ? false : 60_000),
    retry: 1,
  });
};
