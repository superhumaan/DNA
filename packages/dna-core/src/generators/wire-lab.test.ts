import { describe, expect, it } from "vitest";
import {
  findExpressLabMountIndex,
  wireExpressLabCjsContent,
  wireExpressLabContent,
  wireExpressLabEsmContent,
} from "./wire-lab.js";

const EXPRESS_CJS_WITH_CONFIGURE = `const express = require('express');
const { configureExpress } = require('./app/configureExpress');
const app = express();
configureExpress(app, { isVercel: false });
app.get('/api/live', (_req, res) => res.json({ ok: true }));
app.listen(3002);
`;

const EXPRESS_ESM = `import express from "express";
import { createServer } from "node:http";
const app = express();
app.get("/api/live", (_req, res) => res.json({ ok: true }));
createServer(app).listen(3002);
`;

describe("findExpressLabMountIndex", () => {
  it("prefers insertion after configureExpress", () => {
    const index = findExpressLabMountIndex(EXPRESS_CJS_WITH_CONFIGURE);
    expect(index).not.toBeNull();
    const before = EXPRESS_CJS_WITH_CONFIGURE.slice(0, index!);
    expect(before).toContain("configureExpress(app");
    expect(before).not.toContain("app.listen");
  });
});

describe("wireExpressLabCjsContent", () => {
  it("mounts dnaLabMiddleware via CJS bridge — never require() ESM lab export", () => {
    const wired = wireExpressLabCjsContent(
      EXPRESS_CJS_WITH_CONFIGURE,
      "colorparty",
      "../.DNA/lab/express-wire.cjs",
    );
    expect(wired).not.toBeNull();
    expect(wired).toContain('require("../.DNA/lab/express-wire.cjs")');
    expect(wired).toContain("dnaLabMiddleware()");
    expect(wired).not.toContain('require("@superhumaan/dna-by-humaan/lab")');
    expect(wired).not.toContain("createLabMiddleware(");

    const lines = wired!.split("\n");
    const configureLine = lines.findIndex((line) => /\bconfigureExpress\s*\(\s*app/.test(line));
    const mountLine = lines.findIndex((line) => line.includes(".use(dnaLabMiddleware"));
    const listenLine = lines.findIndex((line) => line.includes("app.listen"));
    expect(configureLine).toBeGreaterThanOrEqual(0);
    expect(mountLine).toBeGreaterThan(configureLine);
    expect(listenLine).toBeGreaterThan(mountLine);
  });

  it("is idempotent when already wired with dnaLabMiddleware", () => {
    const once = wireExpressLabCjsContent(
      EXPRESS_CJS_WITH_CONFIGURE,
      "colorparty",
      "../.DNA/lab/express-wire.cjs",
    );
    expect(wireExpressLabCjsContent(once!, "colorparty", "../.DNA/lab/express-wire.cjs")).toBeNull();
  });
});

describe("wireExpressLabEsmContent", () => {
  it("uses static ESM import for createLabMiddleware", () => {
    const wired = wireExpressLabEsmContent(EXPRESS_ESM, "demo");
    expect(wired).toContain('from "@superhumaan/dna-by-humaan/lab"');
    expect(wired).toContain("createLabMiddleware({");
  });
});

describe("wireExpressLabContent", () => {
  it("routes CJS entries to the bridge pattern", () => {
    const wired = wireExpressLabContent(EXPRESS_CJS_WITH_CONFIGURE, "colorparty");
    expect(wired).toContain("dnaLabMiddleware()");
    expect(wired).not.toContain('require("@superhumaan/dna-by-humaan/lab")');
  });
});
