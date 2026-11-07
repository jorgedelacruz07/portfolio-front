import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "../../lib/api";
import type { PublicArticle, PublicArticleSummary } from "../../types/article";

export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  details: () => [...articleKeys.all, "detail"] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
};

export const useGetArticles = () => {
  return useQuery({
    queryKey: articleKeys.lists(),
    queryFn: async (): Promise<PublicArticleSummary[]> => {
      try {
        return await api.getArticles();
      } catch (error) {
        throw handleApiError(error);
      }
    },
  });
};

export const useGetArticleBySlug = (slug: string | string[] | undefined) => {
  const articleSlug = Array.isArray(slug) ? slug[0] : slug;

  return useQuery({
    queryKey: articleKeys.detail(articleSlug || ""),
    queryFn: async (): Promise<PublicArticle | null> => {
      if (!articleSlug) {
        throw new Error("Article slug is required");
      }
      try {
        return await api.getArticleBySlug(articleSlug);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: !!articleSlug,
  });
};
