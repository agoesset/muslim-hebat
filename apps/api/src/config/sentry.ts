import * as Sentry from "@sentry/nestjs";
import { env } from "./env";

export function initSentry() {
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENV || "production",
    release: env.APP_VERSION,
    integrations: [Sentry.prismaIntegration()],
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
    profilesSampleRate: env.SENTRY_PROFILE_SAMPLE_RATE ?? 0,
    beforeSend(event) {
      // Scrub PII from requests
      if (event.request?.cookies) {
        event.request.cookies = Object.fromEntries(
          Object.entries(event.request.cookies).map(([k]) => [k, "[redacted]"])
        );
      }
      if (event.request?.headers) {
        const scrub = ["authorization", "cookie", "x-api-key"];
        event.request.headers = Object.fromEntries(
          Object.entries(event.request.headers).map(([k, v]) => [
            k,
            scrub.includes(k.toLowerCase()) ? "[redacted]" : v,
          ])
        );
      }
      if (event.user?.email) {
        event.user = { id: event.user.id };
      }
      return event;
    },
  });
}

export { Sentry };
