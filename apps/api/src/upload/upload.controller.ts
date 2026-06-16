import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuditInterceptor } from "../audit/audit.interceptor";

const UPLOAD_DIR = "./uploads";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf"
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf"];

@Controller()
@UseInterceptors(AuditInterceptor)
export class UploadController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req: any, file: any, cb: any) => {
          const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    })
  )
  upload(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("No file uploaded or file rejected");
    }
    return { url: `/uploads/${file.filename}` };
  }
}
