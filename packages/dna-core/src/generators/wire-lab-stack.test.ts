import { describe, expect, it } from "vitest";
import {
  wireVercelJsonLabRewrites,
  wireVercelTsLabRewrites,
  wireViteLabProxyContent,
} from "./wire-lab-stack.js";

const VITE_WITH_API_PROXY = `export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: \`http://localhost:\${apiPort}\`,
        changeOrigin: true,
        timeout: 30_000,
      },
    },
  },
});
`;

const VERCEL_TS = `export const config = {
  rewrites: [
    routes.rewrite('/api/(.*)', \`\${resolveApiBaseUrl()}/api/$1\`),
    routes.rewrite('/(.*)', '/index.html'),
  ],
};
`;

describe("wireViteLabProxyContent", () => {
  it("adds /labs and /api/dna/labs proxies matching /api target", () => {
    const wired = wireViteLabProxyContent(VITE_WITH_API_PROXY);
    expect(wired).toContain("'/labs':");
    expect(wired).toContain("'/api/dna/labs':");
    expect(wired).toContain("http://localhost:${apiPort}");
    expect(wired).toContain("changeOrigin: true");
  });

  it("is idempotent", () => {
    const once = wireViteLabProxyContent(VITE_WITH_API_PROXY);
    expect(wireViteLabProxyContent(once!)).toBeNull();
  });
});

describe("wireVercelTsLabRewrites", () => {
  it("inserts lab rewrites before /api rewrite", () => {
    const wired = wireVercelTsLabRewrites(VERCEL_TS);
    expect(wired).toContain("dna-lab-rewrites");
    expect(wired).toContain("/api/dna/labs/(.*)");
    expect(wired).toContain("/labs");
    expect(wired!.indexOf("/api/dna/labs")).toBeLessThan(wired!.indexOf("'/api/(.*)'"));
  });
});

describe("wireVercelJsonLabRewrites", () => {
  it("prepends lab rewrites derived from api destination", () => {
    const raw = JSON.stringify({
      rewrites: [{ source: "/api/(.*)", destination: "https://api.example.com/api/$1" }],
    });
    const wired = wireVercelJsonLabRewrites(raw);
    const parsed = JSON.parse(wired!) as { rewrites: Array<{ source: string }> };
    expect(parsed.rewrites[0]?.source).toBe("/api/dna/labs/:path*");
    expect(parsed.rewrites.some((r) => r.source === "/labs")).toBe(true);
  });
});
