/** Persisted theme choice. `system` follows the OS and is the default. */
export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/** Missing or unknown values stay on the system preference. */
export function readStoredTheme(value: string | null): ThemePreference {
  return isThemePreference(value) ? value : "system";
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return systemPrefersDark ? "dark" : "light";
}
