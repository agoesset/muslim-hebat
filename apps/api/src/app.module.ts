import { Module } from "@nestjs/common";
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

@Module({
  imports: [],
  controllers: [
    HealthController,
    AuthController,
    ContentController,
    SubscribersController,
    SettingsController,
    HomeController,
    SitemapController,
    EmailController,
    UploadController
  ],
  providers: [PrismaService, AuthService, EmailService]
})
export class AppModule {}
