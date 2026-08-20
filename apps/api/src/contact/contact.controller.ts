import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { PrismaService } from "../prisma.service";
import { ContactDto, UpdateContactDto } from "./contact.dto";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";

@Controller()
@UseInterceptors(AuditInterceptor)
export class ContactController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/contact")
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async submit(@Body() dto: ContactDto) {
    await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message
      }
    });
    return { ok: true };
  }

  @Get("admin/contact")
  @UseGuards(AdminAuthGuard)
  list() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  @Patch("admin/contact/:id")
  @UseGuards(AdminAuthGuard)
  markRead(@Param("id") id: string, @Body() dto: UpdateContactDto) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: dto.read ?? true }
    });
  }

  @Delete("admin/contact/:id")
  @UseGuards(AdminAuthGuard)
  async remove(@Param("id") id: string) {
    await this.prisma.contactMessage.delete({ where: { id } });
    return { ok: true };
  }
}
