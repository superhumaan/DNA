import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    splitting: false,
  },
  {
    entry: {
      "bundled-catalog-build": "src/marketplace/bundled-catalog-build.ts",
      "intelligence-catalog-build": "src/generators/intelligence-catalog-build.ts",
    },
    outDir: "dist/catalog-build",
    format: ["esm"],
    dts: false,
    splitting: false,
  },
]);
