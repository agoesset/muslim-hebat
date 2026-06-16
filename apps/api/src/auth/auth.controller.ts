import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./auth.dto";
import { AdminAuthGuard } from "./auth.guard";

const cookieName = "mh_admin_session";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const token = this.auth.signSession(user);

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    return { user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(cookieName, { path: "/" });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AdminAuthGuard)
  async me(@Req() req: Request & { user?: { sub: string } }) {
    return { user: await this.auth.currentUser(req.user!.sub) };
  }
}
