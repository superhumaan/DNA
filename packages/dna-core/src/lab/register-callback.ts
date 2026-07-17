import { createServer } from "node:http";
import type { RegisterLabOptions, RegisterLabResult } from "./register.js";
import { runRegisterLab } from "./register.js";
import { readLocalPairing, verifyPairingCallbackSignature } from "./pairing.js";

const MAX_CALLBACK_BODY_BYTES = 64 * 1024;

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
      let size = 0;
      for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > MAX_CALLBACK_BODY_BYTES) {
          res.writeHead(413);
          res.end();
          resolveCallback?.(false);
          return;
        }
        chunks.push(buffer);
      }
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString("utf-8")) as {
          pairingId?: string;
          verified?: boolean;
        };
        const body = {
          pairingId: String(parsed.pairingId ?? ""),
          verified: parsed.verified === true,
        };
        const signatureHeader = req.headers["x-dna-lab-signature"];
        const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
        const localPairing = await readLocalPairing(options.root);
        const valid =
          localPairing?.pairingId === body.pairingId &&
          verifyPairingCallbackSignature(localPairing.codeHash, body, signature);
        if (!valid) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unauthorized" }));
          resolveCallback?.(false);
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        resolveCallback?.(body.verified);
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
