import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

import type { TCategory } from "../types/category";
import type { TExperience } from "../types/experience";
import type { TGithubStats } from "../types/github";
import type { ApiError } from "../types/error";
import type { TPortfolioContent } from "../types/portfolio";
import type { TProject } from "../types/project";
import type { PublicArticle, PublicArticleSummary } from "../types/article";
import { PRODUCTION_API_URL, resolveApiBaseUrl } from "./api-url.ts";

export { PRODUCTION_API_URL, resolveApiBaseUrl };

const API_BASE_URL = resolveApiBaseUrl(import.meta.env?.VITE_API_URL);
export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  // Cloud Run scales to zero; a cold start plus the Atlas handshake can take well over 10s.
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Defense-in-depth: Ensure no request to localhost leaves a non-local browser
    if (typeof window !== "undefined") {
      const isLocalBrowser =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".local");

      if (!isLocalBrowser) {
        if (!config.baseURL || config.baseURL.includes("localhost") || config.baseURL.includes("127.0.0.1")) {
          config.baseURL = PRODUCTION_API_URL;
        }
        if (config.url && (config.url.startsWith("http://localhost") || config.url.startsWith("http://127.0.0.1"))) {
          try {
            const parsed = new URL(config.url);
            config.url = `${PRODUCTION_API_URL}${parsed.pathname}${parsed.search}`;
          } catch {
            config.url = PRODUCTION_API_URL;
          }
        }
      }
    }

    if (import.meta.env?.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
    };

    console.error("[API Response Error]", errorInfo);
    return Promise.reject(error);
  },
);

export const apiEndpoints = {
  portfolio: () => "/client/portfolio",
  projects: () => "/client/projects",
  projectBySlug: (slug: string) => `/client/projects/${slug}`,
  experiences: () => "/client/experiences",
  experienceBySlug: (slug: string) => `/client/experiences/${slug}`,
  categories: () => "/client/categories",
  github: () => "/client/github",
  articles: () => "/client/articles",
  articleBySlug: (slug: string) => `/client/articles/${encodeURIComponent(slug)}`,
} as const;

function extractPayload<T>(response: AxiosResponse<T | { data: T }>): T {
  const payload = response.data as T | { data: T };

  if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
    return payload.data;
  }

  return payload as T;
}

// Public content always comes from the configured API in every environment.
// Missing configuration, failed requests and unsupported endpoints must stay observable.
async function getPayload<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  const effectiveBaseUrl = resolveApiBaseUrl(apiClient.defaults.baseURL || API_BASE_URL);
  if (!effectiveBaseUrl) {
    throw new Error("VITE_API_URL is required to load portfolio content.");
  }
  const response = await apiClient.get<T | { data: T }>(path, config);
  return extractPayload(response);
}

async function getOptionalPayload<T>(path: string): Promise<T | null> {
  try {
    return await getPayload<T>(path);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export const api = {
  getPortfolio: () => getPayload<TPortfolioContent>(apiEndpoints.portfolio()),
  getProjects: () => getPayload<TProject[]>(apiEndpoints.projects()),
  getProjectBySlug: (slug: string) => getOptionalPayload<TProject>(apiEndpoints.projectBySlug(slug)),
  getExperiences: () => getPayload<TExperience[]>(apiEndpoints.experiences()),
  getExperienceBySlug: (slug: string) => getOptionalPayload<TExperience>(apiEndpoints.experienceBySlug(slug)),
  // Revalidate even an older cached REST response after the server's token is configured.
  // The API still caches GitHub upstream responses, so this does not add provider requests.
  getGithubStats: () => getPayload<TGithubStats>(apiEndpoints.github(), { headers: { "Cache-Control": "no-cache" } }),
  getCategories: () => getPayload<TCategory[]>(apiEndpoints.categories()),
  getArticles: async (): Promise<PublicArticleSummary[]> => {
    const res = await getPayload<{ articles: PublicArticleSummary[] } | PublicArticleSummary[]>(
      apiEndpoints.articles(),
    );
    if (res && typeof res === "object" && "articles" in res && Array.isArray(res.articles)) {
      return res.articles;
    }
    return Array.isArray(res) ? res : [];
  },
  getArticleBySlug: (slug: string) => getOptionalPayload<PublicArticle>(apiEndpoints.articleBySlug(slug)),
} as const;

export { adminApi, setAdminCsrfToken } from "./admin-api.ts";

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
    };
  }

  return {
    message: "An unknown error occurred",
  };
};
