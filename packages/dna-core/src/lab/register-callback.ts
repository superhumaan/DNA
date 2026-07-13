import { createServer } from "node:http";
import type { RegisterLabOptions, RegisterLabResult } from "./register.js";
import { runRegisterLab } from "./register.js";

export async function runRegisterLabWithCallback(
  options: RegisterLabOptions,
): Promise<RegisterLabResult> {
  const callbackPort = options.callbackPort ?? 9473;
  let resolveCallback: ((verified: boolean) => void) | null = null;

  const callbackPromise = new Promise<boolean>((resolve) => {
    resolveCallback = resolve;
    setTimeout(() => resolve(false), 15 * 60 * 1000);
  });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${callbackPort}`);
    if (req.method === "POST" && url.pathname === "/api/dna/labs/pairing/callback") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString("utf-8")) as { verified?: boolean };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        resolveCallback?.(Boolean(body.verified));
      } catch {
        res.writeHead(400);
        res.end();
        resolveCallback?.(false);
      }
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) => server.listen(callbackPort, "127.0.0.1", resolve));

  const result = await runRegisterLab({ ...options, callbackPort });

  if (result.pushedToProduction) {
    const verified = await callbackPromise;
    if (verified) {
      result.verified = true;
      result.message = "Pairing verified via production callback. Complete registration in your browser.";
    }
  }

  await new Promise<void>((resolve) => server.close(() => resolve()));

  return result;
}
