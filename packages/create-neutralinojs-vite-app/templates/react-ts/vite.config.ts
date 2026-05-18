import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // fail if port 5173 is taken — avoids silent port shift breaking Neutralinojs devUrl
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
