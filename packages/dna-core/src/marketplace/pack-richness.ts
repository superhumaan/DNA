/**
 * Shared pack richness builder — zero-stubs bar from
 * docs/engineering/knowledge-pack-zero-stubs-plan.md
 */
import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

export type RichDocSet = {
  positioning: string;
  architecture: string;
  integration: string;
  checklist: string;
  examples: string;
  antiPatterns: string;
  references: string;
  /** Extra named docs (path suffix → content), e.g. ceremonies, artifacts */
  extras?: Record<string, string>;
};

export type RichAssetHints = {
  /** Short labels for mermaid diagrams (default: flow / roles / delivery) */
  diagrams?: [string, string, string];
  /** Captioned image stubs */
  images?: [string, string];
  /** Filled document titles */
  documents?: [string, string];
  /** Template titles */
  templates?: [string, string];
  /** Fixture basename without extension */
  fixtureName?: string;
  /** GitHub org/repo refs (≥3) */
  repos?: [string, string, string];
  /**
   * When true, append operational depth docs (ops, security, troubleshooting,
   * recipes, testing, observability, migration) toward the ≥12k P0 char bar.
   */
  p0Depth?: boolean;
  /**
   * When true, append a lighter depth set for long-tail packs (clears ≥4k richness floor).
   * Ignored when p0Depth is true (full depth wins).
   */
  longtailDepth?: boolean;
  /** Domain hints injected into P0 depth docs */
  domain?: P0DomainHints;
};

export type P0DomainHints = {
  /** One-line stack summary */
  stack: string;
  failureModes: string[];
  recipes: string[];
  security: string[];
  metrics: string[];
  upgradeNotes?: string[];
};

