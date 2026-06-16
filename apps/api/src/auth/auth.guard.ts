import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.mh_admin_session;
    if (!token) throw new UnauthorizedException("Missing session");

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string; role: string };
      if (payload.role !== "ADMIN") throw new UnauthorizedException("Invalid role");
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid session");
    }
  }
}
