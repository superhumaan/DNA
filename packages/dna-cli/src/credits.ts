import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export interface SponsorTier {
  id: string;
  name: string;
  amountUsd: number;
  summary: string;
  benefits: string[];
}

export interface SponsorEntry {
  name: string;
  url?: string;
  tier: string;
  logoUrl?: string;
  since?: string;
}

export interface SponsorLedger {
  updated: string;
  sponsorUrl: string;
  servicesUrl: string;
  goalUsd: number;
  goalDescription: string;
  tiers: SponsorTier[];
  sponsors: SponsorEntry[];
}

function tierLabel(tierId: string, tiers: SponsorTier[]): string {
  const tier = tiers.find((t) => t.id === tierId);
  return tier ? `${tier.name} ($${tier.amountUsd}/mo)` : tierId;
}

export async function loadSponsorLedger(): Promise<SponsorLedger> {
  const assetsPath = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "sponsors.json");
  const raw = await readFile(assetsPath, "utf8");
  return JSON.parse(raw) as SponsorLedger;
}

export function formatCredits(ledger: SponsorLedger): string {
  const lines = [
    "DNA by Humaan — credits",
    "═".repeat(40),
    "",
    "Maintained by Humaan by Superlite (https://dna.humaan.app)",
    `Sponsor DNA: ${ledger.sponsorUrl}`,
    `Commercial services: ${ledger.servicesUrl}`,
    "",
    "Sponsor ledger",
    "─".repeat(40),
  ];

  if (!ledger.sponsors.length) {
    lines.push("No community sponsors yet.");
    lines.push(`Become the first: ${ledger.sponsorUrl}`);
  } else {
    for (const sponsor of ledger.sponsors) {
      const link = sponsor.url ? `${sponsor.name} (${sponsor.url})` : sponsor.name;
      lines.push(`• ${link} — ${tierLabel(sponsor.tier, ledger.tiers)}`);
    }
    lines.push("");
    lines.push(`Full ledger: https://dna.humaan.app/sponsors`);
  }

  lines.push("");
  lines.push("Also try: npm fund @superhumaan/dna-by-humaan");
  lines.push(`Updated: ${ledger.updated}`);
  return lines.join("\n");
}
