import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import { PrismaService } from "../prisma.service";
import { SubscriberDto, UnsubscribeDto } from "./subscribers.dto";

@Controller()
@UseInterceptors(AuditInterceptor)
export class SubscribersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/subscribers")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  subscribe(@Body() dto: SubscriberDto) {
    return this.prisma.subscriber.upsert({
      where: { email: dto.email },
      update: { name: dto.name, source: dto.source },
      create: dto
    });
  }

  @Post("public/subscribers/unsubscribe")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async unsubscribe(@Body() dto: UnsubscribeDto) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { email: dto.email }
    });
    if (subscriber) {
      await this.prisma.subscriber.delete({ where: { email: dto.email } });
    }
    return { ok: true };
  }

  @Get("admin/subscribers")
  @UseGuards(AdminAuthGuard)
  list() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  }
}
