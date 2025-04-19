import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export const DarkModeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <button
        className="w-8 h-8 rounded-lg bg-slate-600 dark:bg-slate-800 flex items-center justify-center transition-all duration-300 focus:outline-none"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle Dark Mode"
      >
        {theme === "light" ? (
          <MoonIcon className="text-white w-5 h-5" />
        ) : (
          <SunIcon className="text-white w-5 h-5" />
        )}
      </button>
    </>
  );
};
