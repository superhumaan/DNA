import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_PORT = 3456;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
      "/labs": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
      "/api/dna/labs": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
