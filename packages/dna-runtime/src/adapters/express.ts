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
    captureError(engine, err, {
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode || 500,
    });

    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      next(err);
    }
  };
}
