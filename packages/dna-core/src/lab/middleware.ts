import type { LabServerOptions } from "./server.js";
import { handleLabRequest } from "./server.js";

export type LabMiddleware = (req: unknown, res: unknown, next: () => void) => void;

export function createLabMiddleware(options: LabServerOptions): LabMiddleware {
  return (req, res, next) => {
    void handleLabRequest(
      req as Parameters<typeof handleLabRequest>[0],
      res as Parameters<typeof handleLabRequest>[1],
      options,
      next,
    ).then((handled) => {
      if (!handled && next) next();
    });
  };
}
