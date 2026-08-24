import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { projectKeys } from "./queries/useProjects";
import { experienceKeys } from "./queries/useExperiences";

/**
 * Consolidated hook for fetching all data needed by the home page.
 * Automatically seeds the TanStack Query cache for individual sub-collections
 * so navigation to /projects and /experiences is 0ms instant without extra network requests.
 *
 * @returns Object containing profile, skills, experiences, projects, loading state, and error state
 */
export const useHomePageData = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio", "public"],
    queryFn: async () => {
      try {
        const result = await api.getPortfolio();

        // Seed individual query caches for instant zero-latency page transitions
        if (result?.projects) {
          queryClient.setQueryData(projectKeys.lists(), result.projects);
        }
        if (result?.experiences) {
          queryClient.setQueryData(experienceKeys.lists(), result.experiences);
        }

        return result;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });

  return {
    profile: data?.profile,
    settings: data?.settings,
    skills: data?.skills ?? [],
    /** Featured experiences (first 3) */
    experiences: data?.experiences.slice(0, 3) ?? [],
    /** Featured projects (first 3) */
    projects: data?.projects.slice(0, 3) ?? [],
    /** Whether any data is still loading */
    isLoading,
    /** First error encountered, if any */
    error,
  };
};
