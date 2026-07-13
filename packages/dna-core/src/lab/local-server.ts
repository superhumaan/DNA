import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { DnaConfig } from "@superhumaan/dna-config";
import { handleLabRequest, formatLabMountMessage, resolveLabPath } from "./server.js";

export interface LabDashboardOptions {
  root: string;
  port?: number;
  host?: string;
  config?: DnaConfig | null;
}

export async function startLabServer(
  options: LabDashboardOptions,
): Promise<{ url: string; close: () => void }> {
  const port = options.port ?? 3200;
  const host = options.host ?? "127.0.0.1";
  const labPath = resolveLabPath(options.config);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const handled = await handleLabRequest(req, res, {
      root: options.root,
      config: options.config,
    });
    if (!handled) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  });

  await new Promise<void>((resolve) => server.listen(port, host, resolve));
  const url = `http://${host}:${port}${labPath}`;

  return {
    url,
    close: () => server.close(),
  };
}

export function formatLabStart(url: string): string {
  const base = url.replace(/\/labs\/?$/, "");
  return [
    "DNA Lab",
    "========",
    "",
    formatLabMountMessage("/labs", base),
    "",
    `Open: ${url}`,
    "",
    "Press Ctrl+C to stop.",
  ].join("\n");
}
