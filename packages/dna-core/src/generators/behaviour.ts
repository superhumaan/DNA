import type { DnaConfig } from "@superhumaan/dna-config";
import { getArchetype } from "../stack/catalog.js";
import { deliveryBehaviourMarkdown } from "../delivery/behaviour.js";
import { discoveryBehaviourMarkdown } from "../discovery/behaviour.js";
import { reasoningBehaviourMarkdown } from "./dna-reasoning.js";

const SHARED_PREAMBLE = `<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

`;

function aiBehaviour(config: DnaConfig): string {
  return `${SHARED_PREAMBLE}# AI Behaviour

Before designing, building, testing, or documenting features:

0. Read \`.DNA/behaviour/reasoning.behaviour.md\` — system-wide critical thinking, debugging, pattern recognition (mandatory)
1. Read \`.DNA/neuralNetwork.json\`
2. Load relevant knowledge from \`.DNA/knowledge/\`
3. Read relevant Behaviour files from \`.DNA/behaviour/\`
4. Check \`.DNA/CellularMemory/\` for project-specific context
5. Check existing \`DNA/Impressions/\` documentation
6. Do not guess project architecture — use DNA knowledge
7. Do not introduce unapproved patterns
8. Do not add dependencies without checking DNA knowledge
9. Do not bypass existing API clients
10. Do not duplicate components
11. Do not ignore testing rules
12. Do not ignore security rules
13. **Always push to preview** after local gates pass — never leave work un-deployed
14. **On bugs:** create issue → fix → retest → re-push → confirm CI green
15. **Before every push:** lint, test, ${config.ci?.coverageThreshold ?? 80}% coverage, \`dna quality report --feature\`
16. Run feature factory roles for every user-facing change

After completing work:

1. Validate against Behaviour using \`dna validate\`
2. Update relevant CellularMemory files
3. Suggest Impressions updates when architecture or behaviour changes
4. Report unfinished business in prefrontalCortex/next-actions.md
5. Recommend tests for new or changed behaviour
6. Never directly rewrite protected DNA files unless explicitly requested

## Project Context

- **Project:** ${config.projectName}
- **Description:** ${config.description ?? "Not specified"}
- **Stage:** ${config.stage}
- **AI Tools:** ${config.aiTools.join(", ") || "none"}
`;
}

function codingBehaviour(config: DnaConfig): string {
  const archetype = config.stack.archetype ? getArchetype(config.stack.archetype) : undefined;
  const excludeLine = archetype?.excludes.length
    ? `\n## Stack archetype: ${archetype.name} (\`${config.stack.archetype}\`)\n\n**Do NOT add these technologies to this project:** ${archetype.excludes.join(", ")}\n\n${archetype.description}\n`
    : "";

  return `${SHARED_PREAMBLE}# Coding Behaviour

## Stack

- Archetype: ${config.stack.archetype ?? "not set"}
- Frontend: ${config.stack.frontend ?? "not set"}
- Bundler: ${config.stack.bundler ?? "not set"}
- Backend: ${config.stack.backend ?? "not set"}
- Database: ${config.stack.database ?? "not set"}
- Package manager: ${config.stack.packageManager ?? "not set"}
${excludeLine}
## Rules

- Follow the approved stack archetype — do not mix excluded frameworks
- If a feature requires a different archetype, say so and propose \`dna stack recommend\` before adding dependencies
- Follow existing code conventions in the repository
- Use TypeScript strict mode where applicable
- Prefer composition over inheritance
- Keep functions small and focused
- Add types for all public APIs
- Do not add dependencies without justification
- Do not duplicate existing utilities or components
- Do not bypass established API client patterns
`;
}

function testingBehaviour(config: DnaConfig): string {
  return `${SHARED_PREAMBLE}# Testing Behaviour

## Framework

Primary test framework: ${config.stack.testing ?? "vitest"}

## Coverage (DNA default)

- Minimum thresholds: **${config.ci?.coverageThreshold ?? 80}%** per file AND overall (lines, branches, functions, statements)
- Enforced via \`npm run test:coverage\` locally and in \`.github/workflows/dna-ci.yml\`
- OWASP dependency audit runs on every push

## Rules

- Write tests for all new features and bug fixes
- Include unit tests for business logic
- Include integration tests for API endpoints
- Name test files with .test.ts or .spec.ts convention
- Tests must pass before creating a PR — CI blocks merge on failure
- Run \`dna quality report --feature\` before marking features complete
- Document regression risks in DNA/Impressions/qa/regression-risks.md
`;
}

