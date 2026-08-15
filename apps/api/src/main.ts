import "reflect-metadata";
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Request, Response, NextFunction } from "express";
import { existsSync, readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import * as express from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { env } from "./config/env";
import { initSentry } from "./config/sentry";
import { MetricsMiddleware } from "./metrics/metrics.service";
import { generateNonce } from "./config/nonce";

initSentry();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: env.isProduction ? ["error", "warn", "log"] : undefined,
  });

  // Attach a per-request CSP nonce
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = generateNonce();
    next();
  });

  // Compress all HTTP responses (HTML, JSON, JS, CSS) — saves ~70% bandwidth,
  // important for users on mobile or far regions. Skip for already-compressed
  // image/font formats handled automatically by compression@1.8+.
  app.use(
    compression({
      // Compress responses >= 1 KB. Smaller payloads have negligible size gain
      // and CPU cost outweighs the benefit.
      threshold: 1024,
      // Use fastest compression level. 6 (default) wastes CPU for marginal
      // size gain on dynamic JSON.
      level: 1,
      // Don't compress responses with no-cache / no-store (already handled
      // for HTML fallback and entry chunks below).
      filter: (req, res) => {
        const ce = (res.getHeader("Content-Encoding") || "") as string;
        if (ce && ce !== "identity") return false;
        const cacheControl = (res.getHeader("Cache-Control") || "") as string;
        if (/no-store|no-cache/i.test(cacheControl)) return false;
        return compression.filter(req, res);
      },
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            // Allow Vite dev HMR in development only
            ...(env.isDevelopment ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
            (_req: any, res: any) => `'nonce-${res.locals.nonce as string}'`,
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            (_req: any, res: any) => `'nonce-${res.locals.nonce as string}'`,
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "https://*.sentry.io"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Structured request logging + metrics
  const metricsService = await app.resolve(MetricsMiddleware);
  app.use((req: Request, res: Response, next: NextFunction) => {
    metricsService.use(req, res, next);
  });

  app.set("trust proxy", 1);

  app.enableCors({
    origin: env.WEB_ORIGIN.split(","),
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE"
  });

  app.use(cookieParser());

  // Serve frontend static files in production
  const publicPath = join(__dirname, "public");

  // If a browser/Cloudflare has stale HTML that points to an older hashed Vite entry
  // chunk, serve the newest entry chunk even if the stale file still exists in the
  // build output. This prevents old cached HTML from loading a broken stale bundle.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const fileName = req.path.split("/").pop() || "";
    const isEntryChunk = req.path.startsWith("/assets/") && /^index-[A-Za-z0-9_-]+\.(js|css)$/.test(fileName);
    if (!isEntryChunk) return next();

    const assetsPath = join(publicPath, "assets");
    if (!existsSync(assetsPath)) return next();
    const extension = fileName.endsWith(".css") ? ".css" : ".js";
    const latestEntry = readdirSync(assetsPath)
      .filter((name) => /^index-[A-Za-z0-9_-]+\.(js|css)$/.test(name) && name.endsWith(extension))
      .map((name) => ({ name, mtimeMs: statSync(join(assetsPath, name)).mtimeMs }))
      .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.name;

    if (!latestEntry) return next();
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.sendFile(join(assetsPath, latestEntry));
  });

  app.useStaticAssets(publicPath, {
    index: false,
    setHeaders: (res: Response, assetPath: string) => {
      const fileName = assetPath.split(/[\\/]/).pop() || "";
      if (/^index-[A-Za-z0-9_-]+\.(js|css)$/.test(fileName)) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      }
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.path.toLowerCase().endsWith(".pdf")) {
      res.setHeader("Content-Disposition", "attachment");
    }
    next();
  }, express.static(env.UPLOAD_DIR));

  app.setGlobalPrefix("api", {
    exclude: [
      { path: "health", method: RequestMethod.GET },
      { path: "health/ready", method: RequestMethod.GET },
      { path: "sitemap.xml", method: RequestMethod.GET },
      { path: "robots.txt", method: RequestMethod.GET },
      { path: "rss.xml", method: RequestMethod.GET },
    ]
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // SPA fallback: serve index.html for non-API, non-static routes with CSP nonce
  // Skip if index.html not available (e.g. local dev with Vite serving frontend)
  const indexHtmlPath = join(publicPath, "index.html");
  let indexHtmlTemplate: string | undefined;
  try {
    indexHtmlTemplate = readFileSync(indexHtmlPath, "utf-8");
  } catch {
    // not available in dev mode
  }
  if (indexHtmlTemplate) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        req.path.startsWith("/api") ||
        req.path.startsWith("/health") ||
        req.path.includes(".")
      ) {
        next();
      } else {
        const nonce = res.locals.nonce as string;
        const html = indexHtmlTemplate
          .replace(/__CSP_NONCE__/g, nonce)
          .replace(/<script /g, `<script nonce="${nonce}" `)
          .replace(/<link rel="stylesheet" /g, `<link rel="stylesheet" nonce="${nonce}" `);
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.type("html").send(html);
      }
    });
  }

  await app.listen(env.PORT, "0.0.0.0");
}

bootstrap();
