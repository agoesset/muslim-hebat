import { UnauthorizedException } from "@nestjs/common";
import { AdminAuthGuard } from "./auth.guard";
import { env } from "../config/env";
import * as jwt from "jsonwebtoken";

describe("AdminAuthGuard", () => {
  let guard: AdminAuthGuard;

  beforeEach(() => {
    guard = new AdminAuthGuard();
    jest.clearAllMocks();
  });

  const mockContext = (cookies: Record<string, string>) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ cookies })
      })
    } as any;
  };

  describe("canActivate", () => {
    it("should return true and attach user for valid ADMIN token", () => {
      const token = jwt.sign(
        { sub: "user-1", email: "a@b.com", role: "ADMIN" },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const req = { cookies: { mh_admin_session: token } };
      const context = {
        switchToHttp: () => ({ getRequest: () => req })
      } as any;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect((req as any).user).toEqual(expect.objectContaining({ sub: "user-1", role: "ADMIN" }));
    });

    it("should throw UnauthorizedException when token is missing", () => {
      const context = mockContext({});

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when token is invalid", () => {
      const context = mockContext({ mh_admin_session: "invalid-token" });

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when role is not ADMIN", () => {
      const token = jwt.sign(
        { sub: "user-1", email: "a@b.com", role: "USER" },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const req = { cookies: { mh_admin_session: token } };
      const context = {
        switchToHttp: () => ({ getRequest: () => req })
      } as any;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    });
  });
});
