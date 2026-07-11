import type { LegalDomain, LegalJurisdiction } from "./catalog.js";
import {
  LEGAL_DOMAIN_CATALOG,
  LEGAL_JURISDICTION_CATALOG,
  getLegalDomain,
  getLegalJurisdiction,
} from "./catalog.js";
import { inferDomainsFromText, inferJurisdictionsFromText } from "./regions.js";

export interface LegalAdvisorInput {
  quote: string;
  projectDescription?: string;
  domains?: LegalDomain[];
  jurisdictions?: LegalJurisdiction[];
}

export interface LegalAdvisorRecommendation {
  priority: "critical" | "high" | "medium";
  area: string;
  action: string;
  rationale: string;
  knowledgePath?: string;
}

export interface LegalAdvisorResult {
  domains: LegalDomain[];
  jurisdictions: LegalJurisdiction[];
  recommendations: LegalAdvisorRecommendation[];
  engineeringRules: string[];
  counselChecklist: string[];
  disclaimer: string;
  brief: string;
}

const DISCLAIMER =
  "DNA Legal Advisor provides engineering-oriented legal **considerations**, not legal advice. " +
  "Engage qualified counsel in each relevant jurisdiction before shipping regulated features.";

function sectorRules(domains: LegalDomain[], jurisdictions: LegalJurisdiction[]): string[] {
  const rules: string[] = [
    "Document lawful basis and purpose for every data field collected",
    "Never ship regulated features without jurisdiction-specific counsel review",
    "Separate legal requirements from engineering controls in architecture docs",
    "Log consent, withdrawals, and policy version accepted per user",
    "Block production deploy if required legal gates are unchecked in compliance matrix",
  ];

  if (domains.includes("banking")) {
    rules.push(
      "Treat payment flows as in-scope for PCI DSS — prefer tokenisation (Stripe/Adyen)",
      "AML/KYC vendor contracts must include data processing terms",
      "Do not store full PAN or CVV; segregate financial data stores",
    );
  }
  if (domains.includes("healthcare")) {
    rules.push(
      "Minimise PHI — encrypt ePHI at rest and in transit",
      "BAA required with every vendor touching PHI (US HIPAA)",
      "No PHI in logs, analytics, or AI training prompts",
    );
  }
  if (domains.includes("privacy")) {
    rules.push(
      "Privacy policy and subprocessors list must match actual data flows",
      "Implement erasure/export within statutory deadlines per jurisdiction",
      "Cookie/consent banner before non-essential tracking",
    );
  }
  if (domains.includes("ip")) {
    rules.push(
      "OSS license audit in CI — block copyleft contamination if policy requires",
      "User-generated content terms must address copyright and takedown",
      "AI outputs: disclose training data sources and third-party IP risk",
    );
  }
  if (domains.includes("ai_governance")) {
    rules.push(
      "Human review for high-risk automated decisions where law requires",
      "Model cards and bias testing for customer-facing AI",
      "EU AI Act risk classification before GA in EU market",
    );
  }

  if (jurisdictions.includes("cn")) {
    rules.push("PIPL: assess localisation and cross-border transfer security assessment");
  }
  if (jurisdictions.some((j) => ["sg", "th", "my"].includes(j))) {
    rules.push("APAC PDPA: appoint DPO where required; maintain consent records");
  }

  return rules;
}

function buildRecommendations(
  domains: LegalDomain[],
  jurisdictions: LegalJurisdiction[],
  quote: string,
): LegalAdvisorRecommendation[] {
  const recs: LegalAdvisorRecommendation[] = [];
  const q = quote.toLowerCase();

  for (const j of jurisdictions) {
    const meta = getLegalJurisdiction(j);
    if (!meta) continue;
    recs.push({
      priority: "critical",
      area: meta.name,
      action: `Install and review \`${meta.packId}\` pack; map product flows to ${meta.primaryLaws.join(", ")}`,
      rationale: meta.scope,
      knowledgePath: `legal/regions/${j}/engineering-checklist.dna.md`,
    });
  }

  for (const d of domains) {
    const meta = getLegalDomain(d);
    if (!meta) continue;
    recs.push({
      priority: d === "banking" || d === "healthcare" ? "critical" : "high",
      area: meta.name,
      action: `Run domain checklist in ${meta.packPaths[0]}`,
      rationale: meta.description,
      knowledgePath: meta.packPaths[0],
    });
  }

  if (q.includes("launch") || q.includes("ship") || q.includes("go live")) {
    recs.push({
      priority: "high",
      area: "Pre-launch legal gate",
      action: "Complete legal sign-off checklist with counsel before production",
      rationale: "Regulated sectors require documented legal review prior to launch",
      knowledgePath: "legal/advisor-process.dna.md",
    });
  }

  if (q.includes("vendor") || q.includes("subprocessor") || q.includes("third party")) {
    recs.push({
      priority: "high",
      area: "Vendor contracts",
      action: "Ensure DPAs/BAAs and SCCs cover all subprocessors in data flow diagram",
      rationale: "Controller liability extends to processor chain",
      knowledgePath: "legal/domains/privacy.dna.md",
    });
  }

  return recs;
}

