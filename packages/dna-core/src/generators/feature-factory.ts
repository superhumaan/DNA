import { unlink } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured } from "../fs.js";
import { slugifyFeature, runAndWriteQualityReport } from "../quality/analyze.js";
import { generateDeliveryPipelineRule } from "./delivery-pipeline.js";
import { generateAiToolFiles } from "./ai-tools.js";
import {
  isAdminPortalRequest,
  appendAdminPortalRequirements,
  adminPortalCursorRule,
  ADMIN_PORTAL_KNOWLEDGE_PATHS,
} from "../admin-portal/pattern.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { resolvePackIdsForKnowledgePaths } from "../marketplace/resolve.js";

export const FEATURE_FACTORY_PATHS = [
  ".cursor/rules/product-process.mdc",
  ".cursor/rules/architecture.mdc",
  ".cursor/rules/backend.mdc",
  ".cursor/rules/frontend.mdc",
  ".cursor/rules/ux.mdc",
  ".cursor/rules/qa.mdc",
  ".cursor/rules/code-quality.mdc",
  ".cursor/rules/delivery-pipeline.mdc",
  ".cursor/rules/admin-portal.mdc",
  "ai/feature-request.md",
  "ai/agent-loop.md",
  ".DNA/workflows/feature-factory.workflow.md",
  ".DNA/workflows/feature-quality.workflow.md",
  ".DNA/workflows/admin-portal.workflow.md",
] as const;

function mdcFrontmatter(description: string, alwaysApply = false): string {
  const lines = [`description: ${description}`];
  if (alwaysApply) {
    lines.push("alwaysApply: true");
  } else {
    lines.push('globs: ["**/*"]');
  }
  return `---\n${lines.join("\n")}\n---\n\n`;
}

export function buildFeatureRequestFromQuote(quote: string, config: DnaConfig): string {
  const trimmed = quote.trim();
  const now = new Date().toISOString();
  return `# Feature Request

_Auto-maintained by DNA. Updated ${now}. The user does not fill this in manually._

## Latest request

> ${trimmed}

## Problem

_To be refined by Product Analyst from the latest request._

## Current Pain

_To be refined by Product Analyst._

## Proposed Solution

_To be refined by Product Analyst and Solution Architect._

## Users

_To be identified by Product Analyst._

## Desired Behaviour

_To be defined by Product Analyst._

## Edge Cases

_To be identified by Product Analyst and QA._

## Success Criteria

The feature is only complete when:

- [ ] Backend works
- [ ] Frontend works
- [ ] UX is clean
- [ ] Permissions/security are correct
- [ ] Tests pass
- [ ] Local quality gate passes (\`dna quality report --feature\`)
- [ ] Docker image builds (\`dna docker build\`)
- [ ] Changes pushed to GitHub (\`dna github push\`)
- [ ] No unrelated files are modified
- [ ] Existing behaviour is not broken
- [ ] QA checklist is completed

---

**Project:** ${config.projectName}
`;
}

export async function beginFeatureFromQuote(
  root: string,
  config: DnaConfig,
  quote: string,
): Promise<string[]> {
  const written: string[] = [];
  let content = buildFeatureRequestFromQuote(quote, config);

  if (isAdminPortalRequest(quote)) {
    content = appendAdminPortalRequirements(content);
    const packIds = resolvePackIdsForKnowledgePaths([...ADMIN_PORTAL_KNOWLEDGE_PATHS]);
    const result = await ensureKnowledgeInstalled(root, packIds, config.channel);
    for (const packId of result.installed) {
      written.push(`.DNA/knowledge/ (admin pack: ${packId})`);
    }
  }

  const path = join(root, "ai/feature-request.md");
  await writeFileEnsured(path, content);
  written.push("ai/feature-request.md");

  const featureSlug = slugifyFeature(quote);
  try {
    const { reportPath } = await runAndWriteQualityReport(root, {
      projectName: config.projectName,
      featureSlug,
      featureScope: true,
      runToolchain: false,
    });
    written.push(reportPath);
  } catch {
    // Non-fatal — quality report is best-effort at feature start
  }

  return written;
}

