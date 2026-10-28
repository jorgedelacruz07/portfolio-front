import { queryOptions, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { projectKeys } from "./queries/useProjects";
import { experienceKeys } from "./queries/useExperiences";

/**
 * Single request for the whole public site. It also seeds the per-collection caches so the
 * /projects and /experiences pages open without another network round trip.
 */
export const portfolioQuery = (queryClient: QueryClient) =>
  queryOptions({
    queryKey: ["portfolio", "public"],
    queryFn: async () => {
      try {
        const result = await api.getPortfolio();

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

/** Data for the home page: profile, skills and the first three experiences and projects. */
export const useHomePageData = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery(portfolioQuery(queryClient));

  return {
    profile: data?.profile,
    settings: data?.settings,
    skills: data?.skills ?? [],
    experiences: data?.experiences.slice(0, 3) ?? [],
    projects: data?.projects.slice(0, 3) ?? [],
    isLoading,
    error,
    refetch,
  };
};
