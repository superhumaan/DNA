/** Shared copy: DNA is the default co-pilot — never wait for user opt-in. */
import { DNA_CRITICAL_THINKING_SECTION } from "./dna-reasoning.js";

export { DNA_CRITICAL_THINKING_SECTION };
export const DNA_ALWAYS_ON_SECTION = `## DNA is always on (never opt-in)

This project has DNA installed. **Every session, every message** — DNA is your default co-pilot.

- **Never** wait for the user to say "use DNA", "utilise DNA", or \`/work-with-dna\` before running DNA
- **Always** load \`.DNA/\` context and run \`npx dna\` when their intent matches health, analysis, features, compliance, quality, or ship
- The user speaks in plain language; you execute DNA — they do not run CLI commands or copy prompts
- Slash commands like \`/work-with-dna\` are optional shortcuts — not a prerequisite for DNA-aware behaviour
`;

/** Classify every message before acting — engineering work uses the full agent loop. */
export const DNA_INTENT_ROUTING_SECTION = `## Intent routing (every message)

**First step on every message:** classify intent, then follow the matching path. Do not skip classification.

| Intent | User signals | Path |
|--------|--------------|------|
| **Engineering work** | build, add, fix, change, enable, refactor, implement, wire up, scaffold | **Full 9-role agent loop** (below) — mandatory |
| **Analysis** | analyze, audit, gaps, understand repo, doctor, health, scan | \`npx dna analyze\` / \`doctor\` / \`scan\` — summarize; propose next steps |
| **Compliance / legal** | GDPR, HIPAA, PDPA, SOC2, legal advise, regulated data | \`npx dna plan compliance\` or \`legal advise\` — plan before code |
| **Ship / done** | push, ship, release, merge, deploy | Quality PASS → \`npx dna docker build\` → \`npx dna github push\` |
| **Q&A / explain** | what does X do, how does Y work, explain this file | Load DNA context; answer directly — **no** 9-role loop |
| **Debug** | error, bug, crash, production issue, failing test | Read \`reasoning.behaviour.md\` → OODA + scientific debug → runtime DB / \`npx dna lab serve\` → fix → test → quality → push |

If intent is ambiguous between Q&A and engineering work, ask **one** clarifying question. If they want a change, use the agent loop.
`;

/** Mandatory feature-factory flow for all engineering work. */
export const DNA_AGENT_FLOW_SECTION = `## Agent flow (mandatory for engineering work)

Every **build, add, enable, fix, or change** request MUST go through the DNA feature factory. **No shortcuts. No jumping straight to code.**

### Authority chain (read before acting)

1. \`AGENTS.md\` — intent routing and gates
2. \`.DNA/behaviour/reasoning.behaviour.md\` — system-wide critical thinking (mandatory)
3. \`.cursor/rules/product-process.mdc\` — factory triggers and role rules
4. \`ai/agent-loop.md\` — full 9-role playbook
5. \`ai/feature-request.md\` — capture the user's ask **before** planning

### On every engineering request — automatically

1. **Write** \`ai/feature-request.md\` from their message (all sections — infer from context)
2. **Read** \`ai/agent-loop.md\` and execute each role **in order** — do not skip roles
3. **Product Analyst** → refine problem, users, acceptance criteria
4. **Solution Architect** → implementation plan (scope, files, API, risks)
5. **STOP — wait for user approval** before any code edits
6. After approval: **Backend** → **Frontend** → **UX** → **QA** → **Code Quality** → **Refactor** → **Final Release**
7. Close: \`npx dna quality report --feature\` PASS → \`npx dna docker build\` → \`npx dna github push\`

### The 9 roles (sequential — never skip)

1. Product Analyst
2. Solution Architect — **approval gate here**
3. Backend Engineer
4. Frontend Engineer
5. UX Reviewer
6. QA Engineer
7. Code Quality Analyst
8. Refactor Reviewer
9. Final Release Reviewer

### Hard gates

- **No code** until the Solution Architect plan is approved by the user
- **No role skipping** — every role reviews before ship
- **No complete** until \`npx dna quality report --feature\` PASS
- **No ship** until docker build succeeds and GitHub push completes
- **Never** ask the user to copy prompts or fill templates

**Admin / backoffice:** when user says admin, backoffice, or control panel — read \`.cursor/rules/admin-portal.mdc\`; scaffold \`/admin\` in a new tab with RBAC (see agent loop).
`;

export function buildClaudeWorkbenchSection(): string {
  return `## DNA Workbench (default — Claude Code)

DNA installs **prompt-first** packages on init and update:

- \`CLAUDE.md\` — always-on co-pilot instructions (this file)
- \`AGENTS.md\` — intent routing + agent flow gates
- \`.claude/skills/dna-workbench/\` — session flows and prompt patterns
- \`.claude/skills/dna-cli/\` — CLI routing and obedience
- Slash prompts: \`/work-with-dna\`, \`/ship-feature\`, \`/analyze-project\`, \`/agent-loop\`, \`/dna-doctor\`, etc.

The user works in plain language inside Claude Code. You run DNA CLI and load \`.DNA/\` context on their behalf.

Optional catalog: https://dna.humaan.app/intelligence · Regenerate: \`npx dna workbench install\`
Remove workbench: \`npx dna workbench uninstall\``;
}

export function buildCursorWorkbenchSection(): string {
  return `## DNA Workbench (default — Cursor)

DNA installs **prompt-first** packages on init and update:

- \`AGENTS.md\` — intent routing + agent flow gates
- \`.cursor/rules/dna-workbench.mdc\` — always-on co-pilot rules
- \`.cursor/rules/product-process.mdc\` — feature factory enforcement
- \`.cursor/skills/dna-workbench/\` — session flows and prompt patterns
- Slash prompts: \`/work-with-dna\`, \`/ship-feature\`, \`/analyze-project\`, \`/agent-loop\`, etc.

The user works in plain language inside Cursor. You run DNA CLI and load \`.DNA/\` context on their behalf.

Optional catalog: https://dna.humaan.app/intelligence · Regenerate: \`npx dna workbench install\`
Remove workbench: \`npx dna workbench uninstall\``;
}

export function buildAgentsMd(projectName: string): string {
  return `# Agent instructions — ${projectName}

This project uses **DNA by Humaan**. DNA is **always on** in Cursor and Claude Code — do not wait for the user to ask.

You are the engineering co-pilot:

- Run \`npx dna\` commands in shell when DNA applies (doctor, analyze, context, quality, ship)
- Load \`.DNA/neuralNetwork.json\`, behaviour, knowledge, and CellularMemory before building
- **Cursor:** \`.cursor/rules/dna-workbench.mdc\`, \`.cursor/rules/dna.mdc\`, \`.cursor/rules/product-process.mdc\`
- **Claude Code:** \`CLAUDE.md\`, \`.claude/skills/dna-workbench/SKILL.md\`

The user works in plain language. Never ask them to copy prompts or manage \`.DNA/\` files.

${DNA_CRITICAL_THINKING_SECTION}

${DNA_INTENT_ROUTING_SECTION}

${DNA_AGENT_FLOW_SECTION}
`;
}

export const DNA_CLI_SKILL_DESCRIPTION = `DNA by Humaan CLI — always-on default co-pilot. System-wide critical thinking on every message. Active when .DNA/ exists. Route engineering work through ai/agent-loop.md (9 roles). Obey reasoning.behaviour.md, dna commands, and /dna-* slash commands. Never wait for the user to say "use DNA".`;
