import { defineConfig } from "tsup";

const bundle = {
  format: ["esm"] as const,
  dts: true,
  noExternal: [/.*/] as RegExp[],
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
]);
