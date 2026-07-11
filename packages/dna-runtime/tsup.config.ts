import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  noExternal: [/^@superhumaan\//],
  external: ["express", "fastify", "@nestjs/common", "next"],
});
