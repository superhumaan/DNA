import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { generateDeliveryPipelineRule } from "./delivery-pipeline.js";

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
  const factoryBlock = featureFactory
    ? `
## Feature factory (automatic)

When the user describes what they want to build, add, enable, or change — in plain language — **start the feature factory immediately**. Examples:
- "I want providers to record phone calls and transcribe notes"
- "Add an admin dashboard" / "backoffice for support"

**Admin / backoffice:** scaffold \`/admin\` in a **new tab**, RBAC-wrapped link (hidden without access), route guards, and \`requireAdmin\` APIs — see \`.cursor/rules/admin-portal.mdc\`.

**Never** ask the user to copy prompts, fill templates, or run setup commands.

### On every feature request, automatically:

1. Write or update \`ai/feature-request.md\` from their message (use \`buildFeatureRequestFromQuote\` sections)
2. Read \`ai/agent-loop.md\` and work role by role: Product Analyst → Solution Architect → … → Final Reviewer
3. Produce an implementation plan **before** editing code
4. **Stop after the Solution Architect plan and wait for approval**
5. After approval, implement through Backend → Frontend → UX → QA → Code Quality → Refactor → Final Review

Load DNA context from \`.DNA/knowledge/\`, \`.DNA/behaviour/\`, and \`DNA/Impressions/\` throughout.
Run \`dna quality report --feature\` before marking a feature complete — local SonarQube-style gate, no SonarQube server required.
Close every feature with \`dna docker build\` then \`dna github push\`. GitHub auth is browser-based from \`dna init\` — no manual tokens.
`
    : "";

  const preamble = `# DNA by Humaan — AI Instructions

Project: **${config.projectName}**
${config.description ?? ""}

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

## DNA Workbench (default)

DNA installs **prompt-first** Cursor/Claude packages on init and update:

- \`.cursor/rules/dna-workbench.mdc\` — always-on co-pilot rules
- \`.cursor/skills/dna-workbench/\` — session flows and prompt patterns
- Slash prompts: \`/work-with-dna\`, \`/ship-feature\`, \`/analyze-project\`, \`/health-check\`, \`/quality-gate\`, etc.

The user works in plain language inside Cursor. You run DNA CLI and load \`.DNA/\` context on their behalf.

Optional CLI slash catalog: \`npx dna commands install\` · https://dna.humaan.app/intelligence
Remove workbench: \`npx dna workbench uninstall\``;

  for (const tool of answers.aiTools) {
    switch (tool) {
      case "cursor":
        files[".cursor/rules/dna.mdc"] = `${mdcRule("DNA by Humaan — auto feature factory and project intelligence", true)}${preamble}`;
        files[".cursor/rules/delivery-pipeline.mdc"] = generateDeliveryPipelineRule(config);
        break;
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

  return files;
}
