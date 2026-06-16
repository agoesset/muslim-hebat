import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function extractResource(path: string): string {
  const segments = path.split("/").filter(Boolean);
  // /admin/articles/:id -> articles; /admin/newsletter/send -> newsletter
  if (segments[0] === "admin" && segments[1]) return segments[1];
  if (segments[0] === "upload") return "upload";
  return segments[0] || "unknown";
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method = req.method as string;
    const path = req.route?.path || req.path || "";

    if (!MUTATING_METHODS.has(method)) {
      return next.handle();
    }

    const user = req.user || {};
    const resource = extractResource(path);
    const resourceId = req.params?.id;

    return next.handle().pipe(
      tap(() => {
        const log = {
          userId: user.sub || user.id || null,
          email: user.email || null,
          method,
          path,
          resource,
          resourceId: resourceId || null,
          timestamp: new Date().toISOString()
        };
        Logger.log(JSON.stringify(log), "Audit");
      })
    );
  }
}
