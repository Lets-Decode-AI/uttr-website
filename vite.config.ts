import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        terms: resolve(import.meta.dirname, "terms/index.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
  server: {
    // The release API is PHP; run `npm run api` alongside `npm run dev`.
    proxy: { "/api": "http://127.0.0.1:8788", "/download": "http://127.0.0.1:8788" },
  },
});
