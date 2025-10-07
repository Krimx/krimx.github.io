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
        sc_rename: "sc-rename-gen/sc-rename.html",
        glass: "glassmorphism-learning/glass.html",
        illustrator: "illustrator/ill.html",
        mobile: "mobile.html",
        links: "links.html",
        munchkin: "munchkin/munchkin.html",
        liquid_glass: "liquid-glass/liquid-glass.html",
        liquid_glass_index: "liquid-glass-index.html",
        kircuits: "kirc_docs/kirc_docs.html"
      }
    }
  }
});