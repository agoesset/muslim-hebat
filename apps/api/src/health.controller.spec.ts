import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { PrismaService } from "./prisma.service";

const mockPrisma = {
  $queryRaw: jest.fn().mockResolvedValue([{ "?column?": 1 }])
};

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: mockPrisma }]
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should return health status with database connected", async () => {
    expect(await controller.health()).toEqual({
      ok: true,
      service: "muslim-hebat-api",
      database: "connected"
    });
  });
});
