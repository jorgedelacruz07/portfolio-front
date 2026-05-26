import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";

/**
 * Consolidated hook for fetching all data needed by the home page.
 * Handles loading and error states for CMS-backed homepage content.
 *
 * @returns Object containing profile, skills, experiences, projects, loading state, and error state
 */
export const useHomePageData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolio", "public"],
    queryFn: async () => {
      try {
        return await api.getPortfolio();
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
