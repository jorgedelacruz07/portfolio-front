import "@fontsource-variable/inter/wght.css";
import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { router } from "./Router";
import { portfolioQuery } from "../hooks/useHomePageData";
import { queryClient } from "../lib/query-client";

// Start the data request before React mounts so it overlaps with parsing and rendering.
if (window.location.pathname === "/") {
  void queryClient.prefetchQuery(portfolioQuery(queryClient));
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <RouterProvider router={router} />
          </MotionConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
