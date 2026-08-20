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