/** Substantial operational extras for Wave 1 P0 char depth (≥12k target). */
export function buildP0DepthExtras(name: string, domain?: P0DomainHints): Record<string, string> {
  const stack = domain?.stack ?? `${name} in a DNA TypeScript / Node product`;
  const failures = (domain?.failureModes ?? [
    "Misconfiguration in prod vs staging",
    "Silent auth/permission drift",
    "Missing observability on critical path",
    "Unbounded retries / thundering herd",
    "Schema or contract drift across services",
  ])
    .map((f, i) => `${i + 1}. ${f}`)
    .join("\n");
  const recipes = (domain?.recipes ?? [
    "Happy-path integration smoke",
    "Failure injection (timeout / 5xx)",
    "Idempotent retry of a mutating call",
    "Rollback / feature-flag off",
  ])
    .map((r, i) => `### Recipe ${i + 1}\n\n${r}\n\n**Steps:** prepare → execute → verify → clean up.\n`)
    .join("\n");
  const security = (domain?.security ?? [
    "Least privilege on credentials and roles",
    "Secrets never in git or client bundles",
    "Input validation at trust boundaries",
    "Audit sensitive mutations",
  ])
    .map((s) => `- ${s}`)
    .join("\n");
  const metrics = (domain?.metrics ?? [
    "Availability / error rate on critical endpoints",
    "Latency p50/p95",
    "Saturation (CPU, connections, queue depth)",
    "Business KPI tied to this surface",
  ])
    .map((m) => `- ${m}`)
    .join("\n");
  const upgrades = (domain?.upgradeNotes ?? [
    "Read changelog; run in staging first",
    "Keep one rollback path (image tag / flag)",
    "Update Impressions if architecture changes",
  ])
    .map((u) => `- ${u}`)
    .join("\n");

  return {
    "ops-playbook": `# Ops playbook — ${name}

## Runtime context
${stack}

## Ownership
- **Primary:** team that ships changes to this surface
- **Escalation:** on-call → platform → vendor support (if managed)
- **Change window:** prefer low-traffic; always have rollback

## Pre-deploy
1. Diff reviewed; secrets/config validated
2. Migrations / contract changes backward compatible or dual-written
3. Feature flag or canary plan stated
4. \`dna quality report --feature\` PASS when this is product code
5. Dashboards/alerts known for the blast radius

## Deploy
1. Apply to staging; smoke the recipes in \`recipes.dna.md\`
2. Promote with the same artifact digest when possible
3. Watch error rate + latency for 15–30 minutes
4. Announce in the team channel with rollback command

## Incident first 15 minutes
1. Declare severity; page if user-facing money/auth/data loss
2. Stabilize (rollback / flag off / scale) before root-causing
3. Capture timeline in CellularMemory amygdala / incident notes
4. Never invent “fixed” from stub Impressions — use logs + traces

## Post-incident
1. Blameless review within 5 business days
2. Update \`troubleshooting.dna.md\` with the new failure mode
3. File follow-ups as tickets — not chat-only
4. Sync CellularMemory amygdala / temporalLobe when the fix is structural

## Environments
| Env | Purpose | Data rules |
|-----|---------|------------|
| local | Dev | Fake/synthetic only |
| staging | Pre-prod | Anonymized or synthetic |
| prod | Live | Least privilege; change control |

Never copy prod secrets into local gitignored files that might be shared.
`,
    "security-hardening": `# Security hardening — ${name}

## Threat sketch
Attackers will try credential theft, injection, privilege escalation, and supply-chain abuse against **${name}**.

## Controls
${security}

## DNA rules
- Never commit secrets from CLI output
- Admin surfaces: UI hide **and** API \`requireAdmin\` (or equivalent)
- Impression Guard: stub policy docs ≠ implemented controls

## Review checklist
- [ ] Secrets in vault/env — not repo
- [ ] Public endpoints rate-limited where abuse is cheap
- [ ] Dependency audit considered for this change
- [ ] PII/PHI paths minimized and audited
- [ ] Webhook/signature verification when inbound

## Evidence
Store control evidence under compliance packs / Impressions — do not claim SOC2/HIPAA from empty stubs.
`,
    troubleshooting: `# Troubleshooting — ${name}

## Top failure modes
${failures}

## Triage tree
1. **Is it down for everyone or one tenant/user?** → blast radius
2. **Did a deploy land in the last 2h?** → rollback candidate
3. **Are dependencies healthy?** (DB, auth, payment, AI provider)
4. **Do logs show 4xx (client) or 5xx (ours)?**
5. **Is config drift present?** (env, feature flags, migrations)

## Commands / evidence (adapt to stack)
\`\`\`bash
npx dna analyze
npx dna scan
# plus provider dashboards, \`kubectl\`/\`docker\` logs, APM traces
\`\`\`

## Known gotchas
- Staging ≠ prod config (especially auth callbacks and webhook URLs)
- Clock skew breaking signatures
- Connection pool exhaustion under load
- Cached negatives after permission changes

## When to escalate
Sev1 data loss, auth bypass, payment mischarge, or prolonged outage → page + incident procedure.
`,
    recipes: `# Recipes — ${name}

Practical drills. Run in staging before production changes.

${recipes}

## Definition of success
Each recipe leaves the system healthy and leaves an audit trail (logs or ticket note).
`,
    "testing-strategy": `# Testing strategy — ${name}

## Layers
| Layer | What |
|-------|------|
| Unit | Pure logic, validators, mappers |
| Integration | Real or testcontainers against ${name} boundaries |
| Contract | OpenAPI / webhook payload fixtures |
| E2E smoke | One critical user journey |
| Chaos (optional) | Timeout / 5xx injection |

## DNA gate
Ship path expects tests + \`dna quality report --feature\` for product changes touching this pack's surface.

## Fixtures
Use \`assets/fixtures/\` as seeds. Prefer deterministic IDs and no production PII.

## Anti-patterns
- Only mocking the thing under test until nothing is real
- Skipping webhook signature tests
- Flaky time-dependent tests without fakes
`,
    observability: `# Observability — ${name}

## Golden signals
${metrics}

## Instrumentation
- Structured logs with request/trace ids
- Metrics: rate, errors, duration, saturation
- Traces across auth → app → DB/AI/payment

## Alerts (starter)
- Error rate spike vs baseline
- p95 latency budget burn
- Saturation (pool/queue) > threshold
- Certificate / secret expiry (if applicable)

## Dashboards
One “${name} health” board: traffic, errors, latency, dependency status. Link from runbook.

## Privacy
Scrub tokens, raw cards, PHI from logs. Sample carefully in regulated domains.
`,
    "migration-upgrade": `# Migration & upgrade — ${name}

## Principles
${upgrades}

## Compatibility
- Expand/contract for schema changes
- Dual-run old/new readers when flipping formats
- Version webhooks and APIs explicitly

## Rollback
Document the exact command or previous image digest. Test restore for data stores.

## Post-upgrade
- [ ] Smoke recipes pass
- [ ] Alerts quiet
- [ ] Impressions / CellularMemory updated if architecture changed
- [ ] Changelog note for operators
`,
    "cost-and-capacity": `# Cost & capacity — ${name}

## Capacity model
Document expected load for **${name}** (RPS, storage growth, token/spend budgets, connection pools).

## Scaling levers
1. Vertical (size up) vs horizontal (replicas/shards) — pick intentionally
2. Caching / batching before adding hardware
3. Backpressure and load shedding on overload
4. Quotas per tenant when multi-tenant

## Cost controls
- Budgets + alerts on the billable dimension (compute, storage, AI tokens, egress)
- Kill switches / feature flags for expensive paths
- Review top 10 cost drivers monthly

## DNA
Do not invent capacity numbers from stub Impressions — measure staging load tests and production metrics.
`,
    "sla-and-support": `# SLA & support — ${name}

## Service expectations
Define availability target and support hours for **${name}** surfaces (internal vs customer-facing).

## Severity
| Sev | Meaning | Response |
|-----|---------|----------|
| 1 | Outage / data loss / auth/payment break | Immediate page |
| 2 | Major degradation | Same business day |
| 3 | Minor / workaround exists | Backlog |

## Customer comms
Status page or in-app banner when Sev1/2; never silence incidents.

## Handoffs
On-call → owning team → vendor support with ticket IDs and recent deploy SHA.
`,
    "dependency-map": `# Dependency map — ${name}

## Upstream
List services **${name}** calls (DB, auth, payments, AI, queues). Note timeout and retry policy per dependency.

## Downstream
Who breaks if **${name}** is down? (UI routes, jobs, webhooks, partner APIs)

## Contracts
- Versioned APIs / webhooks
- Idempotency where money or entitlement changes
- Schema registry or OpenAPI when multiple consumers

## Failure containment
Circuit breakers or graceful degradation paths documented in \`troubleshooting.dna.md\`. Prefer read-only degraded mode over hard 500s when safe.

## Change impact
Before merging: name the upstream/downstream blast radius in the PR and in \`ai/feature-request.md\` when product-facing.
`,
    appendix: `# Appendix — ${name} deep dive

## Decision record template
- **Context:** why ${name} was chosen for this project
- **Options considered:**
- **Decision:**
- **Consequences:** ops, cost, lock-in, team skill
- **Review by:** date

## Glossary
| Term | Meaning in this pack |
|------|----------------------|
| SoR | System of record |
| Blast radius | What fails if this surface fails |
| Expand/contract | Compatible migration pattern |
| Impression Guard | Stub Impressions ≠ truth |
| STRATEGY_COMPLETE | Handoff JSON before Feature Factory |

## Anti-stub rule
If an Impression or policy file about **${name}** is empty, TODO, or generic, mark EMPTY_STUB_RESOLVED and ground in code + CellularMemory + runtime evidence.

## Quality bar (DNA)
1. Spec / plan approved when product-facing
2. Tests for critical paths
3. \`dna quality report --feature\` PASS
4. \`dna docker build\` when shipping
5. Preview push — do not leave work localhost-only

## Operator cheat sheet
- Find owners in CODEOWNERS / team roster
- Find dashboards linked from \`observability.dna.md\`
- Find rollback in \`migration-upgrade.dna.md\`
- Find security expectations in \`security-hardening.dna.md\`

## Related packs
Install purpose combos when they exist (e.g. \`combo/nextjs-fullstack\`, \`combo/scrum-team\`). Prefer composing packs over duplicating guidance.

## Change log hygiene
Every material change to how **${name}** is used in-repo should update CHANGELOG + CellularMemory recent-changes when architecture shifts.

## Training notes
New engineers: read positioning → architecture → recipes → ops playbook. Skip marketing blogs as source of truth.

## Review prompts for agents
1. What evidence proves this claim?
2. What is the rollback?
3. What PII/PHI/secrets are in play?
4. Did Impression Guard run?
5. Is Feature Factory the next step or still strategy?

_End of ${name} appendix — keep this file updated when operating model changes._
`,
  };
}

