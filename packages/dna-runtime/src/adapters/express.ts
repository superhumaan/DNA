import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import type { RuntimeEngine } from "../core/engine.js";
import { observeRequest, captureError } from "../core/engine.js";
import { createRuntimeIngestHandler } from "./ingest.js";

export function createExpressMiddleware(engine: RuntimeEngine) {
  const ingest = createRuntimeIngestHandler(engine);

  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path || req.url?.split("?")[0] || "";
    if (
      (req.method === "POST" || req.method === "OPTIONS") &&
      (path === "/api/dna/runtime" || path.endsWith("/api/dna/runtime"))
    ) {
      void ingest(req, res);
      return;
    }

    const start = Date.now();

    res.on("finish", () => {
      if (res.locals.dnaErrorCaptured) return;
      const requestId = (req.headers["x-request-id"] as string | undefined) ?? undefined;
      observeRequest(engine, {
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
        requestId,
        upstream: req.headers["x-upstream"] as string | undefined,
      });
    });

    next();
  };
}

export function createExpressErrorHandler(engine: RuntimeEngine): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.locals.dnaErrorCaptured = true;
    captureError(engine, err, {
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode || 500,
    });

    if (!res.headersSent) {
      const status = res.statusCode >= 400 ? res.statusCode : 500;
      res.status(status).json({
        error: status === 500 ? "Internal Server Error" : "Request failed",
      });
    } else {
      next(err);
    }
  };
}
