import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const plugins = [
    react({
      jsxRuntime: "automatic",
    }),
  ];

  return {
    plugins,

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "mui-vendor": [
              "@mui/material",
              "@mui/icons-material",
              "@emotion/react",
              "@emotion/styled",
            ],
            "query-vendor": ["@tanstack/react-query"],
            "date-vendor": ["date-fns"],
            "form-vendor": ["react-hook-form"],
            "i18n-vendor": ["i18next", "react-i18next"],
            calendar: ["react-big-calendar"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === "production" ? "hidden" : true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: true,
        },
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@mui/material",
        "@tanstack/react-query",
        "zustand",
      ],
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@context": path.resolve(__dirname, "./src/context"),
        "@router": path.resolve(__dirname, "./src/router"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@i18n": path.resolve(__dirname, "./src/i18n"),
      },
    },
  };
});
