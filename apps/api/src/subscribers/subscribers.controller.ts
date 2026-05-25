import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../auth/auth.guard";
import { PrismaService } from "../prisma.service";
import { SubscriberDto } from "./subscribers.dto";

@Controller()
export class SubscribersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/subscribers")
  subscribe(@Body() dto: SubscriberDto) {
    return this.prisma.subscriber.upsert({
      where: { email: dto.email },
      update: { name: dto.name, source: dto.source },
      create: dto
    });
  }

  @Get("admin/subscribers")
  @UseGuards(AdminAuthGuard)
  list() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  }
}
