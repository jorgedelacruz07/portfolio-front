import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      aria-label={
        resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {resolved === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
