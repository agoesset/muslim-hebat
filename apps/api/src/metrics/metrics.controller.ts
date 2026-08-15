import { Controller, Get, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { env } from "../config/env";
import { register } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  @Get()
  async metrics(@Req() req: Request, @Res() res: Response) {
    const expected = env.METRICS_TOKEN;
    const provided = String(req.headers["x-metrics-token"] || req.query.token || "");

    if (!expected) {
      if (env.isProduction) {
        throw new UnauthorizedException("Metrics are disabled");
      }
    } else if (provided !== expected) {
      throw new UnauthorizedException("Invalid metrics token");
    }

    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
}
