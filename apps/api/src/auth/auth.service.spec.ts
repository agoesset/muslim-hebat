import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma.service";

const mockUser = {
  id: "user-1",
  email: "admin@muslimhebat.local",
  name: "Admin",
  passwordHash: "$2a$12$hashedpassword",
  role: "ADMIN" as const,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockPrisma = {
  user: {
    findUnique: jest.fn()
  }
};

jest.mock("bcryptjs", () => ({
  compare: jest.fn()
}));

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe("validateUser", () => {
    it("should return user without passwordHash when credentials are valid", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser("admin@muslimhebat.local", "password123");

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "admin@muslimhebat.local" } });
    });

    it("should throw UnauthorizedException when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.validateUser("unknown@test.com", "password"))
        .rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when password is invalid", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser("admin@muslimhebat.local", "wrongpassword"))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe("signSession", () => {
    it("should return a JWT token string", () => {
      const user = { id: "user-1", email: "a@b.com", role: "ADMIN" };
      const token = service.signSession(user);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // header.payload.signature
    });
  });

  describe("currentUser", () => {
    it("should return user without passwordHash when found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.currentUser("user-1");

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      });
    });

    it("should throw UnauthorizedException when user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.currentUser("nonexistent"))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