function counselChecklist(domains: LegalDomain[], jurisdictions: LegalJurisdiction[]): string[] {
  const items = [
    "Terms of service and privacy policy reviewed for target markets",
    "Data processing agreements with cloud and SaaS vendors",
    "Marketing and email compliance (CAN-SPAM, PECR, etc.)",
    "Employee/contractor IP assignment and confidentiality",
  ];

  if (domains.includes("banking")) {
    items.push("Payment services / lending licence assessment", "AML programme and KYC vendor due diligence");
  }
  if (domains.includes("healthcare")) {
    items.push("HIPAA BAA chain or equivalent health privacy agreements");
  }
  if (jurisdictions.includes("eu") || jurisdictions.includes("uk")) {
    items.push("International transfer mechanism (SCCs / UK IDTA / adequacy)");
  }

  return items;
}

export function adviseLegal(input: LegalAdvisorInput): LegalAdvisorResult {
  const combined = [input.quote, input.projectDescription ?? ""].join(" ");
  const domains = input.domains?.length ? input.domains : inferDomainsFromText(combined);
  const jurisdictions = input.jurisdictions?.length
    ? input.jurisdictions
    : inferJurisdictionsFromText(combined);

  const recommendations = buildRecommendations(domains, jurisdictions, input.quote);
  const engineeringRules = sectorRules(domains, jurisdictions);
  const counselItems = counselChecklist(domains, jurisdictions);

  const domainNames = domains.map((d) => LEGAL_DOMAIN_CATALOG.find((x) => x.id === d)?.name ?? d);
  const jurisdictionNames = jurisdictions.map(
    (j) => LEGAL_JURISDICTION_CATALOG.find((x) => x.id === j)?.name ?? j,
  );

  const briefSections = [
    "# DNA Legal Advisor Brief",
    "",
    `_Not legal advice — engineering legal considerations for product decisions._`,
    "",
    "## User question",
    "",
    input.quote,
    "",
    "## Detected domains",
    "",
    domainNames.length ? domainNames.map((n) => `- ${n}`).join("\n") : "- Privacy & data protection (default)",
    "",
    "## Detected jurisdictions",
    "",
    jurisdictionNames.length
      ? jurisdictionNames.map((n) => `- ${n}`).join("\n")
      : "- None detected — specify with `--jurisdictions` or mention countries in your quote",
    "",
    "## Recommendations (priority order)",
    "",
    ...recommendations.map(
      (r) =>
        `### [${r.priority.toUpperCase()}] ${r.area}\n\n**Action:** ${r.action}\n\n**Why:** ${r.rationale}${r.knowledgePath ? `\n\n**Knowledge:** \`.DNA/knowledge/${r.knowledgePath}\`` : ""}`,
    ),
    "",
    "## Engineering rules",
    "",
    ...engineeringRules.map((r) => `- ${r}`),
    "",
    "## Counsel sign-off checklist",
    "",
    ...counselItems.map((c) => `- [ ] ${c}`),
    "",
    "## Disclaimer",
    "",
    DISCLAIMER,
    "",
    "## Commands",
    "",
    "dna plan legal --quote \"...\" --domains banking,privacy --jurisdictions sg,th",
    "dna context legal",
    "dna legal list",
    "",
  ];

  return {
    domains,
    jurisdictions,
    recommendations,
    engineeringRules,
    counselChecklist: counselItems,
    disclaimer: DISCLAIMER,
    brief: briefSections.join("\n"),
  };
}
