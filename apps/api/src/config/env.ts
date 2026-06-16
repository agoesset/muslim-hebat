import { cleanEnv, num, port, str, url } from "envalid";

const isTest = process.env.NODE_ENV === "test";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
  PORT: port({ default: 3000 }),
  DATABASE_URL: isTest
    ? str({ default: "postgresql://test:test@localhost:5432/test" })
    : url(),
  JWT_SECRET: str({ default: isTest ? "test-secret-at-least-32-characters-long-for-jwt" : undefined }),
  WEB_ORIGIN: str({ default: isTest ? "http://localhost" : undefined }),
  SITE_URL: str({ default: "" }),
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: str({ default: "" }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),
  SMTP_SECURE: str({ default: "" }),
  FROM_EMAIL: str({ default: "" }),
  FROM_NAME: str({ default: "" }),
  ADMIN_EMAIL: str({ default: "" }),
  ADMIN_PASSWORD: str({ default: "" }),
  SENTRY_DSN: str({ default: "" }),
  SENTRY_ENV: str({ default: "production" }),
  APP_VERSION: str({ default: "" }),
  SENTRY_TRACES_SAMPLE_RATE: num({ default: 0.1 }),
  SENTRY_PROFILE_SAMPLE_RATE: num({ default: 0 }),
});

if (env.isProduction && env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}