function documentationBehaviour(config: DnaConfig): string {
  return `${SHARED_PREAMBLE}# Documentation Behaviour

## Rules

- Keep DNA/Impressions/ documentation current with code changes
- Update architecture docs when system boundaries change
- Document API changes in relevant Impressions files
- Use clear, accessible language for human-facing docs
- Do not overwrite Impressions without reviewing existing content
- Suggest updates rather than silently rewriting protected docs
- Before writing tickets or specs, read \`delivery.behaviour.md\` and run \`dna context methodology\`

## Project

${config.description ?? config.projectName}
`;
}

function securityBehaviour(config: DnaConfig): string {
  return `${SHARED_PREAMBLE}# Security Behaviour

## Compliance

Compliance level: ${config.compliance}

## Rules

- Never commit secrets, tokens, or credentials
- Use environment variables for sensitive configuration
- Maintain .env.example with all required variables (no real values)
- Validate and sanitize all user input
- Apply authentication and authorization checks on protected endpoints
- **RBAC:** enforce permissions on API, routes, menus, notifications, and actions — not API alone
- **Default deny:** users have no access until an admin grants a role
- **Zero trust:** never trust UI hiding alone; verify every request server-side
- Before RBAC work: run \`dna plan rbac\` and follow \`.DNA/workflows/rbac.workflow.md\`
- Before processing personal, health, or payment data: run \`dna plan compliance\` and follow tier + framework knowledge
- Before banking, healthcare, cross-border, or jurisdiction-specific features: run \`dna legal advise\` and follow \`.DNA/workflows/legal.workflow.md\`
- Compliance tier: infer from project stage or set via \`dna plan compliance --tier startup|sme|corporate|enterprise\`
- Complete Phase 6 verification checklist before marking RBAC done
- Redact sensitive data in logs and error reports
- Review dependencies for known vulnerabilities
- CI runs the package-manager-native audit command (\`pnpm audit\`, \`yarn audit\`, or \`npm audit\`) and optional OWASP ZAP baseline — see \`.github/workflows/dna-security.yml\`
- Follow OWASP ASVS L1 checklist in \`.DNA/knowledge/testing/owasp-zap/\` for DAST setup
`;
}

function runtimeBehaviour(config: DnaConfig): string {
  return `${SHARED_PREAMBLE}# Runtime Behaviour

## Runtime Status

Runtime enabled: ${config.runtime?.enabled ? "yes" : "no"}
Backend watching: ${config.runtime?.watchBackend !== false ? "yes" : "no"}
Frontend watching: ${config.runtime?.watchFrontend !== false ? "yes" : "no"}
Storage: ${config.runtime?.storage ?? "json"} (atomic JSON; compatibility filename \`.DNA/data/runtime.db\`)
AI repair: ${config.ai?.repair?.enabled !== false ? "yes" : "no"}

## Rules

- All production errors must be captured by DNA runtime (backend + frontend)
- Runtime issues are stored in \`.DNA/data/runtime.db\` (not JSONL)
- Runtime issues are classified by the Immune System
- GitHub issues are created for high/critical severity issues
- AI repair creates PRs but never auto-merges
- **Bug loop:** issue → fix → retest → push preview → CI green
- Never deploy fixes without human approval
- Update CellularMemory amygdala/repeated-failures.md for recurring issues
`;
}

export function generateBehaviourFiles(config: DnaConfig): Record<string, string> {
  return {
    "reasoning.behaviour.md": reasoningBehaviourMarkdown(),
    "ai.behaviour.md": aiBehaviour(config),
    "coding.behaviour.md": codingBehaviour(config),
    "testing.behaviour.md": testingBehaviour(config),
    "documentation.behaviour.md": documentationBehaviour(config),
    "delivery.behaviour.md": deliveryBehaviourMarkdown(config),
    "discovery.behaviour.md": discoveryBehaviourMarkdown(config),
    "security.behaviour.md": securityBehaviour(config),
    "runtime.behaviour.md": runtimeBehaviour(config),
  };
}
