import "reflect-metadata";
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Request, Response, NextFunction } from "express";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import cookieParser = require("cookie-parser");
import { PrismaClient } from "@prisma/client";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const webOrigin = process.env.WEB_ORIGIN || "http://127.0.0.1:5173";

  app.use(cookieParser());
  app.enableCors({
    origin: webOrigin.split(","),
    credentials: true
  });

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
    const extension = fileName.endsWith(".css") ? ".css" : ".js";
    const latestEntry = readdirSync(assetsPath)
      .filter((name) => /^index-[A-Za-z0-9_-]+\.(js|css)$/.test(name) && name.endsWith(extension))
      .map((name) => ({ name, mtimeMs: statSync(join(assetsPath, name)).mtimeMs }))
      .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]?.name;

    if (!latestEntry) return next();
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.sendFile(join(assetsPath, latestEntry));
  });

  app.useStaticAssets(publicPath, { index: false });

  // Dynamic SEO sitemap (root path, outside /api prefix)
  const adapter = app.getHttpAdapter();
  const sitemapPrisma = new PrismaClient();
  adapter.get("/sitemap.xml", async (_req: any, res: any) => {
    const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://muslimhebat.com").replace(/\/$/, "");
    const [articles, products, courses, kajian] = await Promise.all([
      sitemapPrisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      sitemapPrisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      sitemapPrisma.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      sitemapPrisma.kajianEvent.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } })
    ]);
    const toSitemapEntry = (prefix: string) => (item: { slug: string; updatedAt: Date }) => [`${prefix}/${item.slug}`, item.updatedAt] as [string, Date];
    const urls: [string, Date][] = [
      ["/", new Date()], ["/bacaan", new Date()], ["/produk", new Date()], ["/kelas", new Date()], ["/kajian", new Date()],
      ...articles.map(toSitemapEntry("/bacaan")),
      ...products.map(toSitemapEntry("/produk")),
      ...courses.map(toSitemapEntry("/kelas")),
      ...kajian.map(toSitemapEntry("/kajian"))
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([path, updated]) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${new Date(updated).toISOString()}</lastmod></url>`).join("\n")}\n</urlset>`;
    res.type("application/xml").send(xml);
  });

  app.setGlobalPrefix("api", {
    exclude: [{ path: "health", method: RequestMethod.GET }]
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // SPA fallback: serve index.html for non-API, non-static routes
  const indexHtml = join(publicPath, "index.html");
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/health") ||
      req.path.includes(".")
    ) {
      next();
    } else {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.sendFile(indexHtml);
    }
  });

  await app.listen(Number(process.env.PORT || 3000), "0.0.0.0");
}

bootstrap();
