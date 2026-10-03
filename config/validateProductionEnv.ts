export function validateProductionApiUrl(value: unknown): void {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("VITE_API_URL is required for a production build.");
  }

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("VITE_API_URL must be an absolute HTTP(S) URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("VITE_API_URL must be an absolute HTTP(S) URL.");
  }

  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.startsWith("127.") ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]"
  ) {
    throw new Error("VITE_API_URL must not point to a local address in a production build.");
  }
}
