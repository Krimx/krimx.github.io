import { defineConfig } from 'vite';

export default defineConfig({
  base: "/", // Ensures correct paths for a custom domain
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        projects: "projects.html",
        circuits: "circuits.html",
        tbag: "tbag.html",
        sc_rename: "sc-rename-gen/sc-rename.html"
      }
    }
  }
});