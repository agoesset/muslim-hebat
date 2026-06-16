import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { PrismaService } from "./prisma.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { HealthController } from "./health.controller";
import { ContentController } from "./content/content.controller";
import { SubscribersController } from "./subscribers/subscribers.controller";
import { SettingsController } from "./settings/settings.controller";
import { HomeController } from "./home/home.controller";
import { SitemapController } from "./sitemap/sitemap.controller";
import { EmailController } from "./email/email.controller";
import { EmailService } from "./email/email.service";
import { UploadController } from "./upload/upload.controller";
import { ContactController } from "./contact/contact.controller";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsMiddleware } from "./metrics/metrics.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }])
  ],
  controllers: [
    HealthController,
    AuthController,
    ContentController,
    SubscribersController,
    SettingsController,
    HomeController,
    SitemapController,
    EmailController,
    UploadController,
    ContactController,
    MetricsController
  ],
  providers: [
    PrismaService,
    AuthService,
    EmailService,
    MetricsMiddleware,
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule {}
