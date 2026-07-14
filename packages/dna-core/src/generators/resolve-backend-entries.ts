import { glob } from "../glob.js";

/** Standard server entry paths checked before monorepo discovery. */
export const BACKEND_ENTRY_CANDIDATES = [
  "src/index.ts",
  "src/server.ts",
  "src/main.ts",
  "src/app.ts",
  "index.ts",
  "server.ts",
  "main.ts",
  "app.ts",
  "backend/server.js",
  "backend/server.ts",
  "backend/src/index.ts",
  "backend/src/server.js",
];

const MONOREPO_ENTRY_GLOBS = [
  "apps/*/src/index.ts",
  "apps/*/src/server.ts",
  "apps/**/src/index.ts",
  "apps/**/src/server.ts",
  "packages/*/src/index.ts",
  "packages/*/src/server.ts",
];

const ENTRY_IGNORE = ["**/node_modules/**", "**/dist/**"];

/** Resolve Express/Fastify entry files — root paths first, then monorepo apps/packages. */
export async function resolveBackendEntryCandidates(root: string): Promise<string[]> {
  const seen = new Set<string>();
  const ordered: string[] = [];

  const add = (rel: string) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    ordered.push(rel);
  };

  for (const rel of BACKEND_ENTRY_CANDIDATES) add(rel);

  const discovered = await glob(MONOREPO_ENTRY_GLOBS, {
    cwd: root,
    onlyFiles: true,
    ignore: ENTRY_IGNORE,
  });
  for (const rel of discovered.sort()) add(rel);

  return ordered;
}
