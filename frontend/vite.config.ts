import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      // Allows @/* aliases in JS/JSX as well as TS/TSX
      loose: true,
    }),
  ],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
      },
    },
  },
});
