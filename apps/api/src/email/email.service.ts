import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env } from "../config/env";

type Recipient = { email: string; unsubToken?: string | null };

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null;

  constructor() {
    if (!env.SMTP_HOST || !env.SMTP_USER) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendNewsletter(options: { to: Recipient[]; subject: string; html: string; text?: string }) {
    if (!this.transporter) {
      return { sent: 0, failed: options.to.length, total: options.to.length, skipped: true, reason: "SMTP not configured" };
    }

    const from = env.FROM_EMAIL || "newsletter@muslimhebat.com";
    const fromName = env.FROM_NAME || "Muslim Hebat";
    const siteUrl = (env.SITE_URL || "https://muslimhebat.com").replace(/\/$/, "");
    const batchSize = 25;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < options.to.length; i += batchSize) {
      const batch = options.to.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((recipient) => {
          const unsubUrl = recipient.unsubToken
            ? `${siteUrl}/unsubscribe?token=${recipient.unsubToken}`
            : `${siteUrl}/unsubscribe`;
          return this.transporter!.sendMail({
            from: `"${fromName}" <${from}>`,
            to: recipient.email,
            subject: options.subject,
            html: options.html,
            text: options.text || options.subject,
            list: {
              unsubscribe: {
                url: unsubUrl,
                comment: "Berhenti berlangganan",
              },
            },
          });
        })
      );
      sent += results.filter((r) => r.status === "fulfilled").length;
      failed += results.filter((r) => r.status === "rejected").length;
    }

    return { sent, failed, total: options.to.length };
  }
}
