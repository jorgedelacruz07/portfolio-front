import axios, { type AxiosResponse } from "axios";
import type { TPortfolioContent, TProfile, TSiteSettings, TSkill } from "../types/portfolio";
import type { TExperience } from "../types/experience";
import type { TProject } from "../types/project";
import { PRODUCTION_API_URL, resolveApiBaseUrl } from "./api-url.ts";

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

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
  const effectiveBaseUrl = resolveApiBaseUrl(API_BASE_URL);
  if (!effectiveBaseUrl) {
    throw new Error("VITE_API_URL is required for admin CMS access.");
  }
}

adminApiClient.interceptors.request.use((config) => {
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

  if (adminCsrfToken && !["get", "head", "options"].includes(config.method || "")) {
    config.headers["x-csrf-token"] = adminCsrfToken;
  }

  return config;
});

function extractPayload<T>(response: AxiosResponse<T | { data: T }>): T {
  const payload = response.data as T | { data: T };

  if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
    return payload.data;
  }

  return payload as T;
}

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
    const response = await adminApiClient.get<TPortfolioContent>("/client/portfolio");
    return extractPayload(response);
  },
  saveProfile: async (profile: TProfile) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TProfile>("/admin/portfolio/profile", profile);
    return extractPayload(response);
  },
  saveSettings: async (settings: TSiteSettings) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TSiteSettings>("/admin/portfolio/settings", settings);
    return extractPayload(response);
  },
  saveSkills: async (skills: TSkill[]) => {
    requireAdminApiUrl();
    const response = await adminApiClient.put<TSkill[]>("/admin/portfolio/skills", { skills });
    return extractPayload(response);
  },
  listExperiences: async () => {
    requireAdminApiUrl();
    const response = await adminApiClient.get<TExperience[]>("/admin/experiences");
    return extractPayload(response);
  },
  saveExperience: async (experience: TExperience) => {
    requireAdminApiUrl();
    const { id, createdAt, updatedAt, technologies, ...payload } = experience;
    const response = await adminApiClient.put<TExperience>(`/admin/experiences/${id}`, {
      ...payload,
      technologyIds: technologies?.map((technology) => technology.id) || [],
    });
    return extractPayload(response);
  },
  listProjects: async () => {
    requireAdminApiUrl();
    const response = await adminApiClient.get<TProject[]>("/admin/projects");
    return extractPayload(response);
  },
  importProjectDraft: async (draft: unknown) => {
    requireAdminApiUrl();
    const response = await adminApiClient.post<TProject>("/admin/projects/import-draft", draft);
    return extractPayload(response);
  },
  saveProject: async (project: TProject) => {
    requireAdminApiUrl();
    const { id, technologies } = project;
    const response = await adminApiClient.put<TProject>(`/admin/projects/${id}`, {
      slug: project.slug,
      name: project.name,
      type: project.type,
      url: project.url,
      description: project.description,
      longDescription: project.longDescription,
      links: project.links,
      featured: project.featured,
      displayOrder: project.displayOrder,
      image: project.image,
      from: project.from,
      to: project.to,
      status: project.status ?? false,
      technologyIds: technologies?.map((technology) => technology.id) || [],
    });
    return extractPayload(response);
  },
};
