import tailwindcss from "@tailwindcss/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // basicSsl(),
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
      },
    }),
  ],
  server: {
    proxy: {
      "/api/python": {
        target: "https://armory-monsieur-zigzagged.ngrok-free.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/python/, "/ecommerce/products"),
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
