import type { LabServerOptions } from "./server.js";
import {
  applyLabDocumentHeaders,
  handleLabRequest,
  labApiPrefix,
  resolveLabPath,
} from "./server.js";

export type LabMiddleware = (req: unknown, res: unknown, next: () => void) => void;

function requestPathname(req: { url?: string; path?: string }): string {
  const raw = req.path ?? req.url ?? "/";
  return raw.split("?")[0] || "/";
}

function isLabRoute(pathname: string, options: LabServerOptions): boolean {
  const labPath = resolveLabPath(options.config);
  const apiPrefix = labApiPrefix();
  return (
    pathname === labPath ||
    pathname.startsWith(`${labPath}/`) ||
    pathname.startsWith(apiPrefix)
  );
}

export function createLabMiddleware(options: LabServerOptions): LabMiddleware {
  return (req, res, next) => {
    const pathname = requestPathname(req as { url?: string; path?: string });
    if (!isLabRoute(pathname, options)) {
      next();
      return;
    }

    const labPath = resolveLabPath(options.config);
    const isLabPage = pathname === labPath || pathname.startsWith(`${labPath}/`);
    if (isLabPage) {
      applyLabDocumentHeaders(res as Parameters<typeof applyLabDocumentHeaders>[0]);
    }

    void handleLabRequest(
      req as Parameters<typeof handleLabRequest>[0],
      res as Parameters<typeof handleLabRequest>[1],
      options,
      next,
    ).then((handled) => {
      if (!handled && next && !(res as { headersSent?: boolean }).headersSent) next();
    });
  };
}