export function generateFeatureFactoryFiles(config: DnaConfig): Record<string, string> {
  const project = config.projectName;

  return {
    ".cursor/rules/product-process.mdc": `${mdcFrontmatter("Auto feature factory — triggered by plain-language feature requests", true)}# Product Process

You are a full product engineering team inside **${project}**.

## Automatic trigger

When the user describes something they want to build, add, enable, fix, or change — **start the factory immediately**. No setup questions. No asking them to copy prompts.

Examples that trigger the factory:
- "I want providers to record phone calls and transcribe the notes"
- "Add billing with Stripe"
- "Build an admin portal" / "backoffice for moderators"

## Admin / backoffice (auto-pattern)

When the user says **admin**, **backoffice**, **admin panel**, or **control panel**:

1. Read \`.cursor/rules/admin-portal.mdc\` and \`.DNA/knowledge/platforms/dna/admin-portal.dna.md\`
2. Scaffold \`/admin\` as a **separate route tree** that opens in a **new tab** from the main app
3. **Wrap the admin link** — only users with admin access see it; everyone else sees nothing
4. **Guard routes** — \`/admin\` URLs must not work without admin access (no UI flash)
5. **Guard APIs** — \`requireAdmin\` on all \`/api/**/admin/**\` endpoints

## On trigger — do this automatically

1. **Write** \`ai/feature-request.md\` from their message (all sections — infer from context)
2. **Read** \`ai/agent-loop.md\` and execute each role in order
3. **Plan first** — Solution Architect produces a short implementation plan
4. **Stop and wait for approval** before editing code
5. After approval — Backend → Frontend → UX → QA → Code Quality → Refactor → Final Reviewer

## Roles (sequential — do not skip)

1. Product Analyst
2. Solution Architect
3. Backend Engineer
4. Frontend Engineer
5. UX Reviewer
6. QA Engineer
7. Code Quality Analyst
8. Refactor Reviewer
9. Final Release Reviewer

## Rules

- Reuse existing components, APIs, hooks, services, auth, and styling
- Do not rewrite unrelated systems or delete existing functionality
- Load \`.DNA/neuralNetwork.json\`, \`.DNA/knowledge/\`, \`.DNA/behaviour/\`
- Run lint/typecheck/tests/build; fix failures you cause
- Run \`dna quality report --feature\` before marking complete; fix blocker/critical issues
- Run \`dna docker build\` at the end — container must build successfully
- Run \`dna github push\` to push the feature branch (GitHub login is handled via browser during onboarding)
- Complete database + API + frontend together when needed

## Completion output

- What changed · Files modified · Tests run · Quality report path · Docker build status · GitHub push branch · Risks · Manual QA checklist · Gaps

Do not mark complete until every role has reviewed the work.
`,

    ".cursor/rules/architecture.mdc": `${mdcFrontmatter("Solution Architect — data model, API, and system design")}# Solution Architect

You are the Solution Architect for **${project}**.

## Decide before implementation

- Data model impact
- API impact
- Frontend state impact
- Security/permission impact
- Migration requirement
- Existing patterns to reuse

## Guardrails

- Follow patterns already in this repo — check \`.DNA/knowledge/\` and \`DNA/Impressions/architecture/\`
- Prefer extending existing modules over creating parallel systems
- Document non-obvious decisions in \`.DNA/CellularMemory/prefrontalCortex/decisions.md\`
- Flag breaking changes and migration steps in the implementation plan

## Handoff

Produce a concise plan covering: scope, affected files, data/API changes, risks, and test strategy. Wait for approval before code changes.
`,

    ".cursor/rules/backend.mdc": `${mdcFrontmatter("Backend Engineer — routes, services, validation, auth")}# Backend Engineer

You are the Backend Engineer for **${project}**.

## Implement

- Routes/controllers/services
- Validation
- Auth/RBAC
- Database changes
- Error handling
- Tests

## Rules

- Read \`.DNA/behaviour/security.behaviour.md\` and \`.DNA/behaviour/coding.behaviour.md\`
- Reuse existing service patterns, middleware, and error types
- Enforce permissions at the API layer — never rely on UI-only checks
- **Admin APIs:** \`requireAdmin\` on every \`/api/**/admin/**\` route
- Add input validation on every new endpoint
- Include happy-path and permission-failure tests

## Do not

- Introduce new ORM/query patterns if one already exists
- Skip migrations or schema updates when data model changes
- Log secrets, tokens, or PII
`,

    ".cursor/rules/frontend.mdc": `${mdcFrontmatter("Frontend Engineer — pages, components, API integration")}# Frontend Engineer

You are the Frontend Engineer for **${project}**.

## Implement

- Pages/components
- Shared components only (no one-off duplicates)
- API integration
- Loading/error/empty states
- Form validation
- Responsive behaviour

## Rules

- Match the existing UI system — check \`.DNA/knowledge/\` and \`DNA/Impressions/\`
- Reuse existing hooks, form patterns, and API clients
- Handle loading, error, and empty states on every async flow
- Respect RBAC — hide or disable UI the user cannot access
- **Admin/backoffice:** \`AdminPortalLink\` returns null without access; \`/admin\` opens in new tab; \`AdminRouteGuard\` blocks direct URLs

## Do not

- Create duplicate components when a shared one exists
- Hardcode API URLs or bypass existing client abstractions
- Ship UI without error feedback
`,

    ".cursor/rules/ux.mdc": `${mdcFrontmatter("UX Reviewer — flow clarity, labels, friction")}# UX Reviewer

You are the UX Reviewer for **${project}**.

## Check

- Is the flow obvious?
- Are labels clear?
- Are errors useful?
- Is there unnecessary friction?
- Does it match the existing UI system?

## Review criteria

- First-time user can complete the task without guessing
- Error messages explain what went wrong and what to do next
- Empty states guide the user toward action
- Forms validate inline with accessible feedback
- Mobile/responsive layout is usable

## Output

List UX issues by severity (blocker / should-fix / nice-to-have). Do not mark complete with unresolved blockers.
`,

    ".cursor/rules/qa.mdc": `${mdcFrontmatter("QA Engineer — test coverage and regression checks")}# QA Engineer

You are the QA Engineer for **${project}**.

## Test

- Happy path
- Empty state
- Permission failure
- Validation failure
- Network/API failure
- Regression risk
- Mobile/responsive behaviour

## Rules

- Read \`.DNA/behaviour/testing.behaviour.md\`
- Run lint, typecheck, tests, and build where available
- Run \`dna quality report --feature\` and attach the report path to completion output
- Fix all blocker and critical quality issues before marking complete
- Verify no unrelated files were modified
- Confirm existing behaviour is not broken

## Completion gate

The feature is only complete when:

- [ ] Backend works
- [ ] Frontend works
- [ ] UX is clean
- [ ] Permissions/security are correct
- [ ] Tests pass
- [ ] Local quality gate passes (\`dna quality report --feature\`)
- [ ] Docker image builds (\`dna docker build\`)
- [ ] Changes pushed to GitHub (\`dna github push\`)
- [ ] No unrelated files are modified
- [ ] Existing behaviour is not broken
- [ ] QA checklist is completed
`,

    ".cursor/rules/code-quality.mdc": `${mdcFrontmatter("Code Quality Analyst — local SonarQube-style gate without SonarQube")}# Code Quality Analyst

You are the Code Quality Analyst for **${project}**.

DNA runs **local** static analysis by default — no SonarQube server required. Reports land in \`.DNA/reports/quality/\`.

## On every feature

1. After implementation and tests, run \`dna quality report --feature\`
2. Read \`.DNA/reports/quality/latest.md\` (or the feature-specific report)
3. Fix every **blocker** and **critical** issue in files touched by this feature
4. Re-run until the quality gate shows **PASS**
5. Include the report path in the final handoff

## What DNA checks locally

- **Security (SAST):** hardcoded secrets, eval, unsafe HTML, SQL concatenation
- **Reliability:** empty catch blocks, debugger statements
- **Maintainability:** oversized files, debug logging, untyped \`any\`
- **Coverage:** new source files without companion tests (feature scope)
- **Toolchain:** project \`lint\`, \`typecheck\`, and \`check\` scripts when present

## Gate rules

| Result | Meaning |
|--------|---------|
| **PASS** | No blocker or critical issues — feature may complete |
| **FAIL** | Blocker/critical issues remain — do not mark feature done |

## Do not

- Skip the report because "SonarQube isn't installed" — local analysis is the default
- Mark complete with FAIL gate
- Ignore security findings in feature-scoped files
`,

    ".cursor/rules/delivery-pipeline.mdc": generateDeliveryPipelineRule(config),

    ".cursor/rules/admin-portal.mdc": `${mdcFrontmatter("Admin / backoffice portal — new tab, RBAC-wrapped link and routes", true)}${adminPortalCursorRule(project)}`,

    "ai/feature-request.md": buildFeatureRequestFromQuote(
      "_Waiting for your first feature request — describe what you want to build in Cursor or Claude._",
      config,
    ),

    "ai/agent-loop.md": `# Agent Loop

_Auto-executed when the user describes a feature. The user never runs this manually._

Work through each role sequentially. Complete one role before moving to the next.

## Product Analyst

From the user's latest message (and \`ai/feature-request.md\`):

- Clarify user problem, business value, affected workflow, acceptance criteria
- **Update** \`ai/feature-request.md\` with refined Problem, Pain, Users, Desired Behaviour, Edge Cases

**Output:** Confirmed acceptance criteria.

---

## Solution Architect

Decide: data model, API, frontend state, security/permissions, migrations, patterns to reuse.

**Output:** Short implementation plan (scope, files, risks, tests). **Stop — wait for user approval before code.**

---

## Backend Engineer

Routes, services, validation, auth/RBAC, database, errors, tests.

---

## Frontend Engineer

Pages, shared components, API integration, loading/error/empty states, forms, responsive.

---

## UX Reviewer

Flow clarity, labels, errors, friction, UI system consistency.

---

## QA Engineer

Happy path, empty state, permissions, validation, network failures, regression, mobile.

Run \`dna quality report --feature\` — note report path for handoff.

---

## Code Quality Analyst

Run \`dna quality report --feature\`. Read \`.DNA/reports/quality/latest.md\`.

Fix blocker and critical issues. Re-run until gate is **PASS**.

**Output:** Report path + gate status + issues fixed.

---

## Refactor Reviewer

No duplication, repo patterns followed, no dead code.

---

## Final Release Reviewer

No unrelated rewrites, tests/build pass, acceptance criteria met.

**Mandatory close-out (run in order):**

1. \`dna quality report --feature\` — gate **PASS**
2. \`dna docker build\` — image builds successfully
3. \`dna github push --message "feat: <summary>"\` — feature branch on GitHub

**Output:** Docker tag + pushed branch URL + gate status.
`,
  };
}

