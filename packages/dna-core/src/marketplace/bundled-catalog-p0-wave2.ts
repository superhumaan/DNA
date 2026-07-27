/**
 * Wave 2 P0 packs — databases, AI, discovery, compliance flagships.
 * Merged into P0_RICH_PACKS (last-write-wins in catalog).
 */
import type { KnowledgePack } from "@superhumaan/dna-config";
import { richCatalogPack, type P0DomainHints, type RichDocSet } from "./pack-richness.js";

function p0(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  desc: string,
  docs: RichDocSet,
  tags: string[],
  repos: [string, string, string],
  domain: P0DomainHints,
): KnowledgePack {
  return richCatalogPack(id, name, category, desc, docs, ["p0", "rich", "wave2", ...tags], {
    repos,
    fixtureName: `${id.replace(/\//g, "-")}-sample`,
    p0Depth: true,
    domain,
  });
}

export const P0_WAVE2_PACK_IDS = [
  "databases/postgresql",
  "databases/redis",
  "databases/mongodb",
  "databases/prisma",
  "databases/drizzle",
  "databases/supabase-platform",
  "ai/openai",
  "ai/anthropic",
  "ai/vercel-ai-sdk",
  "ai/langchain",
  "ai/rag-patterns",
  "discovery/overview",
  "discovery/continuous-discovery",
  "discovery/product-market-fit",
  "discovery/opportunity-solution-tree",
  "compliance/gdpr",
  "compliance/soc2",
  "compliance/hipaa-depth",
  "compliance/pci-dss-depth",
] as const;