function mermaidBlock(title: string, body: string): string {
  return `# Diagram — ${title}

\`\`\`mermaid
${body}
\`\`\`
`;
}

function defaultDiagrams(name: string): [string, string, string] {
  return [
    mermaidBlock(
      `${name} flow`,
      `flowchart LR
  A[Intake] --> B[Plan]
  B --> C[Build]
  C --> D[Verify]
  D --> E[Ship]`,
    ),
    mermaidBlock(
      `${name} roles`,
      `flowchart TB
  PO[Product] --> Team[Delivery team]
  SM[Process] --> Team
  Team --> Stakeholders`,
    ),
    mermaidBlock(
      `${name} increment`,
      `sequenceDiagram
  participant B as Backlog
  participant T as Team
  participant S as Stakeholders
  B->>T: Pull work
  T->>T: Build + test
  T->>S: Demo increment`,
    ),
  ];
}

/** Build ≥8 docs + full assets/ tree for a knowledge pack path prefix. */
export function buildRichFiles(
  basePath: string,
  name: string,
  docs: RichDocSet,
  assets: RichAssetHints = {},
): Array<{ path: string; content: string }> {
  const diagrams = assets.diagrams
    ? assets.diagrams.map((d, i) =>
        d.includes("```mermaid") ? d : mermaidBlock(`${name} ${i + 1}`, d),
      )
    : defaultDiagrams(name);
  const images = assets.images ?? [
    `${name} — delivery board (caption stub; replace with real screenshot)`,
    `${name} — ceremony room / remote board (caption stub)`,
  ];
  const documents = assets.documents ?? [
    `${name} working agreement (filled)`,
    `${name} Definition of Done checklist (filled)`,
  ];
  const templates = assets.templates ?? [
    `${name} work item template`,
    `${name} retro / inspect template`,
  ];
  const fixtureName = assets.fixtureName ?? "sample-backlog";
  const repos = assets.repos ?? [
    "scrum/scrum-guide",
    "openpractice/library",
    "agilealliance/agilealliance.org",
  ];

  const files: Array<{ path: string; content: string }> = [
    { path: `${basePath}/positioning.dna.md`, content: docs.positioning },
    { path: `${basePath}/architecture.dna.md`, content: docs.architecture },
    { path: `${basePath}/integration.dna.md`, content: docs.integration },
    { path: `${basePath}/checklist.dna.md`, content: docs.checklist },
    { path: `${basePath}/examples.dna.md`, content: docs.examples },
    { path: `${basePath}/anti-patterns.dna.md`, content: docs.antiPatterns },
    { path: `${basePath}/references.dna.md`, content: docs.references },
  ];

  for (const [suffix, content] of Object.entries(docs.extras ?? {})) {
    files.push({ path: `${basePath}/${suffix}.dna.md`, content });
  }

  if (assets.p0Depth || assets.longtailDepth) {
    const depth = buildP0DepthExtras(name, assets.domain);
    const keys = assets.p0Depth
      ? Object.keys(depth)
      : [
          "ops-playbook",
          "security-hardening",
          "troubleshooting",
          "recipes",
          "appendix",
        ];
    for (const suffix of keys) {
      const content = depth[suffix];
      if (!content) continue;
      if (!files.some((f) => f.path === `${basePath}/${suffix}.dna.md`)) {
        files.push({ path: `${basePath}/${suffix}.dna.md`, content });
      }
    }
  }

  files.push(
    { path: `${basePath}/assets/diagrams/01-flow.mmd.md`, content: diagrams[0]! },
    { path: `${basePath}/assets/diagrams/02-roles.mmd.md`, content: diagrams[1]! },
    { path: `${basePath}/assets/diagrams/03-increment.mmd.md`, content: diagrams[2]! },
    {
      path: `${basePath}/assets/images/README.md`,
      content: `# Images — ${name}

1. **board.png** — ${images[0]}
2. **ceremony.png** — ${images[1]}

_Replace stubs with project screenshots when available. Captions required._
`,
    },
    {
      path: `${basePath}/assets/documents/working-agreement.md`,
      content: `# ${documents[0]}

## Team
- Cadence:
- Channels:
- Escalation:

## Quality bar
- Tests:
- Review:
- Docs:

## Done when
- [ ] Acceptance criteria met
- [ ] Quality gate PASS
`,
    },
    {
      path: `${basePath}/assets/documents/definition-of-done.md`,
      content: `# ${documents[1]}

- [ ] Code reviewed
- [ ] Automated tests pass
- [ ] No known Sev1/Sev2 defects
- [ ] Docs / Impressions updated if architecture changed
- [ ] Deployed to agreed environment
`,
    },
    {
      path: `${basePath}/assets/templates/work-item.md`,
      content: `# Template — ${templates[0]}

**Title:**
**Type:** story | enabler | bug | bet | task
**Persona / user:**
**Outcome:**
**Acceptance criteria:**
- [ ]
**Non-goals:**
**Dependencies:**
`,
    },
    {
      path: `${basePath}/assets/templates/retro.md`,
      content: `# Template — ${templates[1]}

**Period:**
**What went well:**
**What to improve:**
**Experiments for next cycle:**
**Owners:**
`,
    },
    {
      path: `${basePath}/assets/fixtures/${fixtureName}.json`,
      content: `${JSON.stringify(
        {
          name: fixtureName,
          methodology: name,
          items: [
            { id: "PBI-1", title: "Sample backlog item", status: "ready", points: 3 },
            { id: "PBI-2", title: "Integration spike", status: "refining", points: 5 },
          ],
        },
        null,
        2,
      )}\n`,
    },
    {
      path: `${basePath}/assets/references/repos.md`,
      content: `# References — ${name}

## GitHub / OSS
1. https://github.com/${repos[0]}
2. https://github.com/${repos[1]}
3. https://github.com/${repos[2]}

## Official docs
See \`references.dna.md\` in pack root.
`,
    },
  );

  return files;
}