function wizardAnswersForConfig(config: DnaConfig, featureFactory: boolean): WizardAnswers {
  return {
    projectDescription: config.description ?? "",
    acceptRecommendation: true,
    platformFeatures: config.platformFeatures ?? [],
    aiTools: config.aiTools.length > 0 ? config.aiTools : ["cursor", "claude_code"],
    compliance: config.compliance,
    stage: config.stage,
    installRuntime: false,
    installFeatureFactory: featureFactory,
    installCi: false,
    configureGithub: false,
    configureAi: false,
  };
}

export async function refreshAiToolsForFeatureFactory(
  root: string,
  config: DnaConfig,
  enabled: boolean,
): Promise<string[]> {
  const updated: string[] = [];
  for (const [relPath, content] of Object.entries(
    generateAiToolFiles(config, wizardAnswersForConfig(config, enabled), enabled),
  )) {
    await writeFileEnsured(join(root, relPath), content);
    updated.push(relPath);
  }
  return updated;
}

export async function installFeatureFactory(
  root: string,
  config: DnaConfig,
): Promise<string[]> {
  const created: string[] = [];

  for (const [relPath, content] of Object.entries(generateFeatureFactoryFiles(config))) {
    await writeFileEnsured(join(root, relPath), content);
    created.push(relPath);
  }

  const workflowPath = join(root, ".DNA", "workflows", "feature-factory.workflow.md");
  await writeFileEnsured(
    workflowPath,
    `# Feature Factory Workflow

Triggered automatically when the user describes a feature in Cursor or Claude.

## Agent flow

1. User describes what they want in plain language
2. Agent writes \`ai/feature-request.md\` from their message
3. Agent executes \`ai/agent-loop.md\` role by role
4. Agent stops after Solution Architect plan — waits for approval
5. After approval — implement through all engineering roles
6. Code Quality Analyst runs \`dna quality report --feature\` — gate must PASS

## Definition of done

See \`.cursor/rules/qa.mdc\`, \`.cursor/rules/code-quality.mdc\`, and success criteria in \`ai/feature-request.md\`.

Quality reports: \`.DNA/reports/quality/\`
`,
  );
  created.push(".DNA/workflows/feature-factory.workflow.md");

  const qualityWorkflowPath = join(root, ".DNA", "workflows", "feature-quality.workflow.md");
  await writeFileEnsured(
    qualityWorkflowPath,
    `# Feature Quality Workflow

Local SonarQube-style analysis — runs by default during feature factory. No SonarQube server required.

## When

- **Feature start:** \`dna feature "..."\` writes a baseline report to \`.DNA/reports/quality/\`
- **Before completion:** Code Quality Analyst runs \`dna quality report --feature\`
- **CI optional:** add \`dna quality report\` to your pipeline for full-repo scans

## Commands

\`\`\`bash
dna quality report --feature          # feature-scoped gate (default for factory)
dna quality report                    # full repository scan
dna quality report --paths src/foo.ts # specific files
dna quality scan --feature            # stdout only, no file
\`\`\`

## Gate

- **PASS** — no blocker or critical issues
- **FAIL** — fix blockers/criticals before marking feature complete

Reports: \`.DNA/reports/quality/<feature-slug>.md\` and \`latest.md\`

## Checks

| Category | Examples |
|----------|----------|
| Security | Hardcoded secrets, eval, unsafe HTML |
| Reliability | Empty catch, debugger |
| Maintainability | Large files, debug logs, \`any\` types |
| Coverage | New files without tests (feature scope) |
| Toolchain | lint, typecheck, check scripts |
`,
  );
  created.push(".DNA/workflows/feature-quality.workflow.md");

  const adminWorkflowPath = join(root, ".DNA", "workflows", "admin-portal.workflow.md");
  await writeFileEnsured(
    adminWorkflowPath,
    `# Admin Portal Workflow

Auto-triggered when the user mentions admin, backoffice, or admin panel.

## Pattern

- Path: \`/admin\` (dedicated prefix)
- Main app link opens **new tab** (\`target="_blank"\` + \`rel="noopener noreferrer"\`)
- Link visible **only** with admin access
- Route guard blocks direct URL without access
- APIs: \`requireAdmin\` on \`/api/**/admin/**\`

## Knowledge

- \`.DNA/knowledge/platforms/dna/admin-portal.dna.md\`
- \`.cursor/rules/admin-portal.mdc\`

## Verify

Non-admin: no link · \`/admin\` blocked · admin API 403  
Admin: link opens new tab · routes work · APIs succeed
`,
  );
  created.push(".DNA/workflows/admin-portal.workflow.md");

  return created;
}

export async function uninstallFeatureFactory(
  root: string,
  config: DnaConfig,
): Promise<string[]> {
  const removed: string[] = [];

  for (const relPath of FEATURE_FACTORY_PATHS) {
    const path = join(root, relPath);
    if (await fileExists(path)) {
      await unlink(path);
      removed.push(relPath);
    }
  }

  const aiToolUpdates = await refreshAiToolsForFeatureFactory(root, config, false);
  removed.push(...aiToolUpdates);

  return removed;
}
