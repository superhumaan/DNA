import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { generateDeliveryPipelineRule } from "./delivery-pipeline.js";
import {
  buildAgentsMd,
  buildClaudeWorkbenchSection,
  buildCursorWorkbenchSection,
  DNA_AGENT_FLOW_SECTION,
  DNA_ALWAYS_ON_SECTION,
  DNA_INTENT_ROUTING_SECTION,
} from "./dna-default-on.js";

function mdcRule(description: string, alwaysApply = false): string {
  const lines = [`description: ${description}`];
  if (alwaysApply) {
    lines.push("alwaysApply: true");
  } else {
    lines.push('globs: ["**/*"]');
  }
  return `---\n${lines.join("\n")}\n---\n\n`;
}

export function generateAiToolFiles(
  config: DnaConfig,
  answers: WizardAnswers,
  featureFactory = false,
): Record<string, string> {
  const files: Record<string, string> = {};
  const factoryBlock = featureFactory ? `\n${DNA_AGENT_FLOW_SECTION}\n` : "";

  const preamble = `# DNA by Humaan — AI Instructions

Project: **${config.projectName}**
${config.description ?? ""}

${DNA_ALWAYS_ON_SECTION}

${DNA_INTENT_ROUTING_SECTION}

## Default behaviour

The user describes goals in plain language. You are their co-pilot: **run \`npx dna\` commands in shell**, load DNA context, plan, and implement. **Do not** ask them to copy prompts, manage \`.DNA/\` files, or memorize CLI syntax.

When their intent matches DNA (health, analysis, features, compliance, quality, ship) — **execute DNA yourself** and summarize results in plain English.

Before building:

1. Read \`.DNA/neuralNetwork.json\`
2. Load relevant \`.DNA/knowledge/\` packs
3. Read relevant \`.DNA/behaviour/\` files
4. Check \`.DNA/CellularMemory/\` and \`DNA/Impressions/\`

## CI & quality gates (every push — mandatory)

DNA scaffolds \`.github/workflows/dna-ci.yml\`, \`dna-preview.yml\`, and \`.DNA/hooks/pre-push\` (runs \`dna quality report\` on every \`git push\`).
| Gate | Requirement |
|------|-------------|
| Push to preview | **Always** after local gates pass |
| Coverage | **80% per file AND overall** |
| OWASP | Dependency audit on every push |
| SAST | \`dna quality report --feature\` must PASS |

**Bug loop:** runtime error → GitHub issue → fix → retest → re-push → CI green → feature factory review.

Before marking work complete: \`npm run lint && npm run test:coverage && dna quality report --feature\`
${factoryBlock}`;

  const claudePreamble = `${preamble}

Run \`dna context <target>\` when you need focused domain knowledge.

${buildClaudeWorkbenchSection()}`;

  for (const tool of answers.aiTools) {
    switch (tool) {
      case "cursor": {
        const cursorPreamble = `${preamble}

${buildCursorWorkbenchSection()}`;
        files[".cursor/rules/dna.mdc"] = `${mdcRule("DNA by Humaan — auto feature factory and project intelligence", true)}${cursorPreamble}`;
        files[".cursor/rules/delivery-pipeline.mdc"] = generateDeliveryPipelineRule(config);
        break;
      }
      case "claude_code":
        files["CLAUDE.md"] = claudePreamble;
        break;
      case "chatgpt":
        files[".dna-chatgpt-context.md"] = claudePreamble;
        break;
      case "github_copilot":
        files[".github/copilot-instructions.md"] = claudePreamble;
        break;
      case "windsurf":
        files[".windsurfrules"] = claudePreamble;
        break;
      case "gemini":
        files["GEMINI.md"] = claudePreamble;
        break;
      case "multiple":
        files[".cursor/rules/dna.mdc"] = `${mdcRule("DNA by Humaan", true)}${preamble}`;
        files["CLAUDE.md"] = claudePreamble;
        files[".github/copilot-instructions.md"] = claudePreamble;
        break;
    }
  }

  if (answers.aiTools.length === 0 || featureFactory) {
    files[".cursor/rules/dna.mdc"] ??= `${mdcRule("DNA by Humaan", true)}${preamble}`;
    files[".cursor/rules/delivery-pipeline.mdc"] ??= generateDeliveryPipelineRule(config);
    files["CLAUDE.md"] ??= claudePreamble;
  }

  files["AGENTS.md"] ??= buildAgentsMd(config.projectName);

  return files;
}
