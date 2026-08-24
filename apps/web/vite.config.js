import { defineConfig } from "vitest/config";
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
  test: {
    // Semua test jalan di jsdom: test komponen butuh DOM, dan test util/API
    // tidak terpengaruh karena resolusi import tidak bergantung pada environment.
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
  },
  build: {
    sourcemap: true,
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
  },
  server: {
    allowedHosts: ["dev.muslimhebat.103.42.245.213.sslip.io", "dev.lowcode.my.id"],
    proxy: {
      "/api": "http://127.0.0.1:3000",
      "/uploads": "http://127.0.0.1:3000",
      "/health": "http://127.0.0.1:3000",
      "/sitemap.xml": "http://127.0.0.1:3000",
      "/rss.xml": "http://127.0.0.1:3000",
    },
  },
});
