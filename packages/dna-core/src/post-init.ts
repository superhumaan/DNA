import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, WizardAnswers } from "@humaan/dna-config";
import { writeFileEnsured } from "./fs.js";
import { generateAiToolFiles } from "./generators/ai-tools.js";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET } from "@humaan/dna-templates";

export async function runPostInit(
  root: string,
  config: DnaConfig,
  answers: WizardAnswers,
): Promise<string[]> {
  const created: string[] = [];

  for (const [relPath, content] of Object.entries(generateAiToolFiles(config, answers))) {
    await writeFileEnsured(join(root, relPath), content);
    created.push(relPath);
  }

  if (answers.installRuntime) {
    await writeFileEnsured(
      join(root, ".DNA", "runtime", "install-snippet.ts"),
      RUNTIME_INSTALL_SNIPPET,
    );
    await writeFileEnsured(
      join(root, ".DNA", "runtime", "env.example.snippet"),
      ENV_EXAMPLE_SNIPPET,
    );
    created.push(".DNA/runtime/install-snippet.ts");

    const pkgPath = join(root, "package.json");
    try {
      const raw = await readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(raw) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = pkg.dependencies ?? {};
      if (!deps["@humaan/dna-runtime"]) {
        deps["@humaan/dna-runtime"] = "workspace:*";
        pkg.dependencies = deps;
        await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
        created.push("package.json (added @humaan/dna-runtime)");
      }
    } catch {
      // no package.json
    }
  }

  if (answers.configureGithub) {
    created.push("GitHub: run `dna github connect --owner <org> --repo <repo>`");
  }

  if (answers.configureAi) {
    created.push("AI: run `dna ai connect --provider mock`");
  }

  return created;
}
