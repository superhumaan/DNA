import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { DNA_LAB_API_PREFIX } from "@superhumaan/dna-config";
import {
  LAB_OPERATIONS,
  collectLabApis,
  labOperationKeys,
} from "./collect-apis.js";

const P = DNA_LAB_API_PREFIX;

/** Routes handled in lab/server.ts — keep in sync when adding Lab endpoints. */
const EXPECTED_LAB_KEYS = [
  `GET ${P}/apis`,
  `GET ${P}/bootstrap`,
  `GET ${P}/client.js`,
  `GET ${P}/coverage`,
  `GET ${P}/data`,
  `GET ${P}/health`,
  `GET ${P}/installs`,
  `GET ${P}/intelligence`,
  `GET ${P}/issues/:issueId/events`,
  `GET ${P}/pairing/status/:pairingId`,
  `GET ${P}/probe`,
  `GET ${P}/releases`,
  `GET ${P}/styles.css`,
  `POST ${P}/auth/login`,
  `POST ${P}/auth/logout`,
  `POST ${P}/auth/otp`,
  `POST ${P}/auth/register`,
  `POST ${P}/pairing/callback`,
  `POST ${P}/pairing/init`,
  `POST ${P}/pairing/verify`,
  `POST ${P}/releases`,
  `POST ${P}/sourcemaps`,
].sort();

describe("collect-apis Lab catalog", () => {
  it("documents every Lab HTTP route with description, usage, received, sent", () => {
    expect(labOperationKeys()).toEqual(EXPECTED_LAB_KEYS);
    for (const op of LAB_OPERATIONS) {
      expect(op.description?.trim().length, `${op.method} ${op.path} description`).toBeGreaterThan(10);
      expect(op.usage?.trim().length, `${op.method} ${op.path} usage`).toBeGreaterThan(10);
      expect(op.received?.trim().length, `${op.method} ${op.path} received`).toBeGreaterThan(3);
      expect(op.sent?.trim().length, `${op.method} ${op.path} sent`).toBeGreaterThan(5);
      expect(op.tags.length).toBeGreaterThan(0);
      expect(op.source).toBe("lab");
    }
  });

  it("collectLabApis returns Lab ops plus project OpenAPI fields when present", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-lab-apis-"));
    await writeFile(
      join(root, "openapi.json"),
      JSON.stringify({
        openapi: "3.0.3",
        info: { title: "App", version: "1" },
        paths: {
          "/api/widgets": {
            post: {
              summary: "Create widget",
              description: "Creates a widget for the current user.",
              tags: ["Widgets"],
              requestBody: {
                content: {
                  "application/json": {
                    example: { name: "Acme" },
                  },
                },
              },
              responses: {
                "201": {
                  description: "Created",
                  content: {
                    "application/json": { example: { id: "w1" } },
                  },
                },
              },
            },
          },
        },
      }),
      "utf8",
    );

    const payload = await collectLabApis(root);
    expect(payload.openapiSource).toBe("openapi.json");
    expect(payload.stats.operationCount).toBe(LAB_OPERATIONS.length + 1);
    expect(payload.operations.filter((o) => o.source === "lab")).toHaveLength(LAB_OPERATIONS.length);

    const widget = payload.operations.find((o) => o.path === "/api/widgets" && o.method === "POST");
    expect(widget).toBeTruthy();
    expect(widget?.description).toContain("Creates a widget");
    expect(widget?.received).toContain("Acme");
    expect(widget?.sent).toMatch(/201/);
    expect(widget?.usage).toContain("Widgets");

    const health = payload.operations.find((o) => o.path === `${P}/health`);
    expect(health?.received).toBeTruthy();
    expect(health?.sent).toContain("200");
  });

  it("collectLabApis works without project OpenAPI", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-lab-apis-empty-"));
    await mkdir(join(root, ".DNA"), { recursive: true });
    const payload = await collectLabApis(root);
    expect(payload.openapiSource).toBeNull();
    expect(payload.operations).toHaveLength(LAB_OPERATIONS.length);
    expect(payload.labSpec.paths[`${P}/health`]).toBeTruthy();
  });
});
