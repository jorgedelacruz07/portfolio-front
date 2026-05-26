import axios, { AxiosError, type AxiosResponse } from "axios";

import type { TCategory } from "../types/category";
import type { TExperience } from "../types/experience";
import type { ApiError } from "../types/error";
import type {
  TPortfolioContent,
  TProfile,
  TSiteSettings,
  TSkill,
} from "../types/portfolio";
import type { TProject } from "../types/project";

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() ?? "";
const shouldUseMockData = import.meta.env.DEV && !API_BASE_URL;

function isLocalApiUrl(url: string) {
  if (!url) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsedUrl.hostname);
  } catch {
    return /(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(url);
  }
}

if (!API_BASE_URL) {
  console.warn(
    "VITE_API_URL is not configured. Falling back to mock data in development.",
  );
}

if (import.meta.env.PROD && isLocalApiUrl(API_BASE_URL)) {
  console.error(
    "VITE_API_URL points to a local address in a production build. Rebuild the app with the production API URL before deploying.",
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let adminCsrfToken = "";

export function setAdminCsrfToken(token: string) {
  adminCsrfToken = token;
}

function requireAdminApiUrl() {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is required for admin CMS access.");
  }
}

adminApiClient.interceptors.request.use((config) => {
  if (
    adminCsrfToken &&
    !["get", "head", "options"].includes(config.method || "")
  ) {
    config.headers["x-csrf-token"] = adminCsrfToken;
  }

  return config;
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
  portfolio: () => "/client/portfolio",
  projects: () => "/client/projects",
  projectBySlug: (slug: string) => `/client/projects/${slug}`,
  experiences: () => "/client/experiences",
  experienceBySlug: (slug: string) => `/client/experiences/${slug}`,
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
  categories: [{ id: "1", name: "Tech" }] as TCategory[],
  portfolio: {
    profile: {
      name: "Jorge de la Cruz Padilla",
      headline:
        "Senior Software Engineer building fast, maintainable full-stack products.",
      shortBio:
        "I build user-facing apps, backend services, and cloud-ready delivery workflows with React, Express, MongoDB, AWS, Docker, and AI-assisted delivery.",
      location: "Lima, Peru",
      availability: "Available",
      profileImage: { src: "/images/jorge.jpg" },
      resumeUrl: "/documents/jorgedelacruz_cv.pdf",
      contactEmail: "jdelacruzp7@gmail.com",
      socialLinks: [
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/jorgedelacruz07",
        },
        { label: "GitHub", url: "https://github.com/jorgedelacruz07" },
      ],
    },
    settings: {
      seoTitle: "Jorge de la Cruz | Senior Software Engineer",
      seoDescription:
        "Senior Software Engineer building full-stack products with React, Express, MongoDB, AWS, Docker, and AI-assisted delivery workflows.",
      openGraphImage: "https://jorgedelacruzpadilla.dev/images/jorge.jpg",
      contactEmail: "jdelacruzp7@gmail.com",
      availabilityText: "Available for work",
      footerText: "Jorge de la Cruz. All rights reserved.",
    },
    skills: [
      "React.js",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AWS",
      "Docker",
      "AI workflows",
    ].map((name, index) => ({
      name,
      category: index < 7 ? "Engineering" : "AI workflow",
      priority: index,
      displayOrder: index,
      visible: true,
    })),
    projects: [] as TProject[],
    experiences: [] as TExperience[],
  } as TPortfolioContent,
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

function isNotFoundError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function logFallback(message: string) {
  if (import.meta.env.DEV) {
    console.warn(message);
  }
}

function buildPortfolioPayload({
  projects = [],
  experiences = [],
}: {
  projects?: TProject[];
  experiences?: TExperience[];
}): TPortfolioContent {
  return {
    ...mockData.portfolio,
    projects,
    experiences,
  };
}

export const api = {
  getPortfolio: async (): Promise<TPortfolioContent> => {
    if (shouldUseMockData) {
      return mockData.portfolio;
    }

    try {
      const response = await apiClient.get<
        TPortfolioContent | { data: TPortfolioContent }
      >(apiEndpoints.portfolio());
      return extractPayload(response);
    } catch (error) {
      if (isNotFoundError(error)) {
        const [projectsResult, experiencesResult] = await Promise.allSettled([
          api.getProjects(),
          api.getExperiences(),
        ]);

        return buildPortfolioPayload({
          projects:
            projectsResult.status === "fulfilled" ? projectsResult.value : [],
          experiences:
            experiencesResult.status === "fulfilled"
              ? experiencesResult.value
              : [],
        });
      }

      if (shouldUseFallback(error)) {
        logFallback("API unavailable, using mock portfolio.");
        return buildPortfolioPayload({});
      }

      throw error;
    }
  },

  getProjects: async (): Promise<TProject[]> => {
    if (shouldUseMockData) {
      return mockData.projects;
    }

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
    if (shouldUseMockData) {
      return mockData.projects.find((project) => project.slug === slug) ?? null;
    }

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
    if (shouldUseMockData) {
      return mockData.experiences;
    }

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
    if (shouldUseMockData) {
      return (
        mockData.experiences.find((experience) => experience.slug === slug) ??
        null
      );
    }

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

  getCategories: async (): Promise<TCategory[]> => {
    if (shouldUseMockData) {
      return mockData.categories;
    }

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

export const adminApi = {
  requestCode: async (email: string) => {
    requireAdminApiUrl();
    const response = await adminApiClient.post("/admin/auth/request-code", {
      email,
    });
    return response.data;
  },
  verifyCode: async (email: string, code: string) => {
    requireAdminApiUrl();
    const response = await adminApiClient.post("/admin/auth/verify-code", {
      email,
      code,
    });
    const payload = extractPayload<{
      csrfToken: string;
      expiresAt: string;
    }>(response);
    setAdminCsrfToken(payload.csrfToken);
    return payload;
  },
  getSession: async () => {
    requireAdminApiUrl();
    const response = await adminApiClient.get<{
      email: string;
      csrfToken: string;
      expiresAt: string;
    }>("/admin/auth/session");
    const payload = extractPayload(response);
    setAdminCsrfToken(payload.csrfToken);
    return payload;
  },
  logout: async () => {
    requireAdminApiUrl();
    await adminApiClient.post("/admin/auth/logout");
    setAdminCsrfToken("");
  },
  getPortfolio: async () => {
    requireAdminApiUrl();
    const response =
      await adminApiClient.get<TPortfolioContent>("/client/portfolio");
    return extractPayload(response);
  },
  saveProfile: async (profile: TProfile) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TProfile>(
      "/admin/portfolio/profile",
      profile,
    );
    return extractPayload(response);
  },
  saveSettings: async (settings: TSiteSettings) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TSiteSettings>(
      "/admin/portfolio/settings",
      settings,
    );
    return extractPayload(response);
  },
  saveSkills: async (skills: TSkill[]) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TSkill[]>(
      "/admin/portfolio/skills",
      { skills },
    );
    return extractPayload(response);
  },
  listExperiences: async () => {
    requireAdminApiUrl();
    const response =
      await adminApiClient.get<TExperience[]>("/admin/experiences");
    return extractPayload(response);
  },
  saveExperience: async (experience: TExperience) => {
    requireAdminApiUrl();
    const { id, createdAt, updatedAt, technologies, ...payload } = experience;
    const response = await adminApiClient.put<TExperience>(
      `/admin/experiences/${id}`,
      {
        ...payload,
        technologyIds: technologies?.map((technology) => technology.id) || [],
      },
    );
    return extractPayload(response);
  },
  listProjects: async () => {
    requireAdminApiUrl();
    const response = await adminApiClient.get<TProject[]>("/admin/projects");
    return extractPayload(response);
  },
  saveProject: async (project: TProject) => {
    requireAdminApiUrl();
    const { id, createdAt, updatedAt, technologies, ...payload } = project;
    const response = await adminApiClient.put<TProject>(
      `/admin/projects/${id}`,
      {
        ...payload,
        technologyIds: technologies?.map((technology) => technology.id) || [],
      },
    );
    return extractPayload(response);
  },
};

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
