import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { router } from "./Router";
import { portfolioQuery } from "../hooks/useHomePageData";
import { queryClient } from "../lib/query-client";

// Start the data request before React mounts so it overlaps with parsing and rendering.
if (window.location.pathname === "/") {
  void queryClient.prefetchQuery(portfolioQuery(queryClient));
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
