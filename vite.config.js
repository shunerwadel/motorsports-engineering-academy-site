import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages project sites live at /<repo>/ — set BASE_PATH in CI.
  base: process.env.BASE_PATH || "/",
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: true,
  },
});
