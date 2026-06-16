import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as client from "prom-client";

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly logger = new Logger("Metrics");

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const route = req.route?.path || req.path;

    res.on("finish", () => {
      const duration = (Date.now() - start) / 1000;
      const status = res.statusCode.toString();
      const method = req.method;
      httpRequestsTotal.inc({ method, route, status });
      httpRequestDuration.observe({ method, route, status }, duration);

      if (res.statusCode >= 500) {
        this.logger.warn(JSON.stringify({ type: "error", method, route, status, duration }));
      }
    });

    next();
  }
}
