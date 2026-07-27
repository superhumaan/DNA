import type { KnowledgePack } from "@superhumaan/dna-config";
import type { PackMaturity } from "./catalog-maturity.js";
import { richCatalogPack } from "./pack-richness.js";

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

/** Wave defs → richness-bar packs (assets + longtail depth). */
export function packsFromDefs(defs: CatalogPlatformDef[]): KnowledgePack[] {
  return defs.map((d) => {
    const segment = d.id.split("/")[0] ?? "platforms";
    const tags = d.tags ?? [segment, ...(d.id.includes("/") ? [d.id.split("/").pop()!] : [])];
    const pack = richCatalogPack(
      d.id,
      d.name,
      d.category ?? "platforms",
      d.description,
      {
        positioning: `# ${d.name}\n\n${d.when}\n\n${d.description}\n`,
        architecture: architectureContent(d.name, d.when),
        integration: `# ${d.name} — Integration\n\n${d.how}\n`,
        checklist: checklistContent(d.name, d.how),
        examples: `# ${d.name} — Examples\n\n## Happy path\n${d.how}\n\n## Verify\nExercise the primary flow in staging; confirm logs omit secrets.\n`,
        antiPatterns: `# ${d.name} — Anti-patterns\n\n- Secrets in repo or client bundles\n- Skipping signature verification on webhooks\n- Treating stub Impressions as live controls\n- No rollback plan\n`,
        references: `# ${d.name} — References\n\n1. Official documentation for ${d.name}\n2. DNA \`disciplines/security\` + compliance packs when regulated\n3. Project Impressions (non-stub only)\n`,
      },
      ["catalog-wave", ...tags],
      {
        longtailDepth: true,
        fixtureName: `${d.id.replace(/\//g, "-")}-sample`,
        domain: {
          stack: `${d.name} (${d.id})`,
          failureModes: [
            `${d.name} misconfiguration`,
            `Vendor outage / rate limit`,
            `Webhook or auth drift`,
          ],
          recipes: [`${d.name} staging smoke`, `${d.name} failure path`, `${d.name} rollback`],
          security: ["Secrets in vault/env", "Validate webhooks", "Least privilege"],
          metrics: ["error rate", "latency", "saturation"],
        },
      },
    );
    if (d.maturity) {
      return {
        ...pack,
        tags: [
          ...pack.tags.filter((t) => t !== "legacy" && t !== "mainstream" && t !== "emerging"),
          d.maturity,
        ],
      };
    }
    return pack;
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
