import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "../../lib/api";
import type { TGithubStats } from "../../types/github";

export const githubKeys = {
  stats: ["github", "stats"] as const,
};

/** Optional enrichment: a failure just hides the GitHub section, so it retries once and stays quiet. */
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
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
};
