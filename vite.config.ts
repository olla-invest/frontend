import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3001,
      proxy: isDev
        ? {
            "/api": {
              target: "https://subtetanic-hypostatically-roland.ngrok-free.dev",
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  };
});
