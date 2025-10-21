import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "../../lib/api";
import { TProject } from "../../types/project";

// Query keys
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (slug: string) => [...projectKeys.details(), slug] as const,
};

// Hook for fetching all projects
export const useGetProjects = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async (): Promise<TProject[]> => {
      try {
        return await api.getProjects();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};

// Hook for fetching a single project by slug
export const useGetProjectBySlug = (slug: string | string[] | undefined) => {
  const projectSlug = Array.isArray(slug) ? slug[0] : slug;

  return useQuery({
    queryKey: projectKeys.detail(projectSlug || ""),
    queryFn: async (): Promise<TProject> => {
      if (!projectSlug) {
        throw new Error("Project slug is required");
      }
      try {
        return await api.getProjectBySlug(projectSlug);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: !!projectSlug,
  });
};
