import {
  createEngine,
  startEngine,
  resetEngine,
  type DnaRuntimeConfig,
  type RuntimeEngine,
} from "./core/engine.js";
import { createExpressMiddleware, createExpressErrorHandler } from "./adapters/express.js";
import { createFastifyPlugin, attachFastifyHooks } from "./adapters/fastify.js";
import {
  createNestInterceptor,
  createNestExceptionFilter,
  DnaExceptionFilter,
  DnaInterceptor,
} from "./adapters/nestjs.js";
import {
  withNextHandler,
  createNextMiddleware,
  withNextApiRoute,
  type NextRouteHandler,
  type NextApiRequestLike,
  type NextApiResponseLike,
} from "./adapters/next.js";

export type { DnaRuntimeConfig } from "./core/engine.js";
export { redactSensitive } from "./core/redact.js";
export { processRuntimeEvent } from "./pipeline.js";
export { issueFingerprint, fingerprintLabel } from "./fingerprint.js";
export { runForceRepair, type ForceRepairResult } from "./force-repair.js";
export {
  readFingerprintRecords,
  getBlockerFingerprints,
  upsertFingerprintRecord,
} from "./storage.js";
export {
  readOpenBlockers,
  updatePreviousSolutionsMemory,
} from "./memory-updates.js";
export { appendJsonl, readJsonl } from "./persistence.js";
export {
  createNestInterceptor,
  createNestExceptionFilter,
  DnaExceptionFilter,
  DnaInterceptor,
  withNextHandler,
  createNextMiddleware,
  withNextApiRoute,
  createFastifyPlugin,
  attachFastifyHooks,
};

export interface DnaRuntimeApi {
  start(config: DnaRuntimeConfig): void;
  express(): (req: unknown, res: unknown, next: () => void) => void;
  errorHandler(): (err: Error, req: unknown, res: unknown, next: (err?: Error) => void) => void;
  fastify(): ReturnType<typeof createFastifyPlugin>;
  attachFastify(fastify: Parameters<typeof attachFastifyHooks>[1]): void;
  nestInterceptor(): ReturnType<typeof createNestInterceptor>;
  nestExceptionFilter(): ReturnType<typeof createNestExceptionFilter>;
  withNextHandler(handler: NextRouteHandler): NextRouteHandler;
  nextMiddleware(): ReturnType<typeof createNextMiddleware>;
  withNextApiRoute(
    handler: (req: NextApiRequestLike, res: NextApiResponseLike) => void | Promise<void>,
  ): (req: NextApiRequestLike, res: NextApiResponseLike) => Promise<void>;
  _getEngine(): RuntimeEngine;
  _resetForTests(): void;
}

const engine = createEngine();

export const dnaRuntime: DnaRuntimeApi = {
  start(config: DnaRuntimeConfig): void {
    startEngine(engine, config);
  },

  express() {
    return createExpressMiddleware(engine) as DnaRuntimeApi["express"] extends () => infer R
      ? R
      : never;
  },

  errorHandler() {
    return createExpressErrorHandler(engine) as DnaRuntimeApi["errorHandler"] extends () => infer R
      ? R
      : never;
  },

  fastify() {
    return createFastifyPlugin(engine);
  },

  attachFastify(fastify) {
    attachFastifyHooks(engine, fastify);
  },

  nestInterceptor() {
    return createNestInterceptor(engine);
  },

  nestExceptionFilter() {
    return createNestExceptionFilter(engine);
  },

  withNextHandler(handler: NextRouteHandler): NextRouteHandler {
    return withNextHandler(engine, handler);
  },

  nextMiddleware() {
    return createNextMiddleware(engine);
  },

  withNextApiRoute(
    handler: (req: NextApiRequestLike, res: NextApiResponseLike) => void | Promise<void>,
  ) {
    return withNextApiRoute(engine, handler);
  },

  _getEngine(): RuntimeEngine {
    return engine;
  },

  _resetForTests(): void {
    resetEngine(engine);
  },
};
