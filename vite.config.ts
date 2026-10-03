import process from "node:process";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { validateProductionApiUrl } from "./config/validateProductionEnv.ts";

export default defineConfig({
  envDir: process.env.DOPPLER_PROJECT && process.env.DOPPLER_CONFIG ? false : undefined,
  plugins: [
    react(),
    {
      name: "validate-production-api-url",
      configResolved(config) {
        const shouldValidate =
          Boolean(process.env.CI) ||
          Boolean(process.env.GITHUB_ACTIONS) ||
          process.env.VITE_VERIFY_PROD_URL === "true" ||
          process.env.npm_lifecycle_event === "deploy";

        if (config.command === "build" && shouldValidate) {
          validateProductionApiUrl(config.env.VITE_API_URL);
        }
      },
    },
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            if (id.includes("@tanstack/react-query")) {
              return "tanstack-query";
            }
            if (id.includes("lucide-react")) {
              return "lucide-icons";
            }
            if (id.includes("react-router")) {
              return "react-router";
            }
          }
        },
      },
    },
  },
});
