import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { router } from "./Router";
import { reportWebVitals } from "../lib/analytics";
import { queryClient } from "../lib/query-client";

let hasStartedWebVitals = false;

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
