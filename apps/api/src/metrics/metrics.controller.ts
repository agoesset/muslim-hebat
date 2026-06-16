import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { register } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  @Get()
  async metrics(@Res() res: Response) {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
}
