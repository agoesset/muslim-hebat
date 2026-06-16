import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AdminAuthGuard } from "../auth/auth.guard";
import { EmailService } from "./email.service";

@Controller()
export class EmailController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  @Post("admin/newsletter/send")
  @UseGuards(AdminAuthGuard)
  async sendNewsletter(@Body() dto: { subject: string; html: string; text?: string }) {
    const subscribers = await this.prisma.subscriber.findMany({
      select: { email: true },
      orderBy: { createdAt: "desc" },
    });

    const emails = subscribers.map((s) => s.email);
    const result = await this.email.sendNewsletter({
      to: emails,
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
    });

    return result;
  }
}