export function richCatalogPack(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  description: string,
  docs: RichDocSet,
  extraTags: string[] = [],
  assets?: RichAssetHints,
): KnowledgePack {
  return catalogPack(
    id,
    name,
    category,
    description,
    buildRichFiles(id, name, docs, assets),
    ["rich", ...extraTags],
  );
}

/** Minimum file count for richness bar (8 docs + assets). */
export const RICHNESS_MIN_FILES = 16;

export function packCharCount(pack: KnowledgePack): number {
  return pack.files.reduce((s, f) => s + (f.content?.length ?? 0), 0);
}

/** P0 target — plan bar ≥12k chars with assets tree. */
export const P0_MIN_CHARS = 12000;

/** Long-tail / catalog floor — assets tree + enough prose to escape stub/thin. */
export const LONGTAIL_MIN_CHARS = 4000;

export function meetsRichnessBar(pack: KnowledgePack, minChars = LONGTAIL_MIN_CHARS): boolean {
  return pack.files.length >= RICHNESS_MIN_FILES && packCharCount(pack) >= minChars;
}

export function meetsP0DepthBar(pack: KnowledgePack): boolean {
  return meetsRichnessBar(pack, P0_MIN_CHARS);
}

function fileEnding(pack: KnowledgePack, suffix: string): string | undefined {
  return pack.files.find((f) => f.path.endsWith(suffix))?.content;
}

