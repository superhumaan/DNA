import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { MARKETPLACE_API_VERSION } from "@humaan/dna-config";
import { getBundledCatalog, getBundledPack } from "@humaan/dna-core";

const PORT = Number(process.env.PORT ?? 3100);
const BASE_PATH = process.env.MARKETPLACE_BASE_PATH ?? "/marketplace";

type Channel = "stable" | "beta" | "nightly";

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=300",
  });
  res.end(JSON.stringify(body));
}

function parseUrl(req: IncomingMessage): URL {
  return new URL(req.url ?? "/", `http://localhost:${PORT}`);
}

function matchRoute(pathname: string): { route: string; params: Record<string, string> } | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const prefix = BASE_PATH.replace(/\/$/, "");

  const catalogPattern = new RegExp(`^${prefix}/api/${MARKETPLACE_API_VERSION}/catalog$`);
  const packPattern = new RegExp(`^${prefix}/api/${MARKETPLACE_API_VERSION}/packs/([^/]+)$`);

  if (catalogPattern.test(normalized)) {
    return { route: "catalog", params: {} };
  }

  const packMatch = normalized.match(packPattern);
  if (packMatch) {
    return { route: "pack", params: { packId: decodeURIComponent(packMatch[1] ?? "") } };
  }

  if (normalized === prefix || normalized === `${prefix}/`) {
    return { route: "index", params: {} };
  }

  return null;
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Accept",
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const url = parseUrl(req);
  const match = matchRoute(url.pathname);

  if (!match) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  if (match.route === "index") {
    sendJson(res, 200, {
      name: "DNA Knowledge Pack Marketplace",
      version: MARKETPLACE_API_VERSION,
      endpoints: {
        catalog: `${BASE_PATH}/api/${MARKETPLACE_API_VERSION}/catalog?channel=stable`,
        pack: `${BASE_PATH}/api/${MARKETPLACE_API_VERSION}/packs/{packId}`,
      },
      url: "https://dna.humaan.app/marketplace",
    });
    return;
  }

  if (match.route === "catalog") {
    const channel = (url.searchParams.get("channel") ?? "stable") as Channel;
    const catalog = getBundledCatalog(channel);
    sendJson(res, 200, { ...catalog, source: "remote" });
    return;
  }

  if (match.route === "pack") {
    const pack = getBundledPack(match.params.packId ?? "");
    if (!pack) {
      sendJson(res, 404, { error: `Pack not found: ${match.params.packId}` });
      return;
    }
    sendJson(res, 200, pack);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`DNA Marketplace API listening on http://localhost:${PORT}${BASE_PATH}`);
  console.log(`Catalog: http://localhost:${PORT}${BASE_PATH}/api/${MARKETPLACE_API_VERSION}/catalog`);
});
