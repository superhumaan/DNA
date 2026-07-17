import type { KnowledgePack } from "@superhumaan/dna-config";
import { pack } from "./bundled-catalog-helpers.js";

/** DNA default quality engineering packs — CI, coverage, OWASP */
export const QUALITY_STEM_PACKS: KnowledgePack[] = [
  pack(
    "testing/code-coverage",
    "Code Coverage",
    "disciplines",
    "DNA default coverage thresholds and Vitest configuration",
    [
      {
        path: "testing/code-coverage/positioning.dna.md",
        content: `# Code Coverage — DNA Default

DNA scaffolds **Vitest + v8 coverage** with CI-enforced thresholds.

## Default thresholds

| Metric | Minimum |
|--------|---------|
| Lines | 70% |
| Branches | 60% |
| Functions | 70% |
| Statements | 70% |

Configured in \`vitest.config.ts\` (generated on \`dna init\` when missing).

## Scripts

- \`npm test\` — unit tests (must pass before PR)
- \`npm run test:coverage\` — tests + threshold gate (runs in CI)

## Agent rules

Feature factory agents must:
1. Add tests for new business logic and API endpoints
2. Run \`dna quality report --feature\` before marking complete
3. Not reduce coverage on touched files without justification
`,
      },
      {
        path: "testing/code-coverage/ci.dna.md",
        content: `# Code Coverage — CI Integration

DNA generates \`.github/workflows/dna-ci.yml\` on init.

## CI quality gate steps

1. Lint (\`npm run lint\`)
2. Typecheck (\`npm run typecheck\`) when configured
3. Unit tests (\`npm test\`)
4. Coverage (\`npm run test:coverage\`) — fails below thresholds
5. Dependency audit (package-manager native: \`pnpm audit\`, \`yarn audit\`, or \`npm audit\`)
6. DNA static analysis (\`dna quality scan\`)

## Coverage artifacts

CI uploads \`coverage/\` as a workflow artifact (14-day retention).

## Local parity

Run the same gate locally before pushing:

\`\`\`bash
npm run lint
npm run typecheck   # if present
npm test
npm run test:coverage
dna quality report --feature
\`\`\`
`,
      },
    ],
  ),
  pack(
    "disciplines/qa",
    "QA Discipline",
    "disciplines",
    "Test strategy, regression, and completion gates for DNA projects",
    [
      {
        path: "disciplines/qa/positioning.dna.md",
        content: `# QA — Discipline

DNA treats QA as a **completion gate**, not an afterthought.

## Required for every feature

- Happy path, empty state, permission failure, validation failure
- Regression check on adjacent flows
- \`dna quality report --feature\` gate PASS
- CI workflow green (lint, test, coverage, audit)

## Documentation

Update \`DNA/Impressions/qa/regression-risks.md\` when shipping risky changes.
`,
      },
      {
        path: "disciplines/qa/checklist.dna.md",
        content: `# QA — Feature Completion Checklist

Before marking a feature done:

- [ ] Unit tests for new logic
- [ ] Integration tests for new API routes
- [ ] Permission-denied cases tested server-side
- [ ] \`npm test\` passes locally
- [ ] \`npm run test:coverage\` meets thresholds
- [ ] \`dna quality report --feature\` → PASS
- [ ] No unrelated files modified
- [ ] Success criteria in \`ai/feature-request.md\` checked off
`,
      },
    ],
  ),
];

export const QUALITY_STEM_PACK_IDS = QUALITY_STEM_PACKS.map((p) => p.id);
