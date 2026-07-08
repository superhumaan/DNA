import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { writeFileEnsured, writeJsonFile } from "./fs.js";
import { generateAiToolFiles } from "./generators/ai-tools.js";
import { installFeatureFactory } from "./generators/feature-factory.js";
import { installCiPipeline } from "./generators/ci.js";
import { installGitHooks } from "./generators/git-hooks.js";
import { installDockerScaffold } from "./generators/docker.js";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET, BROWSER_RUNTIME_SNIPPET } from "@superhumaan/dna-templates";

export async function runPostInit(
  root: string,
  config: DnaConfig,
  answers: WizardAnswers,
): Promise<string[]> {
  const created: string[] = [];

  for (const [relPath, content] of Object.entries(
    generateAiToolFiles(config, answers, answers.installFeatureFactory),
  )) {
    await writeFileEnsured(join(root, relPath), content);
    created.push(relPath);
  }

  if (answers.installFeatureFactory) {
    const factoryFiles = await installFeatureFactory(root, config);
    created.push(...factoryFiles);
  }

  if (answers.installCi ?? true) {
    const ci = await installCiPipeline({ root, config, skipIfExists: false });
    created.push(...ci.created);
    for (const skip of ci.skipped) {
      created.push(`(skipped: ${skip})`);
    }

    const hooks = await installGitHooks(root, config);
    created.push(...hooks);
  }

  const docker = await installDockerScaffold({ root, config });
  created.push(...docker.created);
  for (const skip of docker.skipped) {
    created.push(`(skipped docker: ${skip})`);
  }

  config.featureFactory = { enabled: answers.installFeatureFactory };
  config.runtime = {
    enabled: answers.installRuntime,
    storage: "sqlite",
    watchBackend: true,
    watchFrontend: true,
    environment: "development",
  };
  config.ai = {
    enabled: answers.configureAi,
    provider: "mock",
    repair: { enabled: true, autoPr: true, requireReview: true },
  };
  config.github = { enabled: answers.configureGithub };
  config.ci = {
    enabled: answers.installCi,
    strict: false,
    coverageThreshold: 80,
    perFileCoverage: true,
    owasp: true,
    pushToPreview: true,
  };
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, ".DNA", "config.dna.json"), config);
  created.push(
    `.DNA/config.dna.json (featureFactory ${answers.installFeatureFactory ? "enabled" : "disabled"})`,
  );

  if (answers.installRuntime) {
    await writeFileEnsured(
      join(root, ".DNA", "runtime", "install-snippet.ts"),
      RUNTIME_INSTALL_SNIPPET,
    );
    await writeFileEnsured(
      join(root, ".DNA", "runtime", "browser-client.ts"),
      BROWSER_RUNTIME_SNIPPET,
    );
    await writeFileEnsured(
      join(root, ".DNA", "runtime", "env.example.snippet"),
      ENV_EXAMPLE_SNIPPET,
    );
    created.push(".DNA/runtime/install-snippet.ts", ".DNA/runtime/browser-client.ts");

    const pkgPath = join(root, "package.json");
    try {
      const raw = await readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(raw) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = pkg.dependencies ?? {};
      if (!deps["@superhumaan/dna-by-humaan"]) {
        deps["@superhumaan/dna-by-humaan"] = "^0.3.1";
        pkg.dependencies = deps;
        await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
        created.push("package.json (added @superhumaan/dna-by-humaan)");
      }
    } catch {
      // no package.json
    }
  }

  if (answers.configureGithub) {
    created.push("GitHub: browser login runs during `dna init` (no manual token setup)");
  }

  if (answers.configureAi) {
    created.push("AI: run `dna ai connect --provider mock`");
  }

  return created;
}
