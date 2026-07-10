import { defineConfig } from "tsup";

const bundle = {
  format: ["esm"] as const,
  dts: true,
  splitting: false,
  // Bundle monorepo packages only; leave npm deps external so CJS packages
  // (commander, simple-git, etc.) can use Node's native require at runtime.
  noExternal: [/^@superhumaan\//],
  skipNodeModulesBundle: true,
  external: ["fsevents", "express", "fastify", "@nestjs/common", "next"],
};

export default defineConfig([
  {
    ...bundle,
    entry: ["src/index.ts"],
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    ...bundle,
    entry: ["src/runtime.ts"],
  },
  {
    ...bundle,
    entry: ["src/runtime-preload.ts"],
  },
]);
