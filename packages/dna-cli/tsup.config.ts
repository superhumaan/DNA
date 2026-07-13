import { defineConfig } from "tsup";

const bundle = {
  format: ["esm"] as const,
  dts: true,
  splitting: false,
  noExternal: [/^@superhumaan\//],
  external: ["express", "fastify", "@nestjs/common", "next"],
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
  {
    ...bundle,
    entry: ["src/lab.ts"],
  },
]);
