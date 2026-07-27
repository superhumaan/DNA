import { join } from "node:path";
import { writeFileEnsured, writeJsonFile } from "../fs.js";
import { syncAiInjection } from "../generators/ai-injector.js";
import { installPromptStemPackIds } from "../generators/prompt-stem-packs/index.js";
import { loadDnaConfig } from "../validator.js";
import type { PurposeCombo } from "./purpose-combos.js";
import { getPurposeCombo } from "./purpose-combos.js";

function bundleSlug(comboId: string): string {
  return comboId.replace(/^combo\//, "").replace(/[^a-z0-9-]+/gi, "-");
}

function buildBundleRule(combo: PurposeCombo): string {
  const stemList = combo.stems.map((id) => `- \`.DNA/stems/${id}/\` (slash if present)`).join("\n");
  const packList = [...combo.required, ...combo.preferred]
    .map((id) => `- \`.DNA/knowledge/\` pack \`${id}\``)
    .join("\n");

  return `---
description: DNA marketplace bundle ${combo.id} — purpose-aware co-pilot context
alwaysApply: true
---

# DNA Bundle: ${combo.purpose}

Installed via \`dna marketplace install ${combo.id}\`.

${combo.description}

## MUST

- Load linked prompt stem packs before related work:
${stemList}
- Prefer knowledge from these packs when answering:
${packList}
- Run \`npx dna\` for health, analyze, quality, and ship — do not invent CLI output
- Keep Feature Factory / agent-loop gates when building features

## NEVER

- Ignore installed bundle stems for in-scope work
- Invent pack contents that are not under \`.DNA/knowledge/\`
- Skip quality gates when shipping from this bundle's workflows

Install command: \`dna marketplace install ${combo.id}\`
Browse: https://dna.humaan.app/marketplace#bundles
`;
}

export interface PurposeComboAiInstallResult {
  stems: string[];
  stemPaths: string[];
  rulePaths: string[];
  injectionPaths: string[];
  skippedStems: string[];
}

/**
 * After a purpose combo's knowledge packs install: inject linked prompt stems,
 * always-on Cursor/Claude rules for the bundle, and refresh AI workbench injection
 * so the co-pilot knows the purpose.
 */
export async function installPurposeComboAiContext(
  root: string,
  comboId: string,
): Promise<PurposeComboAiInstallResult | null> {
  const combo = getPurposeCombo(comboId);
  if (!combo) return null;

  const config = await loadDnaConfig(root);
  if (!config) {
    return {
      stems: [],
      stemPaths: [],
      rulePaths: [],
      injectionPaths: [],
      skippedStems: [...combo.stems],
    };
  }

  const { paths: stemPaths, installed, skipped } = await installPromptStemPackIds(
    root,
    config,
    [...combo.stems],
  );

  const slug = bundleSlug(combo.id);
  const ruleBody = buildBundleRule(combo);
  const rulePaths = [`.cursor/rules/dna-bundle-${slug}.mdc`];
  for (const rel of rulePaths) {
    await writeFileEnsured(join(root, rel), ruleBody);
  }

  const behaviourRel = `.DNA/behaviour/bundles/${slug}.behaviour.md`;
  await writeFileEnsured(
    join(root, behaviourRel),
    `# Bundle behaviour — ${combo.purpose}\n\n${combo.description}\n\nSee Cursor rule \`dna-bundle-${slug}\` and stems under \`.DNA/stems/\`.\n`,
  );
  rulePaths.push(behaviourRel);

  const manifestPath = `.DNA/marketplace/bundles/${slug}.json`;
  await writeJsonFile(join(root, manifestPath), {
    id: combo.id,
    purpose: combo.purpose,
    description: combo.description,
    required: combo.required,
    preferred: combo.preferred,
    recommended: combo.recommended,
    stems: combo.stems,
    installedAt: new Date().toISOString(),
  });

  let injectionPaths: string[] = [];
  try {
    const injection = await syncAiInjection(root, config, {
      force: false,
      workbench: true,
      persistConfig: true,
      verify: false,
    });
    injectionPaths = injection.written;
  } catch {
    // Knowledge install succeeded; AI injection is best-effort (e.g. incomplete project).
  }

  return {
    stems: installed,
    stemPaths: [...stemPaths, manifestPath],
    rulePaths,
    injectionPaths,
    skippedStems: skipped,
  };
}
