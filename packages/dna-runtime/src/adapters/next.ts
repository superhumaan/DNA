import type { RuntimeEngine } from "../core/engine.js";
import { observeRequest, captureError } from "../core/engine.js";

export interface NextRequestLike {
  nextUrl?: { pathname: string };
  url?: string;
  method: string;
}

export interface NextHandlerContext {
  params?: Record<string, string>;
}

export type NextRouteHandler = (
  request: NextRequestLike,
  context?: NextHandlerContext,
) => Response | Promise<Response>;

/** Wrap an App Router route handler with DNA error capture */
export function withNextHandler(engine: RuntimeEngine, handler: NextRouteHandler): NextRouteHandler {
  return async (request, context) => {
    const start = Date.now();
    const endpoint = request.nextUrl?.pathname ?? request.url ?? "/";

    try {
      const response = await handler(request, context);
      observeRequest(engine, {
        endpoint,
        method: request.method,
        statusCode: response.status ?? 200,
        durationMs: Date.now() - start,
      });
      return response;
    } catch (error) {
      captureError(engine, error instanceof Error ? error : new Error(String(error)), {
        endpoint,
        method: request.method,
        statusCode: 500,
      });
      throw error;
    }
  };
}

/** Edge/Node middleware helper — records request timing on the way through */
export function createNextMiddleware(engine: RuntimeEngine) {
  return async function dnaMiddleware(request: NextRequestLike): Promise<void> {
    const start = Date.now();
    const endpoint = request.nextUrl?.pathname ?? request.url ?? "/";

    // Middleware cannot see response status; record as pass-through
    observeRequest(engine, {
      endpoint,
      method: request.method,
      statusCode: 200,
      durationMs: Date.now() - start,
    });
  };
}

/** Pages Router API wrapper */
export function withNextApiRoute(
  engine: RuntimeEngine,
  handler: (req: NextApiRequestLike, res: NextApiResponseLike) => void | Promise<void>,
) {
  return async (req: NextApiRequestLike, res: NextApiResponseLike) => {
    const start = Date.now();
    const endpoint = req.url?.split("?")[0] ?? "/";

    const originalEnd = res.end.bind(res);
    res.end = (...args: unknown[]) => {
      observeRequest(engine, {
        endpoint,
        method: req.method ?? "GET",
        statusCode: res.statusCode ?? 200,
        durationMs: Date.now() - start,
      });
      return originalEnd(...(args as Parameters<typeof originalEnd>));
    };

    try {
      await handler(req, res);
    } catch (error) {
      captureError(engine, error instanceof Error ? error : new Error(String(error)), {
        endpoint,
        method: req.method,
        statusCode: res.statusCode || 500,
      });
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    }
  };
}

export interface NextApiRequestLike {
  url?: string;
  method?: string;
}

export interface NextApiResponseLike {
  statusCode: number;
  headersSent?: boolean;
  end: (...args: unknown[]) => unknown;
}
