import "reflect-metadata";
import { ValidationPipe, RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser = require("cookie-parser");
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const webOrigin = process.env.WEB_ORIGIN || "http://127.0.0.1:5173";

  app.use(cookieParser());
  app.enableCors({
    origin: webOrigin.split(","),
    credentials: true
  });
  app.setGlobalPrefix("api", {
    exclude: [{ path: "health", method: RequestMethod.GET }]
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  await app.listen(Number(process.env.PORT || 3000), "0.0.0.0");
}

bootstrap();