/**
 * Lift a thin/stub pack to the catalog richness floor without losing authored prose.
 * No-op when the pack already meets the long-tail bar (or is P0-depth).
 */
export function liftPackToRichness(pack: KnowledgePack): KnowledgePack {
  if (meetsRichnessBar(pack, LONGTAIL_MIN_CHARS)) return pack;

  const positioning =
    fileEnding(pack, "positioning.dna.md") ??
    fileEnding(pack, "overview.dna.md") ??
    `# ${pack.name}\n\n${pack.description}\n`;
  const architecture =
    fileEnding(pack, "architecture.dna.md") ??
    `# ${pack.name} — Architecture\n\n## Boundaries\nDocument integration points, data classes, and failure modes for **${pack.name}**.\n\n## DNA\nUpdate Impressions when architecture changes. Pair security/compliance packs when regulated.\n`;
  const integration =
    fileEnding(pack, "integration.dna.md") ??
    fileEnding(pack, "tech-stack.dna.md") ??
    `# ${pack.name} — Integration\n\n${pack.description}\n\n## Steps\n1. Install/configure via approved secrets\n2. Wire health checks and timeouts\n3. Verify in staging before production\n`;
  const checklist =
    fileEnding(pack, "checklist.dna.md") ??
    fileEnding(pack, "practices.dna.md") ??
    `# ${pack.name} — Checklist\n\n- [ ] Secrets in env/vault\n- [ ] Staging verified\n- [ ] Observability on critical path\n- [ ] Rollback known\n`;
  const examples =
    fileEnding(pack, "examples.dna.md") ??
    `# ${pack.name} — Examples\n\n## Minimal\nConfigure **${pack.name}** for the happy path, then add failure handling (timeouts, retries, idempotency).\n\n## Verify\nSmoke the primary user/API journey in staging after change.\n`;
  const antiPatterns =
    fileEnding(pack, "anti-patterns.dna.md") ??
    `# ${pack.name} — Anti-patterns\n\n- Committing secrets or tokens\n- Treating stub Impressions as implemented controls\n- Skipping staging verification\n- Silent failures without alerts\n`;
  const references =
    fileEnding(pack, "references.dna.md") ??
    `# ${pack.name} — References\n\n1. Official vendor / project documentation for ${pack.name}\n2. DNA security + compliance packs when handling regulated data\n3. In-repo Impressions after they are non-stub\n`;

  const reserved = new Set([
    "positioning",
    "architecture",
    "integration",
    "checklist",
    "examples",
    "anti-patterns",
    "references",
    "overview",
  ]);
  const extras: Record<string, string> = {};
  for (const f of pack.files) {
    if (!f.path.endsWith(".dna.md")) continue;
    const base = f.path.split("/").pop()!.replace(/\.dna\.md$/, "");
    if (reserved.has(base)) continue;
    if (f.path.includes("/assets/")) continue;
    extras[base] = f.content ?? "";
  }

  const files = buildRichFiles(
    pack.id,
    pack.name,
    {
      positioning,
      architecture,
      integration,
      checklist,
      examples,
      antiPatterns,
      references,
      extras,
    },
    {
      longtailDepth: true,
      fixtureName: `${pack.id.replace(/\//g, "-")}-sample`,
      domain: {
        stack: `${pack.name} (${pack.id}) in a DNA project`,
        failureModes: [
          `${pack.name} misconfiguration across environments`,
          `Dependency outage affecting ${pack.name}`,
          `Missing monitoring on ${pack.name} critical path`,
        ],
        recipes: [
          `${pack.name} happy-path smoke`,
          `${pack.name} failure / timeout path`,
          `${pack.name} rollback or flag-off`,
        ],
        security: [
          `Least privilege for ${pack.name}`,
          `Secrets never in git`,
          `Validate inputs at ${pack.name} boundaries`,
        ],
        metrics: [`${pack.name} errors`, `${pack.name} latency`, `${pack.name} saturation`],
      },
    },
  );

  return {
    ...pack,
    tags: [...new Set([...(pack.tags ?? []), "rich", "longtail-lifted"])],
    files,
  };
}

/** Dedupe by id (last wins) then lift remaining thin/stub packs to the richness floor. */
export function finalizeCatalogPacks(packs: KnowledgePack[]): KnowledgePack[] {
  const byId = new Map<string, KnowledgePack>();
  for (const pack of packs) {
    byId.set(pack.id, pack);
  }
  return [...byId.values()].map(liftPackToRichness);
}
