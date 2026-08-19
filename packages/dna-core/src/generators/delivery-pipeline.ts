import type { DnaConfig } from "@superhumaan/dna-config";
import { resolveGitBranchingStrategy, resolveProjectGitIdentity } from "@superhumaan/dna-config";

function mdcFrontmatter(description: string): string {
  return `---
description: ${description}
alwaysApply: true
---

`;
}

export function generateDeliveryPipelineRule(config: DnaConfig): string {
  const threshold = config.ci?.coverageThreshold ?? 80;
  const identity = resolveProjectGitIdentity(config);
  const strategy = resolveGitBranchingStrategy(config);
  const trunkMode = strategy === "trunk";

  return `${mdcFrontmatter("DNA delivery pipeline — trunk ship, bug loop, factory, CI gates on every push")}# DNA Delivery Pipeline (mandatory)

You are working on **${config.projectName}**. DNA never misses a beat — follow this pipeline on **every change**.

## 1. Ship on trunk (default)

After local gates pass:
1. Commit with a clear message using \`[${identity.tag}] type(scope): summary\`
2. **Push the current line of work** — default is trunk (\`main\`/\`master\` or the one branch the user already chose)
3. Never invent \`feature/*\` remotes, dual-track WIP, or hop branches "to test on preview"
${
  trunkMode
    ? "4. Branching strategy is **trunk** — dna github push stays on the current branch (no auto feature hop)\n"
    : "4. Branching strategy is **feature-branch** — short-lived feature/* allowed only when already in that mode or user opts in\n"
}
Opt out of trunk only via \`"git": { "branchingStrategy": "feature-branch" }\` in \`.DNA/config.dna.json\`.

## 2. Bug loop (automatic)

When runtime, tests, or CI surface a bug:
1. **Create a bug report** — GitHub issue (DNA auto-creates for high/critical runtime errors)
2. **Fix the root cause** — load \`.DNA/behaviour/\`, \`.DNA/CellularMemory/\`, relevant knowledge
3. **Retest** — \`npm test\`, \`npm run test:coverage\`, \`dna quality report --feature\`
4. **Re-push the same line of work** and confirm CI is green
5. If AI repair opened a PR — review it, never auto-merge

Runtime watches **backend and frontend** by default. Errors land in \`.DNA/data/runtime.db\`.

## 3. Feature factory (every feature)

For any user request to build, add, or change:
1. Update \`ai/feature-request.md\` from their message
2. Run \`ai/agent-loop.md\` roles in order — plan first, wait for approval
3. Implement → QA → Code Quality → Final Review

## 4. Agent must not decide their own fate

- Do **not** invent preview remotes, slogans under page headers, or parallel architectures
- Match existing patterns, copy, components, and layout from the repo
- Load CellularMemory (recent-changes, previous-solutions, blockers) before building so work is not repeated
- \`/ship-preview\` only when the user explicitly asks — never as a recovery strategy for dual-tracked branches

## 5. CI quality gates (every push)

**Default (public / OSS):** DNA CI is **advisory** — workflows report lint, test, coverage, and SAST findings but **never fail the GitHub Actions run**. Set \`"ci": { "strict": true }\` in \`.DNA/config.dna.json\` to enforce blocking gates.

**Local:** \`.DNA/hooks/pre-push\` runs \`dna quality report\` before every \`git push\` (advisory by default — never blocks push).

**Remote:** CI (\`.github/workflows/dna-ci.yml\`) runs on **every push**:
| Gate | Advisory (default) | Strict (\`ci.strict: true\`) |
|------|-------------------|------------------------------|
| Lint + typecheck | Report | Must pass |
| Unit tests | Report | Must pass |
| Code coverage | Report (${threshold}% target) | **${threshold}% per file AND overall** |
| OWASP dependency audit | Report | high+ vulnerabilities block |
| DNA SAST quality scan | Report | blocker/critical = fail |
| Docker build | Report | Must pass when Dockerfile present |

Before pushing, run locally (or let the pre-push hook run it):
\`\`\`bash
dna quality report && dna docker build
\`\`\`

Then push:
\`\`\`bash
dna github push --message "[${identity.tag}] feat: <what you built>"
\`\`\`

GitHub permissions are granted once during \`dna init\` via browser login — no manual tokens.

## 6. Keep DNA current

- \`dna doctor\` — ensures scaffolding, packs, runtime DB, CI, and AI repair are enabled
- \`dna update\` — pull latest knowledge packs
- Update CellularMemory and Impressions when architecture changes

**Opt out** only via \`.DNA/config.dna.json\` — defaults are ON.
`;
}

export function generateDeliveryWorkflow(threshold = 80): string {
  return `# Delivery Pipeline Workflow

## On every change

1. Implement with feature factory roles
2. Local gates: lint, test, coverage >= ${threshold}%, \`dna quality report --feature\`, \`dna docker build\`
3. \`dna github push\` — **current trunk / user-chosen branch** (default: no auto \`feature/*\` hop)
4. CI runs DNA CI (+ preview workflows when hosting supports them) on that push
5. Fix any failures — bug loop until green on the **same** line of work

## Never

- Invent parallel remotes or hop branches to "test on preview"
- Dual-track the same feature across multiple feature branches

## On runtime error

1. Classified in \`.DNA/data/runtime.db\`
2. GitHub issue (if high/critical)
3. AI repair drafts PR (if enabled + API key)
4. Human review → merge → redeploy
`;
}
