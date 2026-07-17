import { chmod } from "node:fs/promises";
import { join } from "node:path";
import { git } from "@superhumaan/dna-github";
import type { DnaConfig } from "@superhumaan/dna-config";
import { ensureDir, writeFileEnsured } from "../fs.js";

const DNA_CLI = "npx --yes @superhumaan/dna-by-humaan";

export function generatePrePushHook(strict = false): string {
  if (strict) {
    // Strict: the quality gate must pass. `--fail` makes the report exit
    // non-zero on a failing gate; without `|| true` the hook inherits that
    // status and Git aborts the push. Contributors can still bypass with
    // `git push --no-verify` when they intentionally need to.
    return `#!/bin/sh
# DNA pre-push hook — runs quality report on every git push (installed by dna init)
# Mode: strict (BLOCKS the push when the quality gate fails)

echo "🧬 DNA pre-push: running quality report (strict)..."

if ! ${DNA_CLI} quality report --fail; then
  echo "✗ DNA pre-push: quality gate FAILED — push blocked." >&2
  echo "  Fix the reported blocker/critical issues, or bypass with 'git push --no-verify'." >&2
  exit 1
fi

echo "✓ DNA pre-push: quality gate passed — pushing"
`;
  }

  // Advisory: report only, never block the push.
  return `#!/bin/sh
# DNA pre-push hook — runs quality report on every git push (installed by dna init)
# Mode: advisory (never blocks push)

echo "🧬 DNA pre-push: running quality report..."

${DNA_CLI} quality report || true

echo "✓ DNA pre-push complete — pushing"
`;
}

export async function installGitHooks(root: string, config?: DnaConfig): Promise<string[]> {
  const strict = config?.ci?.strict ?? false;
  const hooksDir = join(root, ".DNA", "hooks");
  const hookPath = join(hooksDir, "pre-push");
  const created: string[] = [];

  await ensureDir(hooksDir);
  await writeFileEnsured(hookPath, generatePrePushHook(strict));
  await chmod(hookPath, 0o755);
  created.push(".DNA/hooks/pre-push");

  try {
    const g = git(root);
    if (await g.checkIsRepo()) {
      const current = await g.getConfig("core.hooksPath");
      if (current.value !== ".DNA/hooks") {
        await g.addConfig("core.hooksPath", ".DNA/hooks", false, "local");
        created.push("git config core.hooksPath=.DNA/hooks");
      }
    }
  } catch {
    // not a git repo yet
  }

  return created;
}
