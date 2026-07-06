import type { RuntimeEngine } from "../core/engine.js";
import { observeRequest, captureError } from "../core/engine.js";

export interface FastifyLike {
  addHook(
    name: "onRequest" | "onResponse" | "onError",
    fn: (...args: unknown[]) => void | Promise<void>,
  ): void;
}

export interface FastifyRequestLike {
  url: string;
  method: string;
  dnaStartTime?: number;
  routerPath?: string;
}

export interface FastifyReplyLike {
  statusCode: number;
}

export function attachFastifyHooks(engine: RuntimeEngine, fastify: FastifyLike): void {
  fastify.addHook("onRequest", async (...args: unknown[]) => {
    const request = args[0] as FastifyRequestLike;
    request.dnaStartTime = Date.now();
  });

  fastify.addHook("onResponse", async (...args: unknown[]) => {
    const request = args[0] as FastifyRequestLike;
    const reply = args[1] as FastifyReplyLike;
    const start = request.dnaStartTime ?? Date.now();
    observeRequest(engine, {
      endpoint: request.routerPath ?? request.url.split("?")[0] ?? request.url,
      method: request.method,
      statusCode: reply.statusCode,
      durationMs: Date.now() - start,
    });
  });

  fastify.addHook("onError", async (...args: unknown[]) => {
    const request = args[0] as FastifyRequestLike;
    const reply = args[1] as FastifyReplyLike;
    const error = args[2] as Error;
    captureError(engine, error, {
      endpoint: request.routerPath ?? request.url.split("?")[0],
      method: request.method,
      statusCode: reply.statusCode || 500,
    });
  });
}

export function createFastifyPlugin(engine: RuntimeEngine) {
  return async function dnaFastifyPlugin(fastify: FastifyLike): Promise<void> {
    attachFastifyHooks(engine, fastify);
  };
}
