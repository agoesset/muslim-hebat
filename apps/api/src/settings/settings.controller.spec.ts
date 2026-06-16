import { Test, TestingModule } from "@nestjs/testing";
import { SettingsController } from "./settings.controller";
import { PrismaService } from "../prisma.service";

const mockSettings = [
  { id: "1", key: "theme", value: { palette: "cool" }, createdAt: new Date(), updatedAt: new Date() }
];

const mockPrisma = {
  siteSetting: {
    findMany: jest.fn().mockResolvedValue(mockSettings),
    upsert: jest.fn().mockResolvedValue(mockSettings[0])
  }
};

describe("SettingsController", () => {
  let controller: SettingsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
  });

  describe("settings (public)", () => {
    it("should return all site settings", async () => {
      const result = await controller.settings();

      expect(mockPrisma.siteSetting.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });
  });

  describe("adminSettings", () => {
    it("should return all site settings for admin", async () => {
      const result = await controller.adminSettings();

      expect(mockPrisma.siteSetting.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });
  });

  describe("upsert", () => {
    it("should upsert a setting by key", async () => {
      const dto = { key: "theme", value: { palette: "warm" } };
      const result = await controller.upsert("theme", dto);

      expect(mockPrisma.siteSetting.upsert).toHaveBeenCalledWith({
        where: { key: "theme" },
        update: { value: dto.value },
        create: { key: "theme", value: dto.value }
      });
      expect(result).toEqual(mockSettings[0]);
    });
  });
});
