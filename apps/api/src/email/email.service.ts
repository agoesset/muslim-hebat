import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });
  }

  async sendNewsletter(options: { to: string[]; subject: string; html: string; text?: string }) {
    const from = process.env.FROM_EMAIL || "newsletter@muslimhebat.com";
    const fromName = process.env.FROM_NAME || "Muslim Hebat";

    // Send individually to avoid exposing all emails
    const results = await Promise.allSettled(
      options.to.map((email) =>
        this.transporter.sendMail({
          from: `"${fromName}" <${from}>`,
          to: email,
          subject: options.subject,
          html: options.html,
          text: options.text || options.subject,
          list: {
            unsubscribe: {
              url: `${process.env.SITE_URL || "https://muslimhebat.com"}/unsubscribe`,
              comment: "Berhenti berlangganan",
            },
          },
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { sent, failed, total: options.to.length };
  }
}
