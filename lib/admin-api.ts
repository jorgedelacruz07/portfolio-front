import axios, { type AxiosResponse } from "axios";
import type {
  TPortfolioContent,
  TProfile,
  TSiteSettings,
  TSkill,
} from "../types/portfolio";
import type { TExperience } from "../types/experience";
import type { TProject } from "../types/project";

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() ?? "";

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
