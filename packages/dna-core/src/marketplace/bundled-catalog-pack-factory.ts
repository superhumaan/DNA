import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";
import type { PackMaturity } from "./catalog-maturity.js";

export interface CatalogPlatformDef {
  /** Full pack id, e.g. `databases/postgresql` or `healthcare/fhir` */
  id: string;
  name: string;
  description: string;
  when: string;
  how: string;
  category?: KnowledgePack["category"];
  tags?: string[];
  maturity?: PackMaturity;
}

function architectureContent(name: string, when: string): string {
  return `# ${name} — Architecture

## When to use
${when}

## System boundaries
- Document integration points in Impressions: \`architecture/system-boundaries.md\`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with \`disciplines/security\` and \`compliance/tiered-standards\`
- Run \`dna plan compliance\` when regulated data is involved
`;
}

function checklistContent(name: string, how: string): string {
  return `# ${name} — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
${how}

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
`;
}

export function packsFromDefs(defs: CatalogPlatformDef[]): KnowledgePack[] {
  return defs.map((d) => {
    const segment = d.id.split("/")[0] ?? "platforms";
    const tags = d.tags ?? [segment, ...(d.id.includes("/") ? [d.id.split("/").pop()!] : [])];
    return catalogPack(
      d.id,
      d.name,
      d.category ?? "platforms",
      d.description,
      [
        {
          path: `${d.id}/positioning.dna.md`,
          content: `# ${d.name}\n\n${d.when}`,
        },
        {
          path: `${d.id}/integration.dna.md`,
          content: `# ${d.name} — Integration\n\n${d.how}`,
        },
        {
          path: `${d.id}/architecture.dna.md`,
          content: architectureContent(d.name, d.when),
        },
        {
          path: `${d.id}/checklist.dna.md`,
          content: checklistContent(d.name, d.how),
        },
      ],
      tags,
      d.maturity,
    );
  });
}

export function def(
  id: string,
  name: string,
  description: string,
  when: string,
  how: string,
  tags?: string[],
  category?: KnowledgePack["category"],
  maturity?: PackMaturity,
): CatalogPlatformDef {
  return { id, name, description, when, how, tags, category, maturity };
}
