import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { router } from "./Router";
import { reportWebVitals } from "../lib/analytics";
import { queryClient } from "../lib/query-client";

const googleAnalyticsId = import.meta.env.VITE_GA_ID;

// Define gtag property on window if not present to avoid "is not a function" errors
if (typeof window !== "undefined") {
  const analyticsWindow = window as Window & { dataLayer?: unknown[][] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];

  if (!window.gtag) {
    window.gtag = ((command, targetId, config) => {
      analyticsWindow.dataLayer?.push([command, targetId, config]);
    }) as Window["gtag"];
  }
}

let hasInitializedAnalytics = false;
let hasStartedWebVitals = false;

function initializeAnalytics() {
  if (
    hasInitializedAnalytics ||
    typeof window === "undefined" ||
    !googleAnalyticsId
  ) {
    return;
  }

  hasInitializedAnalytics = true;

  const existingScript = document.getElementById("gtag-script");

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "gtag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", googleAnalyticsId, {
    page_path: window.location.pathname,
    transport_type: "beacon",
    anonymize_ip: true,
  });
}

// Initialize analytics (inject script and config)
initializeAnalytics();

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    if (!hasStartedWebVitals) {
      reportWebVitals();
      hasStartedWebVitals = true;
    }

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
