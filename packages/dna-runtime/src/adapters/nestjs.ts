import type { RuntimeEngine } from "../core/engine.js";
import { observeRequest, captureError } from "../core/engine.js";

export interface NestExecutionContext {
  switchToHttp(): {
    getRequest(): NestRequestLike;
    getResponse(): NestResponseLike;
  };
}

export interface NestRequestLike {
  path?: string;
  url?: string;
  method?: string;
  dnaStartTime?: number;
}

export interface NestResponseLike {
  statusCode: number;
}

export interface NestCallHandler {
  handle(): { pipe: (fn: (source: unknown) => unknown) => unknown };
}

export interface NestArgumentsHost {
  switchToHttp(): {
    getRequest(): NestRequestLike;
    getResponse(): NestResponseLike;
  };
}

function attachResponseObserver(
  engine: RuntimeEngine,
  req: NestRequestLike,
  res: NestResponseLike & { on?: (event: string, fn: () => void) => void },
): void {
  req.dnaStartTime = Date.now();

  if (typeof res.on === "function") {
    res.on("finish", () => {
      observeRequest(engine, {
        endpoint: req.path ?? req.url ?? "/",
        method: req.method ?? "GET",
        statusCode: res.statusCode ?? 200,
        durationMs: Date.now() - (req.dnaStartTime ?? Date.now()),
      });
    });
  }
}

/** Factory for Nest interceptor — use with @UseInterceptors(dnaRuntime.nestInterceptor()) */
export function createNestInterceptor(engine: RuntimeEngine) {
  return {
    intercept(context: NestExecutionContext, next: NestCallHandler) {
      const http = context.switchToHttp();
      attachResponseObserver(engine, http.getRequest(), http.getResponse());
      return next.handle();
    },
  };
}

/** NestJS class-based interceptor */
export class DnaInterceptor {
  constructor(private readonly engine: RuntimeEngine) {}

  intercept(context: NestExecutionContext, next: NestCallHandler) {
    return createNestInterceptor(this.engine).intercept(context, next);
  }
}

/** NestJS exception filter — use with @UseFilters(DnaExceptionFilter) */
export function createNestExceptionFilter(engine: RuntimeEngine) {
  return {
    catch(exception: Error, host: NestArgumentsHost) {
      const ctx = host.switchToHttp();
      const req = ctx.getRequest();
      const res = ctx.getResponse();

      captureError(engine, exception, {
        endpoint: req.path ?? req.url,
        method: req.method,
        statusCode: res.statusCode || 500,
      });

      throw exception;
    },
  };
}

export class DnaExceptionFilter {
  constructor(private readonly engine: RuntimeEngine) {}

  catch(exception: Error, host: NestArgumentsHost) {
    return createNestExceptionFilter(this.engine).catch(exception, host);
  }
}
