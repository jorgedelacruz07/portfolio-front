import { useQuery } from '@tanstack/react-query';
import { api, handleApiError } from '../../lib/api';
import { TExperience } from '../../types/experience';

// Query keys
export const experienceKeys = {
  all: ['experiences'] as const,
  lists: () => [...experienceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...experienceKeys.lists(), { filters }] as const,
  details: () => [...experienceKeys.all, 'detail'] as const,
  detail: (slug: string) => [...experienceKeys.details(), slug] as const,
};

// Hook for fetching all experiences
export const useGetExperiences = () => {
  return useQuery({
    queryKey: experienceKeys.lists(),
    queryFn: async (): Promise<TExperience[]> => {
      try {
        return await api.getExperiences();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};

// Hook for fetching a single experience by slug
export const useGetExperienceBySlug = (slug: string | string[] | undefined) => {
  const experienceSlug = Array.isArray(slug) ? slug[0] : slug;
  
  return useQuery({
    queryKey: experienceKeys.detail(experienceSlug || ''),
    queryFn: async (): Promise<TExperience> => {
      if (!experienceSlug) {
        throw new Error('Experience slug is required');
      }
      try {
        return await api.getExperienceBySlug(experienceSlug);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: !!experienceSlug,
  });
};
