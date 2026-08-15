import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";
import { AdminAuthGuard } from "../auth/auth.guard";
import { AuditInterceptor } from "../audit/audit.interceptor";
import { env } from "../config/env";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

@Controller()
@UseGuards(AdminAuthGuard)
@UseInterceptors(AuditInterceptor)
export class UploadController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: env.UPLOAD_DIR,
        filename: (_req: any, file: any, cb: any) => {
          cb(null, randomUUID() + extname(file.originalname).toLowerCase());
        },
      }),
      fileFilter: (_req: any, file: any, cb: any) => {
        const ext = extname(file.originalname).toLowerCase();
        if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Invalid file type"), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  upload(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded or file rejected");
    }
    return { url: `/uploads/${file.filename}` };
  }
}