export const P0_WAVE2_PACKS: KnowledgePack[] = [
  p0(
    "databases/postgresql",
    "PostgreSQL",
    "platforms",
    "PostgreSQL — primary relational store, migrations, RLS, backups",
    {
      positioning: `# PostgreSQL

Default relational database for DNA products. Prefer Postgres over inventing polyglot persistence early.

## When
- Strong consistency, relational data, JSONB flexibility
- Row Level Security for multi-tenant SaaS
`,
      architecture: `# Architecture

App → pooler (PgBouncer) → primary → replicas (optional)  
Migrations expand/contract. Logical backups + PITR for prod.
`,
      integration: `# Integration

Pair \`databases/prisma\` or \`databases/drizzle\`, \`cloud/aws-rds\`, \`databases/supabase-platform\` when BaaS.
`,
      checklist: `# Checklist

- [ ] Migrations reviewed for locks
- [ ] Connection pool sized
- [ ] Backups restored in drill
- [ ] RLS or app-level tenancy explicit
`,
      examples: `# Example

Use transactions for multi-row invariants; \`SELECT … FOR UPDATE\` sparingly with clear ordering to avoid deadlocks.
`,
      antiPatterns: `# Anti-patterns

- Unbounded \`SELECT *\` in hot paths
- Schema changes without expand/contract
- Storing secrets in rows without encryption strategy
`,
      references: `# References

1. https://www.postgresql.org/docs/
2. https://github.com/postgres/postgres
`,
    },
    ["postgres", "sql"],
    ["postgres/postgres", "porsager/postgres", "brianc/node-postgres"],
    {
      stack: "PostgreSQL primary + Node pooler in DNA apps",
      failureModes: [
        "Pool exhaustion / too many connections",
        "Long migration locks",
        "Replication lag misread as consistency",
        "Disk full on WAL",
      ],
      recipes: [
        "Apply forward migration on staging + rollback plan",
        "Failover drill (promote replica or restore backup)",
        "Explain analyze a slow query and add index safely",
      ],
      security: [
        "Least-privilege DB roles per service",
        "SSL/TLS to database",
        "No public 5432; jump host or private network",
        "PII columns minimized; audit access",
      ],
      metrics: ["connections in use", "txn rate", "slow queries", "replication lag"],
    },
  ),

  p0(
    "databases/redis",
    "Redis",
    "platforms",
    "Redis — cache, sessions, rate limits, queues (use carefully)",
    {
      positioning: `# Redis

In-memory store for cache, ephemeral sessions, rate limits, and lightweight queues. Not a system of record unless intentionally designed (Redis persistence / RedisJSON cases).
`,
      architecture: `# Architecture

App → Redis (single/cluster)  
Namespaces by key prefix. TTLs mandatory for caches.
`,
      integration: `# Integration

Pair with Postgres as SoR. DNA Lab may use Redis-compatible adapters for shared state.
`,
      checklist: `# Checklist

- [ ] TTL on cache keys
- [ ] Key prefix per env/tenant
- [ ] Eviction policy understood
- [ ] No unbounded lists without trim
`,
      examples: `# Example

Rate limit: \`INCR\` + \`EXPIRE\` sliding or fixed window; fail open vs closed by product risk.
`,
      antiPatterns: `# Anti-patterns

- Treating Redis as durable primary without persistence story
- Giant keys blocking single-threaded event loop
`,
      references: `# References

1. https://redis.io/docs/
2. https://github.com/redis/redis
`,
    },
    ["redis", "cache"],
    ["redis/redis", "redis/ioredis", "redis/node-redis"],
    {
      stack: "Redis cache/session beside Postgres",
      failureModes: ["OOM eviction storms", "Hot key", "Split-brain in misconfigured cluster"],
      recipes: ["Cache stampede protection", "Flush namespace in staging only", "Failover to DB-only path"],
      security: ["AUTH/ACL", "TLS", "No dangerous commands on prod ACL"],
      metrics: ["memory used", "evictions", "hit rate", "ops/sec"],
    },
  ),

  p0(
    "databases/mongodb",
    "MongoDB",
    "platforms",
    "MongoDB — document model, indexes, transactions boundaries",
    {
      positioning: `# MongoDB

Document store when flexible schemas and horizontal scale matter. Prefer clear collection boundaries and indexes from day one.
`,
      architecture: `# Architecture

App → mongos/replica set → collections  
Transactions only within documented limits; design for single-document atomicity first.
`,
      integration: `# Integration

Official drivers; change streams for projections. Pair carefully with relational reporting needs.
`,
      checklist: `# Checklist

- [ ] Indexes for hot queries
- [ ] Schema validation or Zod at edge
- [ ] Backup/restore drill
`,
      examples: `# Example

Store tenantId in every document; compound index \`{ tenantId: 1, createdAt: -1 }\`.
`,
      antiPatterns: `# Anti-patterns

- Unbounded arrays in documents
- Ignoring working set vs RAM
`,
      references: `# References

1. https://www.mongodb.com/docs/
2. https://github.com/mongodb/mongo
`,
    },
    ["mongodb", "document"],
    ["mongodb/mongo", "mongodb/node-mongodb-native", "automattic/mongoose"],
    {
      stack: "MongoDB document API for flexible domains",
      failureModes: ["Missing index → collection scan", "Oplog window issues", "Large document writes"],
      recipes: ["Add index with rolling build", "Explain a slow query", "Restore collection from backup"],
      security: ["SCRAM auth", "Network isolation", "Field-level encryption when needed"],
      metrics: ["ops counters", "connections", "replication lag", "page faults"],
    },
  ),

  p0(
    "databases/prisma",
    "Prisma",
    "platforms",
    "Prisma ORM — schema, migrate, client, tenancy patterns",
    {
      positioning: `# Prisma

Typed ORM popular in DNA/Next stacks. Schema-first; migrate thoughtfully for prod locks.
`,
      architecture: `# Architecture

\`schema.prisma\` → migrate → Prisma Client  
Prefer explicit transactions for multi-step writes.
`,
      integration: `# Integration

Pair \`databases/postgresql\`. Avoid long interactive transactions under load.
`,
      checklist: `# Checklist

- [ ] \`prisma migrate\` reviewed
- [ ] No N+1 (use include wisely)
- [ ] Connection limit vs serverless
`,
      examples: `# Example

Use \`prisma.$transaction\` for invariants; \`select\` only needed fields.
`,
      antiPatterns: `# Anti-patterns

- \`db push\` to production
- Ignoring serverless connection storms
`,
      references: `# References

1. https://www.prisma.io/docs
2. https://github.com/prisma/prisma
`,
    },
    ["prisma", "orm"],
    ["prisma/prisma", "prisma/prisma-engines", "prisma/prisma-client-js"],
    {
      stack: "Prisma Client on PostgreSQL",
      failureModes: ["Migration lock", "N+1 queries", "Serverless connection exhaustion"],
      recipes: ["Generate + migrate on staging", "Trace a slow findMany", "Roll forward expand/contract"],
      security: ["Parameterized queries (default)", "No raw SQL with string concat"],
      metrics: ["query duration", "pool wait", "migration success"],
    },
  ),

  p0(
    "databases/drizzle",
    "Drizzle",
    "platforms",
    "Drizzle ORM — SQL-like TypeScript schema and migrations",
    {
      positioning: `# Drizzle

Lightweight SQL-oriented ORM. Prefer when you want closer-to-SQL control than Prisma.
`,
      architecture: `# Architecture

Schema TS → drizzle-kit migrations → db client  
Transactions and prepared statements first-class.
`,
      integration: `# Integration

Pair Postgres. Works well with edge/serverless when pooled.
`,
      checklist: `# Checklist

- [ ] Migrations reviewed as SQL
- [ ] Types regenerated in CI
`,
      examples: `# Example

\`db.select().from(users).where(eq(users.id, id))\` with explicit joins.
`,
      antiPatterns: `# Anti-patterns

- Hand-editing migrated SQL without team convention
`,
      references: `# References

1. https://orm.drizzle.team
2. https://github.com/drizzle-team/drizzle-orm
`,
    },
    ["drizzle", "orm"],
    ["drizzle-team/drizzle-orm", "drizzle-team/drizzle-orm", "postgres/postgres"],
    {
      stack: "Drizzle ORM + PostgreSQL",
      failureModes: ["Drift between schema TS and DB", "Missing indexes on joins"],
      recipes: ["Generate migration diff", "Run migrate in staging", "Explain join query"],
      security: ["Parameterized SQL", "Least privilege DB user"],
      metrics: ["query time", "migration status"],
    },
  ),

  p0(
    "databases/supabase-platform",
    "Supabase Platform",
    "platforms",
    "Supabase — Postgres, Auth, Storage, RLS, Edge Functions",
    {
      positioning: `# Supabase

Postgres BaaS with Auth, Storage, Realtime. Treat RLS as mandatory for multi-tenant tables.
`,
      architecture: `# Architecture

Client → Supabase APIs → Postgres + RLS  
Service role key only on server. Never expose service role to browser.
`,
      integration: `# Integration

Pair \`auth/*\` decisions carefully (Supabase Auth vs Clerk). DNA often uses Clerk + own DB — choose one tenancy story.
`,
      checklist: `# Checklist

- [ ] RLS policies tested
- [ ] Service role server-only
- [ ] Storage buckets not public by accident
`,
      examples: `# Example

Policy: \`auth.uid() = user_id\` on profile rows; integration test with two users.
`,
      antiPatterns: `# Anti-patterns

- Disabling RLS temporarily in prod
- Shipping service role in Next public env
`,
      references: `# References

1. https://supabase.com/docs
2. https://github.com/supabase/supabase
`,
    },
    ["supabase", "baas"],
    ["supabase/supabase", "supabase/postgres", "supabase/auth"],
    {
      stack: "Supabase Postgres + Auth + Storage",
      failureModes: ["RLS hole", "Service key leak", "Storage public ACL"],
      recipes: ["RLS policy test matrix", "Rotate keys", "Restore from Supabase backup"],
      security: ["RLS on", "service_role server-only", "JWT verification"],
      metrics: ["API errors", "DB CPU", "auth failures"],
    },
  ),

  p0(
    "ai/openai",
    "OpenAI",
    "platforms",
    "OpenAI APIs — chat, tools, embeddings, safety defaults",
    {
      positioning: `# OpenAI

Major LLM provider. Prefer structured outputs + tool calls with server-side keys. Route via AI Gateway when on Vercel unless direct wiring is required.
`,
      architecture: `# Architecture

Client → your API → OpenAI (or gateway) → validate output  
Never trust model output for authZ or money movement without checks.
`,
      integration: `# Integration

Pair \`ai/vercel-ai-sdk\`, \`ai/rag-patterns\`, evals. Log prompts carefully (PII).
`,
      checklist: `# Checklist

- [ ] API keys server-only
- [ ] Timeouts + retries bounded
- [ ] Output validation
- [ ] Cost/budget alerts
`,
      examples: `# Example

Tool call → execute in your backend with auth → return tool result → model continues.
`,
      antiPatterns: `# Anti-patterns

- Client-side API keys
- Unvalidated JSON from the model into SQL
`,
      references: `# References

1. https://platform.openai.com/docs
2. https://github.com/openai/openai-node
`,
    },
    ["openai", "llm"],
    ["openai/openai-node", "openai/openai-python", "openai/openai-openapi"],
    {
      stack: "OpenAI chat/embeddings via server SDK",
      failureModes: ["Rate limits", "Prompt injection", "Hallucinated tool args", "Cost spikes"],
      recipes: ["Streaming chat with abort", "Tool-call roundtrip", "Embedding + cosine retrieval smoke"],
      security: ["Server keys", "Output schema validation", "PII redaction in logs"],
      metrics: ["tokens", "latency", "error rate", "cost/day"],
    },
  ),

  p0(
    "ai/anthropic",
    "Anthropic",
    "platforms",
    "Anthropic Claude — messages API, tools, safety",
    {
      positioning: `# Anthropic

Claude models for assistants and agents. Same rules as other LLMs: server keys, validate outputs, bound autonomy.
`,
      architecture: `# Architecture

Messages API ± tools ± computer use (if enabled with strict allowlists).
`,
      integration: `# Integration

Pair AI SDK provider strings or \`@ai-sdk/anthropic\` only when direct wiring is intentional.
`,
      checklist: `# Checklist

- [ ] Max tokens / budgets set
- [ ] Tool allowlist tight
- [ ] Human oversight for high-risk actions
`,
      examples: `# Example

System prompt states non-goals; tools require user confirmation for destructive ops.
`,
      antiPatterns: `# Anti-patterns

- Unbounded agent loops
- Trusting citations without retrieval evidence
`,
      references: `# References

1. https://docs.anthropic.com
2. https://github.com/anthropics/anthropic-sdk-typescript
`,
    },
    ["anthropic", "claude", "llm"],
    [
      "anthropics/anthropic-sdk-typescript",
      "anthropics/anthropic-sdk-python",
      "anthropics/anthropic-sdk-typescript",
    ],
    {
      stack: "Anthropic Claude messages + tools",
      failureModes: ["Over-refusal or under-refusal", "Tool loops", "Context overflow"],
      recipes: ["Tool use with confirmation", "Long-context summary pipeline", "Safety eval sample"],
      security: ["Server keys", "Allowlisted tools", "No silent prod mutations"],
      metrics: ["tokens", "tool error rate", "latency"],
    },
  ),

  p0(
    "ai/vercel-ai-sdk",
    "Vercel AI SDK",
    "platforms",
    "AI SDK — streaming UI, tools, gateway model strings",
    {
      positioning: `# Vercel AI SDK

Default orchestration for streaming chat UIs on Vercel. Prefer \`"provider/model"\` via AI Gateway unless the user asks for direct provider packages.
`,
      architecture: `# Architecture

\`streamText\` / \`generateObject\` → UI stream hooks  
Keep tools server-side with auth.
`,
      integration: `# Integration

Pair Next.js Route Handlers, \`ai/rag-patterns\`, observability.
`,
      checklist: `# Checklist

- [ ] Abort signals wired
- [ ] Object schemas validated
- [ ] Gateway vs direct provider intentional
`,
      examples: `# Example

\`streamText({ model: "openai/gpt-4.1", tools, onStepFinish })\` with Zod tool inputs.
`,
      antiPatterns: `# Anti-patterns

- Shipping without stream error UI
- Tools that mutate without auth
`,
      references: `# References

1. https://sdk.vercel.ai/docs
2. https://github.com/vercel/ai
`,
    },
    ["ai-sdk", "vercel"],
    ["vercel/ai", "vercel/ai", "colinhacks/zod"],
    {
      stack: "Vercel AI SDK + Next.js Route Handlers",
      failureModes: ["Stream disconnect", "Tool schema mismatch", "Gateway misconfig"],
      recipes: ["Streaming chat UI smoke", "generateObject roundtrip", "Tool auth denial path"],
      security: ["Auth on chat route", "Validate tool args", "No client provider keys"],
      metrics: ["TTFT", "stream errors", "tool success rate"],
    },
  ),

  p0(
    "ai/langchain",
    "LangChain",
    "platforms",
    "LangChain — chains, agents, callbacks — use when abstraction pays off",
    {
      positioning: `# LangChain

Orchestration framework. Prefer AI SDK for simple Next apps; use LangChain when you need broad integrations and agent graphs.
`,
      architecture: `# Architecture

Runnable sequences / LCEL → tools → memory/checkpointers  
Keep side effects explicit.
`,
      integration: `# Integration

Pair vector stores via \`ai/rag-patterns\`. Evaluate before adding agent complexity.
`,
      checklist: `# Checklist

- [ ] Tracing enabled (LangSmith or OTEL)
- [ ] Tool timeouts
- [ ] Eval set for golden prompts
`,
      examples: `# Example

Retrieval → stuff/map-reduce → generate with citations required.
`,
      antiPatterns: `# Anti-patterns

- Agent with write tools and no human gate
- Opaque chains nobody can debug
`,
      references: `# References

1. https://js.langchain.com/docs
2. https://github.com/langchain-ai/langchainjs
`,
    },
    ["langchain", "agents"],
    ["langchain-ai/langchainjs", "langchain-ai/langchain", "langchain-ai/langgraph"],
    {
      stack: "LangChain JS orchestration",
      failureModes: ["Hidden retries", "Memory leaks in long agents", "Tool storms"],
      recipes: ["Traced chain run", "Agent with read-only tools", "Eval regression on golden set"],
      security: ["Tool allowlists", "No secrets in prompts logged"],
      metrics: ["chain latency", "tool calls/run", "eval pass rate"],
    },
  ),

  p0(
    "ai/rag-patterns",
    "RAG Patterns",
    "platforms",
    "Retrieval-augmented generation — chunking, citations, evals",
    {
      positioning: `# RAG Patterns

Ground LLM answers in your corpus. Prefer citations + refusal when retrieval is weak.
`,
      architecture: `# Architecture

Ingest → chunk → embed → index → retrieve → generate → cite  
Eval: faithfulness, relevance, answer quality.
`,
      integration: `# Integration

Pair vector DB packs, \`ai/openai\` embeddings, AI SDK generate step.
`,
      checklist: `# Checklist

- [ ] Chunking strategy documented
- [ ] Citation UX required
- [ ] Eval set versioned
- [ ] PII scrubbed from index where needed
`,
      examples: `# Example

If top-k scores below threshold → answer “I don’t know” with links to search.
`,
      antiPatterns: `# Anti-patterns

- Dumping entire corpus into the prompt
- Hallucinated citations
`,
      references: `# References

1. RAG survey literature / vendor guides
2. \`ai/vercel-ai-sdk\`, \`ai/openai\`
`,
    },
    ["rag", "retrieval"],
    ["openai/openai-node", "langchain-ai/langchainjs", "vercel/ai"],
    {
      stack: "Chunk → embed → retrieve → generate with citations",
      failureModes: ["Bad chunking", "Stale index", "Prompt injection via docs"],
      recipes: ["Reindex subset", "Citation-required answer", "Eval fail on hallucinated cite"],
      security: ["Sanitize retrieved text", "Access control on corpus"],
      metrics: ["retrieval hit rate", "faithfulness eval", "p95 answer latency"],
    },
  ),

  p0(
    "discovery/overview",
    "Discovery Overview",
    "discovery",
    "Discovery operating system — when to research vs build",
    {
      positioning: `# Discovery Overview

Entry pack for continuous discovery. Ground in DNA CLI + CellularMemory; never invent users from stub Impressions.
`,
      architecture: `# Architecture

Opportunities → solutions → experiments → delivery handoff  
Pair methodology size packs for cadence.
`,
      integration: `# Integration

Combos: \`combo/product-canvas-creation\`, \`combo/pmf-check\`. Stems: discovery-setup, pmf-check.
`,
      checklist: `# Checklist

- [ ] Opportunity framed as user outcome
- [ ] Assumption log started
- [ ] Impression Guard applied
`,
      examples: `# Example

Opportunity: “Clinicians abandon note review” → interview + instrumentation before big build.
`,
      antiPatterns: `# Anti-patterns

- Discovery theatre with no decisions
- Building the solution in the research spike
`,
      references: `# References

1. Teresa Torres continuous discovery
2. \`discovery/continuous-discovery\`
`,
    },
    ["discovery"],
    ["openpractice/library", "scrum/scrum-guide", "basecamp/handbook"],
    {
      stack: "Discovery OS for DNA product teams",
      failureModes: ["Stub personas treated as truth", "No decision after research", "Research forever"],
      recipes: ["Assumption map workshop", "Interview plan", "Handoff brief to delivery"],
      security: ["Consent for research recordings", "PII minimization in notes"],
      metrics: ["assumptions validated/killed", "time-to-decision", "delivery rework from bad discovery"],
    },
  ),

  p0(
    "discovery/continuous-discovery",
    "Continuous Discovery",
    "discovery",
    "Weekly cadences — opportunities, interviews, experiments",
    {
      positioning: `# Continuous Discovery

Ongoing product learning, not a phase gate. Keep a backlog of opportunities ranked by outcome.
`,
      architecture: `# Architecture

Opportunity solution tree → interview snippets → experiment cards
`,
      integration: `# Integration

Pair \`discovery/opportunity-solution-tree\`, dual-track agile.
`,
      checklist: `# Checklist

- [ ] Weekly touch with users/customers
- [ ] Opportunities ranked
- [ ] Experiments have kill criteria
`,
      examples: `# Example

Two interviews/week minimum for product trio when shipping weekly.
`,
      antiPatterns: `# Anti-patterns

- Outsourcing all discovery to a separate team with no builders
`,
      references: `# References

1. Continuous Discovery Habits
2. \`discovery/overview\`
`,
    },
    ["discovery", "cadence"],
    ["openpractice/library", "scrum/scrum-guide", "basecamp/handbook"],
    {
      stack: "Weekly discovery cadence + opportunity tree",
      failureModes: ["Interview without synthesis", "Solution jumping", "No kill criteria"],
      recipes: ["Opportunity ranking", "Story map lite", "Experiment card"],
      security: ["Research consent", "Anonymize quotes in Impressions"],
      metrics: ["interviews/week", "experiments run", "pivot/persevere decisions"],
    },
  ),

  p0(
    "discovery/product-market-fit",
    "Product-Market Fit",
    "discovery",
    "PMF signals — retention, Sean Ellis, qualitative saturation",
    {
      positioning: `# Product-Market Fit

Treat PMF as evidence, not vibes. Combine retention, willingness-to-pay, and qualitative saturation.
`,
      architecture: `# Architecture

ICP → must-have survey → retention cohorts → qualitative jobs
`,
      integration: `# Integration

\`combo/pmf-check\`, lifecycle packs. Label weak data as assumptions.
`,
      checklist: `# Checklist

- [ ] ICP written
- [ ] Retention definition agreed
- [ ] Survey bias acknowledged
`,
      examples: `# Example

Sean Ellis ≥40% “very disappointed” is a signal, not a law — triangulate.
`,
      antiPatterns: `# Anti-patterns

- Declaring PMF from vanity signups
`,
      references: `# References

1. PMF literature / Superhuman surveys
2. \`discovery/lifecycle/pmf\`
`,
    },
    ["pmf", "discovery"],
    ["openpractice/library", "basecamp/handbook", "scrum/scrum-guide"],
    {
      stack: "PMF evidence loop for DNA SaaS",
      failureModes: ["Wrong ICP", "Survey bias", "Confusing launch spike with retention"],
      recipes: ["Must-have survey", "Cohort retention chart", "Kill feature that doesn’t move retention"],
      security: ["Consent on surveys", "No deceptive patterns"],
      metrics: ["retention D7/D30", "must-have %", "qualified pipeline"],
    },
  ),

  p0(
    "discovery/opportunity-solution-tree",
    "Opportunity Solution Tree",
    "discovery",
    "OST — outcome → opportunities → solutions → experiments",
    {
      positioning: `# Opportunity Solution Tree

Visual structure linking desired outcome to opportunities and solution experiments.
`,
      architecture: `# Architecture

Outcome → Opportunities → Solutions → Experiments  
One outcome per tree; prune ruthlessly.
`,
      integration: `# Integration

Write tree under Impressions/discovery. Pair continuous discovery.
`,
      checklist: `# Checklist

- [ ] Outcome measurable
- [ ] Opportunities are user needs not features
- [ ] Experiments cheap
`,
      examples: `# Example

Outcome: ↑ activation → Opportunity: unclear first value → Solution: checklist onboarding → Experiment: 50% cohort.
`,
      antiPatterns: `# Anti-patterns

- Feature ideas as “opportunities”
`,
      references: `# References

1. Teresa Torres OST
2. \`discovery/continuous-discovery\`
`,
    },
    ["ost", "discovery"],
    ["openpractice/library", "basecamp/handbook", "scrum/scrum-guide"],
    {
      stack: "OST artifact for product trio",
      failureModes: ["Multiple outcomes on one tree", "No experiments", "Solution bias"],
      recipes: ["Build OST in workshop", "Pick top opportunity", "Design kill criteria"],
      security: ["No customer PII on public boards"],
      metrics: ["opportunities validated", "experiments/week"],
    },
  ),

  p0(
    "compliance/gdpr",
    "GDPR",
    "compliance",
    "GDPR engineering — lawful basis, DPIA triggers, DSAR, retention",
    {
      positioning: `# GDPR

EU/UK personal data rules. Engineering must implement minimization, rights, and security — counsel for legal advice.
`,
      architecture: `# Architecture

Data map → lawful basis → retention → DSAR/deletion → breach process  
Pair \`compliance/tiered-standards\` for maturity bands.
`,
      integration: `# Integration

\`dna plan compliance\`, legal packs. Impression Guard on policy stubs.
`,
      checklist: `# Checklist

- [ ] RoPA / data inventory exists
- [ ] Deletion path tested
- [ ] Subprocessors listed
- [ ] Breach timer understood
`,
      examples: `# Example

DSAR export job with authZ + audit log; 30-day deletion verification.
`,
      antiPatterns: `# Anti-patterns

- Claiming “GDPR compliant hosting” as product compliance
- Infinite log retention “just in case”
`,
      references: `# References

1. ICO / EDPB guidance
2. \`compliance/tiered-standards\`
`,
    },
    ["gdpr", "privacy"],
    ["openpractice/library", "OWASP/CheatSheetSeries", "superhumaan/DNA"],
    {
      stack: "GDPR controls in DNA apps (EU/UK personal data)",
      failureModes: ["No deletion path", "Uncleared subprocessors", "Over-collection"],
      recipes: ["DSAR export drill", "Deletion verification", "DPIA trigger checklist"],
      security: ["Encryption in transit/at rest", "Access logs", "Minimize PII in analytics"],
      metrics: ["DSAR SLA", "deletion success", "open DPIAs"],
    },
  ),

  p0(
    "compliance/soc2",
    "SOC 2",
    "compliance",
    "SOC 2 Trust Services — evidence, access reviews, change management",
    {
      positioning: `# SOC 2

Common B2B assurance. Engineering produces continuous evidence — not a once-a-year PDF theatre.
`,
      architecture: `# Architecture

Control matrix → owners → evidence automation (CI, access reviews, tickets)
`,
      integration: `# Integration

Pair security discipline, \`cloud/github-actions\`, ticketing. Use tiered standards for org size.
`,
      checklist: `# Checklist

- [ ] Access reviews scheduled
- [ ] Change tickets for prod
- [ ] Incident procedure tested
- [ ] Vendor inventory current
`,
      examples: `# Example

CI logs + deploy approvals as change evidence; quarterly access review export.
`,
      antiPatterns: `# Anti-patterns

- Spreadsheet evidence nobody updates
- Admin shared accounts
`,
      references: `# References

1. AICPA TSC overview
2. \`compliance/tiered-standards\`
`,
    },
    ["soc2", "trust"],
    ["openpractice/library", "OWASP/CheatSheetSeries", "superhumaan/DNA"],
    {
      stack: "SOC 2 evidence via CI + access + incident tooling",
      failureModes: ["Missing evidence period", "Orphan admin accounts", "Undocumented prod changes"],
      recipes: ["Access review export", "Incident tabletop", "Vendor risk refresh"],
      security: ["MFA", "Least privilege", "Audit logs retained"],
      metrics: ["open control gaps", "review completion %", "MTTR"],
    },
  ),

  p0(
    "compliance/hipaa-depth",
    "HIPAA Depth",
    "compliance",
    "HIPAA Security & Privacy — BAAs, safeguards, audit",
    {
      positioning: `# HIPAA Depth

US health data (PHI). Beyond overview: map administrative, physical, technical safeguards to engineering work.
`,
      architecture: `# Architecture

BAA graph → PHI inventory → access control → audit → breach playbooks
`,
      integration: `# Integration

\`industries/healthcare\`, \`methodologies/industry-healthcare\`, FHIR packs.
`,
      checklist: `# Checklist

- [ ] BAA before PHI to vendor
- [ ] Audit every PHI access path
- [ ] Minimum necessary
- [ ] Encryption + key mgmt
`,
      examples: `# Example

Break-glass access with reason code + post-review.
`,
      antiPatterns: `# Anti-patterns

- PHI in plain logs/analytics
- Claiming HIPAA because AWS is HIPAA-eligible
`,
      references: `# References

1. HHS HIPAA Security Rule
2. \`healthcare/*\` packs
`,
    },
    ["hipaa", "healthcare"],
    ["openpractice/library", "OWASP/CheatSheetSeries", "superhumaan/DNA"],
    {
      stack: "HIPAA technical safeguards in health-tech apps",
      failureModes: ["PHI in logs", "Missing BAA", "Over-broad DB roles"],
      recipes: ["PHI data-flow diagram update", "Access audit sample", "Breach tabletop"],
      security: ["Encrypt PHI", "Unique user IDs", "Auto logoff / session controls"],
      metrics: ["PHI access anomalies", "open BAAs", "training completion"],
    },
  ),

  p0(
    "compliance/pci-dss-depth",
    "PCI DSS Depth",
    "compliance",
    "PCI DSS — reduce scope, never store PAN, segment network",
    {
      positioning: `# PCI DSS Depth

Cardholder data rules. Prefer Stripe/Checkout to minimize scope; never store PAN/CVV.
`,
      architecture: `# Architecture

Scoped CDE → SAQ vs full ROC → ASV scans → segmentation evidence
`,
      integration: `# Integration

\`payments/stripe\`, network diagrams, logging without PAN.
`,
      checklist: `# Checklist

- [ ] No PAN in DB/logs
- [ ] Webhook + TLS verified
- [ ] Scope diagram current
`,
      examples: `# Example

Hosted fields / Checkout → tokens only in your DB.
`,
      antiPatterns: `# Anti-patterns

- Custom card forms without PCI expertise
- Logging authorization payloads with PAN
`,
      references: `# References

1. PCI SSC docs
2. \`payments/stripe\`
`,
    },
    ["pci", "payments"],
    ["stripe/stripe-node", "OWASP/CheatSheetSeries", "superhumaan/DNA"],
    {
      stack: "PCI scope minimization via Stripe Checkout/tokens",
      failureModes: ["Accidental PAN storage", "Scope creep", "Failed ASV"],
      recipes: ["Scope diagram review", "Log scrub test", "SAQ evidence pack"],
      security: ["No CVV storage", "TLS everywhere", "Least privilege to payment admin"],
      metrics: ["scope systems count", "ASV findings", "payment error rate"],
    },
  ),
];
