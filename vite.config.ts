import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [TanStackRouterVite(), react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BASE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
