import { defineConfig } from 'vite';

export default defineConfig({
  base: "/", // Ensures correct paths for a custom domain
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        projects: "projects.html",
        sticky: "sticky.html",
        circuits: "circuits.html"
      }
    }
  }
});