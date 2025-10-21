import axios, { AxiosError, AxiosResponse } from "axios";
import { TProject } from "../types/project";
import { TExperience } from "../types/experience";
import { TPost } from "../types/post";
import { TCategory } from "../types/category";
import { ApiError } from "../types/error";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL environment variable is not set. API calls will fail.",
  );
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
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

// Response interceptor for error handling
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

// API Endpoints
export const apiEndpoints = {
  // Projects
  projects: () => "/client/projects",
  projectBySlug: (slug: string) => `/client/projects/${slug}`,

  // Experiences
  experiences: () => "/client/experiences",
  experienceBySlug: (slug: string) => `/client/experiences/${slug}`,

  // Posts
  posts: () => "/client/posts",
  postBySlug: (slug: string) => `/client/posts/${slug}`,

  // Categories
  categories: () => "/client/categories",
} as const;

// Mock data for development when API is not available
const mockData = {
  projects: [] as TProject[],
  experiences: [] as TExperience[],
  posts: [] as TPost[],
  categories: [] as TCategory[],
};

// API Functions
export const api = {
  // Projects
  getProjects: async (): Promise<TProject[]> => {
    try {
      const response = await apiClient.get(apiEndpoints.projects());
      return response.data;
    } catch (error) {
      console.warn("API not available, returning empty array for projects");
      return mockData.projects;
    }
  },

  getProjectBySlug: async (slug: string): Promise<TProject> => {
    try {
      const response = await apiClient.get(apiEndpoints.projectBySlug(slug));
      return response.data;
    } catch (error) {
      console.warn(`API not available, returning null for project: ${slug}`);
      return null as any;
    }
  },

  // Experiences
  getExperiences: async (): Promise<TExperience[]> => {
    try {
      const response = await apiClient.get(apiEndpoints.experiences());
      return response.data;
    } catch (error) {
      console.warn("API not available, returning empty array for experiences");
      return mockData.experiences;
    }
  },

  getExperienceBySlug: async (slug: string): Promise<TExperience> => {
    try {
      const response = await apiClient.get(apiEndpoints.experienceBySlug(slug));
      return response.data;
    } catch (error) {
      console.warn(`API not available, returning null for experience: ${slug}`);
      return null as any;
    }
  },

  // Posts
  getPosts: async (): Promise<TPost[]> => {
    try {
      const response = await apiClient.get(apiEndpoints.posts());
      return response.data.data || [];
    } catch (error) {
      console.warn("API not available, returning empty array for posts");
      return mockData.posts;
    }
  },

  getPostBySlug: async (slug: string): Promise<TPost> => {
    try {
      const response = await apiClient.get(apiEndpoints.postBySlug(slug));
      return response.data.data || response.data;
    } catch (error) {
      console.warn(`API not available, returning null for post: ${slug}`);
      return null as any;
    }
  },

  // Categories
  getCategories: async (): Promise<TCategory[]> => {
    try {
      const response = await apiClient.get(apiEndpoints.categories());
      return response.data;
    } catch (error) {
      console.warn("API not available, returning empty array for categories");
      return mockData.categories;
    }
  },
} as const;

// Utility function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    // const _networkError: NetworkError = error;
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
