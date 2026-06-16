import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { PrismaService } from "../prisma.service";
import { ContactDto } from "./contact.dto";

@Controller()
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
}
