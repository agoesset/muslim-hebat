import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { randomBytes } from "crypto";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import { PrismaService } from "../prisma.service";
import { SubscriberDto, UnsubscribeDto } from "./subscribers.dto";

function newUnsubToken() {
  return randomBytes(24).toString("hex");
}

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
      create: { ...dto, unsubToken: newUnsubToken() }
    });
  }

  @Post("public/subscribers/unsubscribe")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async unsubscribe(@Body() dto: UnsubscribeDto) {
    if (!dto.token) {
      throw new BadRequestException("Unsubscribe token required");
    }

    const subscriber = await this.prisma.subscriber.findUnique({
      where: { unsubToken: dto.token }
    });
    if (subscriber) {
      await this.prisma.subscriber.delete({ where: { id: subscriber.id } });
    }
    return { ok: true };
  }

  @Get("admin/subscribers")
  @UseGuards(AdminAuthGuard)
  list() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post("admin/subscribers")
  @UseGuards(AdminAuthGuard)
  create(@Body() dto: SubscriberDto) {
    return this.prisma.subscriber.upsert({
      where: { email: dto.email },
      update: { name: dto.name, source: dto.source },
      create: { ...dto, unsubToken: newUnsubToken() }
    });
  }

  @Delete("admin/subscribers/:id")
  @UseGuards(AdminAuthGuard)
  remove(@Param("id") id: string) {
    return this.prisma.subscriber.delete({ where: { id } });
  }
}
