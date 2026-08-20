import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { IsOptional, IsString, MinLength } from "class-validator";
import { PrismaService } from "../prisma.service";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import { EmailService } from "./email.service";
import { randomBytes } from "crypto";

export class NewsletterDto {
  @IsString()
  @MinLength(1)
  subject!: string;

  @IsString()
  @MinLength(1)
  html!: string;

  @IsOptional()
  @IsString()
  text?: string;
}

@Controller()
@UseInterceptors(AuditInterceptor)
export class EmailController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  @Post("admin/newsletter/send")
  @UseGuards(AdminAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  async sendNewsletter(@Body() dto: NewsletterDto) {
    const subscribers = await this.prisma.subscriber.findMany({
      select: { id: true, email: true, unsubToken: true },
      orderBy: { createdAt: "desc" },
    });

    const recipients = await Promise.all(subscribers.map(async (subscriber: { id: string; email: string; unsubToken: string | null }) => {
      if (subscriber.unsubToken) {
        return { email: subscriber.email, unsubToken: subscriber.unsubToken };
      }
      const unsubToken = randomBytes(24).toString("hex");
      await this.prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { unsubToken }
      });
      return { email: subscriber.email, unsubToken };
    }));

    return this.email.sendNewsletter({
      to: recipients,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
    });
  }
}
