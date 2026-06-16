import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }

  signSession(user: { id: string; email: string; role: string }) {
    return jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  async currentUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("Invalid session");
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
}
