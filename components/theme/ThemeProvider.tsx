import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  THEME_STORAGE_KEY,
  readStoredTheme,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;

  const color = resolved === "dark" ? "#09090b" : "#ffffff";
  document.querySelectorAll('meta[name="theme-color"]').forEach((node) => {
    node.setAttribute("content", color);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    try {
      return readStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      return "system";
    }
  });
  const [systemDark, setSystemDark] = useState(() => (typeof window === "undefined" ? false : systemPrefersDark()));

  const resolved = resolveTheme(preference, systemDark);

  useEffect(() => {
    applyResolvedTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      setPreferenceState(readStoredTheme(event.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      setPreference: (next) => {
        setPreferenceState(next);
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Private mode can reject storage. The in-memory choice still applies.
        }
      },
    }),
    [preference, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
