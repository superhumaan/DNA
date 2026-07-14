import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, afterEach } from "vitest";
import { handleLabRequest, LAB_DOCUMENT_CSP } from "./server.js";
import { ensureLabStore } from "./storage.js";

describe("lab server", () => {
  let root = "";
  let port = 0;
  let server: ReturnType<typeof createServer> | null = null;

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
    }
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("serves bootstrap in local mode without auth", async () => {
    root = await mkdtemp(join(tmpdir(), "dna-lab-srv-"));
    await ensureLabStore(root);
    port = 3400 + Math.floor(Math.random() * 200);

    server = createServer(async (req, res) => {
      const handled = await handleLabRequest(req, res, { root, config: { lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true } } as never });
      if (!handled) {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => server!.listen(port, "127.0.0.1", resolve));

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
  });
});
