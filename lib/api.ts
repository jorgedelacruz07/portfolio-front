import axios, { AxiosError, type AxiosResponse } from "axios";

import type { TCategory } from "../types/category";
import type { TExperience } from "../types/experience";
import type { ApiError } from "../types/error";
import type { TPost } from "../types/post";
import type { TProject } from "../types/project";

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() ?? "";
const shouldUseMockData = import.meta.env.DEV && !API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    "VITE_API_URL is not configured. Falling back to mock data in development.",
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
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
  projects: () => "/client/projects",
  projectBySlug: (slug: string) => `/client/projects/${slug}`,
  experiences: () => "/client/experiences",
  experienceBySlug: (slug: string) => `/client/experiences/${slug}`,
  posts: () => "/client/posts",
  postBySlug: (slug: string) => `/client/posts/${slug}`,
  categories: () => "/client/categories",
} as const;

const mockData = {
  projects: [
    {
      id: "1",
      name: "Project 1",
      slug: "project-1",
      type: "Web App",
      description: "This is a test project",
      image: { src: "/images/placeholder.jpg" },
      technologies: [{ id: "1", name: "React" }],
      url: "https://example.com",
      from: "2023-01-01",
      to: null,
    },
  ] as TProject[],
  experiences: [
    {
      id: "1",
      company: "Company A",
      slug: "company-a",
      jobTitle: "Developer",
      jobDescription: "Worked on frontend delivery and UI quality.",
      companyDescription:
        "A product company used as development fallback data.",
      companyUrl: "https://example.com",
      from: "2020-01-01",
      to: "2022-01-01",
      image: { src: "/images/placeholder.jpg" },
      technologies: [{ id: "1", name: "React" }],
    },
  ] as TExperience[],
  posts: [
    {
      id: "1",
      title: "Blog Post 1",
      slug: "blog-post-1",
      body: "<p>This is a test blog post.</p>",
      image: { src: "/images/placeholder.jpg" },
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      categories: [{ id: "1", name: "Tech" }],
      tags: [{ id: "1", name: "React" }],
    },
  ] as TPost[],
  categories: [{ id: "1", name: "Tech" }] as TCategory[],
};

function extractPayload<T>(response: AxiosResponse<T | { data: T }>): T {
  const payload = response.data as T | { data: T };

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data;
  }

  return payload as T;
}

function isNetworkError(error: unknown) {
  return axios.isAxiosError(error) && !error.response;
}

function shouldUseFallback(error: unknown) {
  return shouldUseMockData || isNetworkError(error);
}

function logFallback(message: string) {
  if (import.meta.env.DEV) {
    console.warn(message);
  }
}

export const api = {
  getProjects: async (): Promise<TProject[]> => {
    try {
      const response = await apiClient.get<TProject[] | { data: TProject[] }>(
        apiEndpoints.projects(),
      );
      return extractPayload(response);
    } catch (error) {
      if (shouldUseFallback(error)) {
        logFallback("API unavailable, using mock projects.");
        return mockData.projects;
      }

      throw error;
    }
  },

  getProjectBySlug: async (slug: string): Promise<TProject | null> => {
    try {
      const response = await apiClient.get<TProject | { data: TProject }>(
        apiEndpoints.projectBySlug(slug),
      );
      return extractPayload(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      if (shouldUseFallback(error)) {
        logFallback(`API unavailable, using mock project for slug: ${slug}.`);
        return (
          mockData.projects.find((project) => project.slug === slug) ?? null
        );
      }

      throw error;
    }
  },

  getExperiences: async (): Promise<TExperience[]> => {
    try {
      const response = await apiClient.get<
        TExperience[] | { data: TExperience[] }
      >(apiEndpoints.experiences());
      return extractPayload(response);
    } catch (error) {
      if (shouldUseFallback(error)) {
        logFallback("API unavailable, using mock experiences.");
        return mockData.experiences;
      }

      throw error;
    }
  },

  getExperienceBySlug: async (slug: string): Promise<TExperience | null> => {
    try {
      const response = await apiClient.get<TExperience | { data: TExperience }>(
        apiEndpoints.experienceBySlug(slug),
      );
      return extractPayload(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      if (shouldUseFallback(error)) {
        logFallback(
          `API unavailable, using mock experience for slug: ${slug}.`,
        );
        return (
          mockData.experiences.find((experience) => experience.slug === slug) ??
          null
        );
      }

      throw error;
    }
  },

  getPosts: async (): Promise<TPost[]> => {
    try {
      const response = await apiClient.get<TPost[] | { data: TPost[] }>(
        apiEndpoints.posts(),
      );
      return extractPayload(response);
    } catch (error) {
      if (shouldUseFallback(error)) {
        logFallback("API unavailable, using mock posts.");
        return mockData.posts;
      }

      throw error;
    }
  },

  getPostBySlug: async (slug: string): Promise<TPost | null> => {
    try {
      const response = await apiClient.get<TPost | { data: TPost }>(
        apiEndpoints.postBySlug(slug),
      );
      return extractPayload(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      if (shouldUseFallback(error)) {
        logFallback(`API unavailable, using mock post for slug: ${slug}.`);
        return mockData.posts.find((post) => post.slug === slug) ?? null;
      }

      throw error;
    }
  },

  getCategories: async (): Promise<TCategory[]> => {
    try {
      const response = await apiClient.get<TCategory[] | { data: TCategory[] }>(
        apiEndpoints.categories(),
      );
      return extractPayload(response);
    } catch (error) {
      if (shouldUseFallback(error)) {
        logFallback("API unavailable, using mock categories.");
        return mockData.categories;
      }

      throw error;
    }
  },
} as const;

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
