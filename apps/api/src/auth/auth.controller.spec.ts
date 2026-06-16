import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    signSession: jest.fn().mockReturnValue("mock-jwt-token"),
    currentUser: jest.fn()
  };

  const mockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("login", () => {
    it("should set cookie and return user on successful login", async () => {
      const user = { id: "user-1", email: "a@b.com", name: "Admin", role: "ADMIN" };
      mockAuthService.validateUser.mockResolvedValue(user);
      const res = mockResponse();

      const result = await controller.login({ email: "a@b.com", password: "secret" } as any, res);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith("a@b.com", "secret");
      expect(mockAuthService.signSession).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith(
        "mh_admin_session",
        "mock-jwt-token",
        expect.objectContaining({ httpOnly: true, sameSite: "lax" })
      );
      expect(result).toEqual({ user });
    });
  });

  describe("logout", () => {
    it("should clear cookie and return ok", () => {
      const res = mockResponse();

      const result = controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith("mh_admin_session", { path: "/" });
      expect(result).toEqual({ ok: true });
    });
  });

  describe("me", () => {
    it("should return current user from request", async () => {
      const user = { id: "user-1", email: "a@b.com", name: "Admin", role: "ADMIN" };
      mockAuthService.currentUser.mockResolvedValue(user);
      const req = { user: { sub: "user-1" } } as any;

      const result = await controller.me(req);

      expect(mockAuthService.currentUser).toHaveBeenCalledWith("user-1");
      expect(result).toEqual({ user });
    });
  });
});
