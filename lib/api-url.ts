export const PRODUCTION_API_URL = "https://portfolio-api-6voehdisua-uc.a.run.app";

export function resolveApiBaseUrl(rawEnvUrl?: string): string {
  const envUrl = rawEnvUrl?.trim() ?? "";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "";
    const isLocalBrowser = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");

    const isLocalApi =
      !envUrl || envUrl.includes("://localhost") || envUrl.includes("://127.0.0.1") || envUrl.includes("://0.0.0.0");

    if (!isLocalBrowser && isLocalApi) {
      console.warn(
        "[API] Localhost or empty API base URL detected in non-local browser context; falling back to production API.",
      );
      return PRODUCTION_API_URL;
    }
  }
  return envUrl;
}
