import "reflect-metadata";
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Request, Response, NextFunction } from "express";
import { join } from "path";
import cookieParser = require("cookie-parser");
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
  app.useStaticAssets(publicPath, { index: false });

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
      res.sendFile(indexHtml);
    }
  });

  await app.listen(Number(process.env.PORT || 3000), "0.0.0.0");
}

bootstrap();
