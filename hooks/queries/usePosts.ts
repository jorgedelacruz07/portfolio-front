import { useQuery } from '@tanstack/react-query';
import { api, handleApiError } from '../../lib/api';
import { TPost } from '../../types/post';
import { TCategory } from '../../types/category';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

// Hook for fetching all posts
export const useGetPosts = () => {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: async (): Promise<TPost[]> => {
      try {
        return await api.getPosts();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};

// Hook for fetching a single post by slug
export const useGetPostBySlug = (slug: string | string[] | undefined) => {
  const postSlug = Array.isArray(slug) ? slug[0] : slug;
  
  return useQuery({
    queryKey: postKeys.detail(postSlug || ''),
    queryFn: async (): Promise<TPost> => {
      if (!postSlug) {
        throw new Error('Post slug is required');
      }
      try {
        return await api.getPostBySlug(postSlug);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: !!postSlug,
  });
};

// Hook for fetching categories
export const useGetCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async (): Promise<TCategory[]> => {
      try {
        return await api.getCategories();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};
