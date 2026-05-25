import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { HealthController } from "./health.controller";
import { ContentController } from "./content/content.controller";
import { SubscribersController } from "./subscribers/subscribers.controller";
import { SettingsController } from "./settings/settings.controller";

@Module({
  imports: [],
  controllers: [
    HealthController,
    AuthController,
    ContentController,
    SubscribersController,
    SettingsController
  ],
  providers: [PrismaService, AuthService]
})
export class AppModule {}
