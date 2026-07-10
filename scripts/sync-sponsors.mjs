#!/usr/bin/env node
/**
 * Sync sponsors.json → README ledger, npm package credits, GitHub FUNDING.yml, and DNA-Web data.
 *
 * Usage:
 *   node scripts/sync-sponsors.mjs
 *   DNA_WEB_ROOT="../DNA - Web" node scripts/sync-sponsors.mjs
 */
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPONSORS_PATH = join(ROOT, "sponsors.json");
const CLI_PKG = join(ROOT, "packages", "dna-cli");
const DNA_WEB_ROOT = process.env.DNA_WEB_ROOT ?? join(ROOT, "..", "DNA - Web");
const DNA_WEB_DATA = join(DNA_WEB_ROOT, "apps", "web", "src", "data", "sponsors.json");

const MARKER_START = "<!-- sponsors:ledger:start -->";
const MARKER_END = "<!-- sponsors:ledger:end -->";
const FUNDING_PATH = join(ROOT, ".github", "FUNDING.yml");
const FUNDING_DOCS =
  "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository";

function githubUsernameFromSponsorUrl(url) {
  const match = url?.match(/^https:\/\/github\.com\/sponsors\/([^/?#]+)/);
  return match?.[1] ?? null;
}

function renderFundingYml(data) {
  const github = githubUsernameFromSponsorUrl(data.sponsorUrl);
  const custom = [data.servicesUrl].filter(Boolean);

  const lines = [
    "# DNA by Humaan — sponsorship",
    "# Synced from sponsors.json via `pnpm sponsors:sync`. Do not edit manually.",
    `# ${FUNDING_DOCS}`,
    "",
  ];

  if (github) {
    lines.push(`github: ${github}`);
  }
  if (custom.length) {
    lines.push("custom:");
    for (const url of custom) {
      lines.push(`  - ${url}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function tierLabel(tierId, data) {
  const monthly = data.tiers.find((t) => t.id === tierId);
  if (monthly) return `${monthly.name} ($${monthly.amountUsd}/mo)`;
  const once = (data.oneTimeTiers ?? []).find((t) => t.id === tierId);
  if (once) return `${once.name} ($${once.amountUsd.toLocaleString()} one-time)`;
  return tierId;
}

function renderLedgerTable(sponsors, data) {
  if (!sponsors.length) {
    return [
      "DNA is MIT-licensed and maintained in the open. Sponsorship funds hosting, security updates, and the marketplace — not premium features.",
      "",
      "_No sponsors yet — [be the first](https://github.com/sponsors/superhumaan)._",
    ].join("\n");
  }

  const rows = sponsors
    .map((s) => {
      const name = s.url ? `[${s.name}](${s.url})` : s.name;
      return `| ${name} | ${tierLabel(s.tier, data)} | ${s.since ?? "—"} |`;
    })
    .join("\n");

  return [
    "DNA is MIT-licensed and maintained in the open. Sponsorship funds hosting, security updates, and the marketplace — not premium features.",
    "",
    "| Sponsor | Tier | Since |",
    "|---------|------|-------|",
    rows,
    "",
    `Full ledger: [dna.humaan.app/sponsors](https://dna.humaan.app/sponsors) · [Become a sponsor →](https://github.com/sponsors/superhumaan)`,
  ].join("\n");
}

function renderSponsorsMd(data) {
  const lines = [
    "# Sponsors",
    "",
    `_Updated ${data.updated}. Synced from [\`sponsors.json\`](../../sponsors.json) via \`pnpm sponsors:sync\`._`,
    "",
    data.goalDescription,
    "",
    `**Monthly goal:** $${data.goalUsd}/month · [Sponsor DNA](${data.sponsorUrl})`,
    "",
    "## Sponsor ledger",
    "",
    renderLedgerTable(data.sponsors, data),
    "",
    "## Monthly tiers",
    "",
  ];

  for (const tier of data.tiers) {
    lines.push(`### ${tier.name} — $${tier.amountUsd}/month`);
    lines.push("");
    lines.push(tier.summary);
    lines.push("");
    for (const benefit of tier.benefits) {
      lines.push(`- ${benefit}`);
    }
    lines.push("");
  }

  if (data.oneTimeTiers?.length) {
    lines.push("## One-time build partnerships");
    lines.push("");
    if (data.oneTimeDisclaimer) {
      lines.push(data.oneTimeDisclaimer);
      lines.push("");
    }
    for (const tier of data.oneTimeTiers) {
      lines.push(`### ${tier.name} — $${tier.amountUsd.toLocaleString()} one-time (${tier.durationMonths} months)`);
      lines.push("");
      lines.push(tier.summary);
      lines.push("");
      for (const benefit of tier.benefits) {
        lines.push(`- ${benefit}`);
      }
      lines.push("");
    }
  }

  lines.push("## Commercial services");
  lines.push("");
  lines.push(`Enterprise support, compliance implementation, pack authoring, and Humaan platform services: [${data.servicesUrl}](${data.servicesUrl})`);
  lines.push("");

  return lines.join("\n");
}

function renderCreditsMd(data) {
  const lines = [
    "# Credits",
    "",
    "**DNA by Humaan** is built and maintained by [Humaan by Superlite](https://dna.humaan.app).",
    "",
    "After install, view sponsors and funding links:",
    "",
    "```bash",
    "dna credits",
    "npm fund @superhumaan/dna-by-humaan",
    "```",
    "",
    "## Sponsors",
    "",
  ];

  if (!data.sponsors.length) {
    lines.push("No community sponsors yet. [Become a sponsor](https://github.com/sponsors/superhumaan).");
  } else {
    for (const s of data.sponsors) {
      const link = s.url ? `[${s.name}](${s.url})` : s.name;
      lines.push(`- ${link} — ${tierLabel(s.tier, data)}`);
    }
  }

  lines.push("");
  lines.push(`[Full sponsor ledger](https://dna.humaan.app/sponsors) · [Sponsor DNA](${data.sponsorUrl})`);
  lines.push("");
  return lines.join("\n");
}

function injectLedger(readme, ledgerBlock) {
  const section = `## Sponsors\n\n${MARKER_START}\n${ledgerBlock}\n${MARKER_END}`;
  if (readme.includes("## Sponsors")) {
    const re = /## Sponsors\n\n<!-- sponsors:ledger:start -->[\s\S]*?<!-- sponsors:ledger:end -->/;
    if (!re.test(readme)) {
      throw new Error("README has ## Sponsors but missing ledger markers — run sync after adding markers.");
    }
    return readme.replace(re, section);
  }
  const licenseIdx = readme.lastIndexOf("\n## License\n");
  if (licenseIdx === -1) {
    return `${readme.trimEnd()}\n\n${section}\n`;
  }
  let before = readme.slice(0, licenseIdx).trimEnd();
  if (!before.endsWith("---")) {
    before = `${before}\n\n---`;
  }
  return `${before}\n\n${section}\n${readme.slice(licenseIdx)}`;
}

async function updatePackageJson(data) {
  const pkgPath = join(CLI_PKG, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));

  pkg.funding = {
    type: "github",
    url: data.sponsorUrl,
  };

  pkg.contributors = data.sponsors.map((s) => ({
    name: s.name,
    ...(s.url ? { url: s.url } : {}),
  }));

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function updateReadme(path, data) {
  const readme = await readFile(path, "utf8");
  const ledgerBlock = renderLedgerTable(data.sponsors, data);
  const next = injectLedger(readme, ledgerBlock);
  await writeFile(path, next);
}

async function main() {
  const data = JSON.parse(await readFile(SPONSORS_PATH, "utf8"));

  const assetsDir = join(CLI_PKG, "assets");
  await mkdir(assetsDir, { recursive: true });
  await copyFile(SPONSORS_PATH, join(assetsDir, "sponsors.json"));

  await writeFile(join(CLI_PKG, "SPONSORS.md"), renderSponsorsMd(data));
  await writeFile(join(CLI_PKG, "CREDITS.md"), renderCreditsMd(data));
  await updatePackageJson(data);

  await updateReadme(join(ROOT, "README.md"), data);
  await updateReadme(join(CLI_PKG, "README.md"), data);
  await writeFile(FUNDING_PATH, renderFundingYml(data));

  try {
    await mkdir(dirname(DNA_WEB_DATA), { recursive: true });
    await copyFile(SPONSORS_PATH, DNA_WEB_DATA);
    console.log(`→ Copied sponsors.json → ${DNA_WEB_DATA}`);
  } catch (err) {
    console.warn(`⚠ Skipped DNA-Web copy (${DNA_WEB_DATA}): ${err.message}`);
  }

  console.log("✓ Sponsors synced");
  console.log(`  Ledger entries: ${data.sponsors.length}`);
  console.log(`  npm contributors: ${data.sponsors.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
