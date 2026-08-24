import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
