import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          sourcemaps: { filesToDeleteAfterUpload: "**/*.map" },
        })
      : null,
  ].filter(Boolean),
  build: {
    sourcemap: true,
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
      "/health": "http://127.0.0.1:3000"
    }
  }
});
