import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || import.meta.env.DEV) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENV || "production",
    release: import.meta.env.VITE_APP_VERSION || undefined,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_SAMPLE_RATE ?? 0),
    replaysOnErrorSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAY_ERROR_RATE ?? 0.1),
    beforeSend(event) {
      if (event.exception) {
        const lastFrame = event.exception.values?.[0]?.stacktrace?.frames?.slice(-1)[0];
        if (lastFrame?.filename?.includes("localhost")) return null;
      }
      if (event.user?.email) {
        event.user = { id: event.user.id };
      }
      return event;
    },
  });
}

export { Sentry };
