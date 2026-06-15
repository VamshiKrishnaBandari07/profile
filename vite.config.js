import { defineConfig } from "vite";

export default defineConfig({
  base: "/profile/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
