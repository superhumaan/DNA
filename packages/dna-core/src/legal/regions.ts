import type { LegalDomain, LegalJurisdiction } from "./catalog.js";
import { LEGAL_DOMAIN_CATALOG, LEGAL_JURISDICTION_CATALOG } from "./catalog.js";

/** Map project description keywords to country-specific legal packs. */
export function resolveLegalJurisdictionPackIds(description: string): string[] {
  const d = description.toLowerCase();
  const matches = new Set<string>();

  const rules: Array<{ jurisdiction: LegalJurisdiction; patterns: RegExp[] }> = [
    { jurisdiction: "eu", patterns: [/\b(eu|europe|european union|gdpr)\b/, /\b(berlin|paris|amsterdam|dublin)\b.*\b(office|market)\b/] },
    { jurisdiction: "uk", patterns: [/\b(uk|united kingdom|britain|british|england|scotland|wales)\b/, /\bnhs\b/, /\bico\b/] },
    { jurisdiction: "us", patterns: [/\b(us|usa|united states|american)\b/, /\bhipaa\b/, /\bccpa\b/, /\b(cali|california)\b/] },
    { jurisdiction: "sg", patterns: [/\b(singapore)\b/, /\bpdpa\b.*\bsg\b/, /\bmas\b.*\b(singapore|sg)\b/] },
    { jurisdiction: "th", patterns: [/\b(thailand|thai)\b/, /\bpdpa\b.*\bthai\b/] },
    { jurisdiction: "my", patterns: [/\b(malaysia|malaysian)\b/] },
    { jurisdiction: "au", patterns: [/\b(australia|australian)\b/, /\boaic\b/] },
    { jurisdiction: "ca", patterns: [/\b(canada|canadian)\b/, /\bpipeda\b/] },
    { jurisdiction: "in", patterns: [/\b(india|indian)\b/, /\bdpdp\b/, /\brbi\b/] },
    { jurisdiction: "br", patterns: [/\b(brazil|brazilian)\b/, /\blgpd\b/] },
    { jurisdiction: "jp", patterns: [/\b(japan|japanese)\b/, /\bappi\b/] },
    { jurisdiction: "kr", patterns: [/\b(south korea|korean)\b/, /\bpipa\b.*\bkorea\b/] },
    { jurisdiction: "id", patterns: [/\b(indonesia|indonesian)\b/] },
    { jurisdiction: "ph", patterns: [/\b(philippines|filipino)\b/] },
    { jurisdiction: "vn", patterns: [/\b(vietnam|vietnamese)\b/, /\btiếng việt\b/] },
    { jurisdiction: "hk", patterns: [/\b(hong kong)\b/] },
    { jurisdiction: "tw", patterns: [/\b(taiwan|taiwanese)\b/] },
    { jurisdiction: "cn", patterns: [/\b(china|chinese)\b/, /\bpipl\b/] },
  ];

  for (const { jurisdiction, patterns } of rules) {
    if (patterns.some((p) => p.test(d))) {
      const meta = LEGAL_JURISDICTION_CATALOG.find((j) => j.id === jurisdiction);
      if (meta) matches.add(meta.packId);
    }
  }

  return [...matches];
}

export function inferDomainsFromText(text: string): LegalDomain[] {
  const lower = text.toLowerCase();
  const domains = new Set<LegalDomain>();

  for (const domain of LEGAL_DOMAIN_CATALOG) {
    if (domain.triggers.some((t) => lower.includes(t))) {
      domains.add(domain.id);
    }
  }

  if (!domains.size) domains.add("privacy");
  return [...domains];
}

export function inferJurisdictionsFromText(text: string): LegalJurisdiction[] {
  const lower = text.toLowerCase();
  const jurisdictions = new Set<LegalJurisdiction>();

  const rules: Array<{ jurisdiction: LegalJurisdiction; patterns: RegExp[] }> = [
    { jurisdiction: "eu", patterns: [/\b(eu|europe|gdpr)\b/] },
    { jurisdiction: "uk", patterns: [/\b(uk|united kingdom|britain)\b/] },
    { jurisdiction: "us", patterns: [/\b(us|usa|united states|american|hipaa|ccpa)\b/] },
    { jurisdiction: "sg", patterns: [/\b(singapore)\b/] },
    { jurisdiction: "th", patterns: [/\b(thailand|thai)\b/] },
    { jurisdiction: "my", patterns: [/\b(malaysia)\b/] },
    { jurisdiction: "au", patterns: [/\b(australia)\b/] },
    { jurisdiction: "ca", patterns: [/\b(canada|pipeda)\b/] },
    { jurisdiction: "in", patterns: [/\b(india|dpdp)\b/] },
    { jurisdiction: "br", patterns: [/\b(brazil|lgpd)\b/] },
    { jurisdiction: "jp", patterns: [/\b(japan)\b/] },
    { jurisdiction: "kr", patterns: [/\b(korea)\b/] },
    { jurisdiction: "id", patterns: [/\b(indonesia)\b/] },
    { jurisdiction: "ph", patterns: [/\b(philippines)\b/] },
    { jurisdiction: "vn", patterns: [/\b(vietnam)\b/] },
    { jurisdiction: "hk", patterns: [/\b(hong kong)\b/] },
    { jurisdiction: "tw", patterns: [/\b(taiwan)\b/] },
    { jurisdiction: "cn", patterns: [/\b(china|pipl)\b/] },
  ];

  for (const { jurisdiction, patterns } of rules) {
    if (patterns.some((p) => p.test(lower))) jurisdictions.add(jurisdiction);
  }

  return [...jurisdictions];
}

export function domainKnowledgePaths(domains: LegalDomain[]): string[] {
  const paths = new Set<string>([
    "legal/overview.dna.md",
    "legal/advisor-process.dna.md",
    "legal/disclaimers.dna.md",
    "legal/matrices/domain-by-sector.dna.md",
  ]);
  for (const domain of domains) {
    const meta = LEGAL_DOMAIN_CATALOG.find((d) => d.id === domain);
    meta?.packPaths.forEach((p) => paths.add(p));
  }
  return [...paths];
}

export function jurisdictionKnowledgePaths(jurisdictions: LegalJurisdiction[]): string[] {
  const paths = new Set<string>(["legal/regions/overview.dna.md"]);
  for (const j of jurisdictions) {
    const meta = LEGAL_JURISDICTION_CATALOG.find((x) => x.id === j);
    if (meta) {
      paths.add(`legal/regions/${meta.id}/positioning.dna.md`);
      paths.add(`legal/regions/${meta.id}/engineering-checklist.dna.md`);
    }
  }
  return [...paths];
}

export function jurisdictionPackIds(jurisdictions: LegalJurisdiction[]): string[] {
  return jurisdictions
    .map((j) => LEGAL_JURISDICTION_CATALOG.find((x) => x.id === j)?.packId)
    .filter((id): id is string => Boolean(id));
}
