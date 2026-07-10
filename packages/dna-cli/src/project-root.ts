import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

export function resolveProjectRoot(cwd?: string): string {
  const shellCwd = process.cwd();
  const root = resolve(cwd ?? shellCwd);

  if (!existsSync(root)) {
    if (cwd && existsSync(join(shellCwd, ".DNA"))) {
      throw new Error(
        `Project directory not found: ${cwd} (resolved: ${root})\n` +
          `Your shell is already in a DNA project at ${shellCwd}. Omit --cwd or use --cwd .`,
      );
    }
    throw new Error(
      `Project directory not found: ${cwd ?? shellCwd}\n` +
        `Run DNA from your project root (where .DNA/ lives), or pass an absolute --cwd path.`,
    );
  }

  if (!existsSync(join(root, ".DNA"))) {
    if (cwd && existsSync(join(shellCwd, ".DNA"))) {
      throw new Error(
        `No .DNA/ directory at ${root}.\n` +
          `Your shell is already in a DNA project at ${shellCwd}. Omit --cwd or use --cwd .`,
      );
    }
    throw new Error(`No .DNA/ directory at ${root}.\nRun \`dna init\` in that directory first.`);
  }

  return root;
}
