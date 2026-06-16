import { Body, Controller, Get, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import { PrismaService } from "../prisma.service";
import { SiteSettingDto } from "./settings.dto";

@Controller()
@UseInterceptors(AuditInterceptor)
export class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("public/settings")
  settings() {
    return this.prisma.siteSetting.findMany();
  }

  @Get("admin/settings")
  @UseGuards(AdminAuthGuard)
  adminSettings() {
    return this.prisma.siteSetting.findMany();
  }

  @Put("admin/settings/:key")
  @UseGuards(AdminAuthGuard)
  upsert(@Param("key") key: string, @Body() dto: SiteSettingDto) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value: dto.value as any },
      create: { key, value: dto.value as any }
    });
  }
}
