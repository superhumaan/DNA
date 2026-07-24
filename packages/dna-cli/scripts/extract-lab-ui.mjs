#!/usr/bin/env node
/**
 * Extract Lab UI client/CSS from source into dna-cli/dist/lab-ui/
 * so Lab can re-read assets from disk after npm upgrades without relying
 * solely on in-memory bundle strings.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dnaCoreSrc = join(here, "..", "..", "dna-core", "src", "lab", "ui");
const outDir = join(here, "..", "dist", "lab-ui");

function extractExport(filePath, exportName) {
  const src = readFileSync(filePath, "utf8");
  const marker = `export const ${exportName} = \``;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName} in ${filePath}`);
  const contentStart = start + marker.length;
  const end = src.indexOf("`\n;", contentStart);
  const endAlt = src.indexOf("`;\n", contentStart);
  const close = end >= 0 ? end : endAlt;
  if (close < 0) throw new Error(`Unclosed template for ${exportName} in ${filePath}`);
  return src.slice(contentStart, close);
}

const client = extractExport(join(dnaCoreSrc, "dashboard.ts"), "LAB_CLIENT_JS");
const css = extractExport(join(dnaCoreSrc, "styles.ts"), "LAB_CSS");

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "client.js"), client, "utf8");
writeFileSync(join(outDir, "styles.css"), css, "utf8");
console.log(`Wrote lab-ui assets → ${outDir} (js ${client.length}b, css ${css.length}b)`);
