/**
 * DNA runtime preload — process-level hooks without patching entry files.
 * Wired automatically into package.json scripts when doctor cannot patch your server.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { dnaRuntime } from "./runtime.js";

const root = process.cwd();
let projectId = "app";
let githubEnabled = true;

try {
  const cfgPath = join(root, ".DNA", "config.dna.json");
  if (existsSync(cfgPath)) {
    const cfg = JSON.parse(readFileSync(cfgPath, "utf-8")) as {
      projectId?: string;
      projectName?: string;
      github?: { enabled?: boolean };
    };
    projectId = cfg.projectId ?? cfg.projectName ?? projectId;
    githubEnabled = cfg.github?.enabled ?? true;
  }
} catch {
  // use defaults
}

const g = globalThis as { __dnaRuntimePreload?: boolean };
if (!g.__dnaRuntimePreload) {
  g.__dnaRuntimePreload = true;
  dnaRuntime.start({
    projectId,
    projectRoot: root,
    environment: process.env.NODE_ENV ?? "development",
    release: process.env.GIT_SHA,
    github: { enabled: githubEnabled },
    aiRepair: { enabled: true },
  });
}
