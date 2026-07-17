import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, afterEach } from "vitest";
import {
  handleLabRequest,
  LAB_DOCUMENT_CSP,
  LAB_MAX_BODY_BYTES,
  resolveLabStateTopology,
} from "./server.js";
import { ensureLabStore } from "./storage.js";
import { clearLabDataCache } from "./collect.js";
import { initLocalPairing, signPairingCallback } from "./pairing.js";
import { appendRuntimeRecord } from "../storage/runtime-db.js";

async function listenOnEphemeralPort(server: ReturnType<typeof createServer>): Promise<number> {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected TCP server address");
  return address.port;
}

describe("lab server", () => {
  let root = "";
  let port = 0;
  let server: ReturnType<typeof createServer> | null = null;

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
    }
    if (root) {
      clearLabDataCache(root);
      await rm(root, { recursive: true, force: true });
    }
  });

  it("fails closed for a declared multi-instance file-store deployment", () => {
    expect(resolveLabStateTopology({ DNA_LAB_INSTANCE_COUNT: "1" })).toEqual({
      supported: true,
      instanceCount: 1,
      backend: "single-instance-file",
    });
    const topology = resolveLabStateTopology({ WEB_CONCURRENCY: "3" });
    expect(topology.supported).toBe(false);
    expect(topology.instanceCount).toBe(3);
    expect(topology.reason).toMatch(/one application instance/i);
  });

  it("serves bootstrap in local mode without auth", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-srv-"));
    await ensureLabStore(root);

    server = createServer(async (req, res) => {
      const handled = await handleLabRequest(req, res, { root, config: { lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } as never });
      if (!handled) {
        res.writeHead(404);
        res.end();
      }
    });

    port = await listenOnEphemeralPort(server);

    const boot = await fetch(`http://127.0.0.1:${port}/api/dna/labs/bootstrap`, {
      headers: { Host: `127.0.0.1:${port}` },
    });
    expect(boot.status).toBe(200);
    const body = (await boot.json()) as { localMode: boolean; authenticated: boolean };
    expect(body.localMode).toBe(true);
    expect(body.authenticated).toBe(true);

    const page = await fetch(`http://127.0.0.1:${port}/labs`, {
      headers: { Host: `127.0.0.1:${port}` },
    });
    expect(page.status).toBe(200);
    expect(page.headers.get("content-security-policy")).toBe(LAB_DOCUMENT_CSP);
    expect(await page.text()).toContain("DNA Lab");

    const head = await fetch(`http://127.0.0.1:${port}/labs`, {
      method: "HEAD",
      headers: { Host: `127.0.0.1:${port}` },
    });
    expect(head.status).toBe(200);
    expect(head.headers.get("content-security-policy")).toBe(LAB_DOCUMENT_CSP);
    expect(await head.text()).toBe("");

    const health = await fetch(`http://127.0.0.1:${port}/api/dna/labs/health`);
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({
      ok: true,
      stateBackend: "single-instance-file",
      instanceCount: 1,
    });
  });

  it("serves /data with an ETag and answers If-None-Match with 304", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-data-"));
    await ensureLabStore(root);
    await appendRuntimeRecord(root, "events", {
      id: "event-detail",
      timestamp: new Date().toISOString(),
      fingerprint: "fp-detail",
      stack: "Error: retained on demand",
    });
    await appendRuntimeRecord(root, "issues", {
      id: "issue-detail",
      eventId: "event-detail",
      fingerprint: "fp-detail",
      title: "Detail",
    });

    server = createServer(async (req, res) => {
      const handled = await handleLabRequest(req, res, {
        root,
        config: { lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } as never,
      });
      if (!handled) {
        res.writeHead(404);
        res.end();
      }
    });

    port = await listenOnEphemeralPort(server);

    const first = await fetch(`http://127.0.0.1:${port}/api/dna/labs/data`, {
      headers: { Host: `127.0.0.1:${port}` },
    });
    expect(first.status).toBe(200);
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();
    await first.json();

    const revalidate = await fetch(`http://127.0.0.1:${port}/api/dna/labs/data`, {
      headers: { Host: `127.0.0.1:${port}`, "If-None-Match": etag as string },
    });
    expect(revalidate.status).toBe(304);
    expect(await revalidate.text()).toBe("");

    const detail = await fetch(
      `http://127.0.0.1:${port}/api/dna/labs/issues/issue-detail/events`,
      { headers: { Host: `127.0.0.1:${port}` } },
    );
    expect(detail.status).toBe(200);
    const detailBody = (await detail.json()) as { events: Array<{ stack?: string }> };
    expect(detailBody.events[0]?.stack).toBe("Error: retained on demand");
  });

  it("rejects oversized JSON bodies with 413", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-413-"));
    await ensureLabStore(root);

    server = createServer(async (req, res) => {
      const handled = await handleLabRequest(req, res, {
        root,
        config: { lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } as never,
      });
      if (!handled) {
        res.writeHead(404);
        res.end();
      }
    });

    port = await listenOnEphemeralPort(server);

    const huge = "x".repeat(LAB_MAX_BODY_BYTES + 1024);
    const res = await fetch(`http://127.0.0.1:${port}/api/dna/labs/auth/otp`, {
      method: "POST",
      headers: { Host: `127.0.0.1:${port}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.c", purpose: "login", pad: huge }),
    });
    expect(res.status).toBe(413);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/too large/i);
  });

  it("never treats a public development host as local or exposes its OTP", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-public-"));
    await ensureLabStore(root);

    server = createServer(async (req, res) => {
      const handled = await handleLabRequest(req, res, {
        root,
        config: {
          runtime: { environment: "development" },
          lab: {
            enabled: true,
            path: "/labs",
            requireAuthInProduction: true,
            openLocalWithoutAuth: true,
          },
        } as never,
      });
      if (!handled) {
        res.writeHead(404);
        res.end();
      }
    });

    port = await listenOnEphemeralPort(server);
    const publicHeaders = {
      Host: `127.0.0.1:${port}`,
      "X-Forwarded-Host": "preview.example.test",
      "Content-Type": "application/json",
    };

    const boot = await fetch(`http://127.0.0.1:${port}/api/dna/labs/bootstrap`, {
      headers: publicHeaders,
    });
    const bootstrap = (await boot.json()) as { localMode: boolean; authenticated: boolean };
    expect(bootstrap.localMode).toBe(false);
    expect(bootstrap.authenticated).toBe(false);

    const data = await fetch(`http://127.0.0.1:${port}/api/dna/labs/data`, {
      headers: publicHeaders,
    });
    expect(data.status).toBe(401);

    const otp = await fetch(`http://127.0.0.1:${port}/api/dna/labs/auth/otp`, {
      method: "POST",
      headers: publicHeaders,
      body: JSON.stringify({ email: "person@example.test", purpose: "register" }),
    });
    expect(otp.status).toBe(200);
    const otpBody = (await otp.json()) as { devOtp?: string };
    expect(otpBody.devOtp).toBeUndefined();
  });

  it("rejects forged pairing callbacks and accepts a valid HMAC", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-callback-"));
    await ensureLabStore(root);
    const pairing = await initLocalPairing({
      root,
      productionUrl: "https://example.test",
      projectId: "test",
      callbackPort: 9473,
    });

    server = createServer(async (req, res) => {
      await handleLabRequest(req, res, {
        root,
        config: {
          lab: {
            enabled: true,
            path: "/labs",
            requireAuthInProduction: true,
            openLocalWithoutAuth: true,
          },
        } as never,
      });
    });
    port = await listenOnEphemeralPort(server);

    const callbackBody = { pairingId: pairing.pairingId, verified: true };
    const callbackUrl = `http://127.0.0.1:${port}/api/dna/labs/pairing/callback`;
    const forged = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(callbackBody),
    });
    expect(forged.status).toBe(401);

    const valid = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DNA-Lab-Signature": signPairingCallback(pairing.codeHash, callbackBody),
      },
      body: JSON.stringify(callbackBody),
    });
    expect(valid.status).toBe(200);
  });
});
