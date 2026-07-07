#!/usr/bin/env node
/**
 * Scrub product/company branding from GDPR reference templates.
 * Replaces Invitrace/Soli names with DNA placeholders for UK GDPR packs.
 *
 * Usage:
 *   node scripts/scrub-gdpr-branding.mjs [assetsRoot]
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = join(__dirname, "..", "packages", "dna-core", "assets", "gdpr-reference");

export const GDPR_PLACEHOLDERS = {
  company: "[Company Name]",
  product: "[Product Name]",
  affiliate: "[Affiliate Entity]",
  region: "[UK Hosting Region]",
};

/** Longest match first */
const REPLACEMENTS = [
  [/privacy@invitrace\.com/gi, "privacy@[company-domain]"],
  [/legal@invitrace\.com/gi, "legal@[company-domain]"],
  [/support@invitrace\.com/gi, "support@[company-domain]"],
  [/dpo@invitrace\.com/gi, "dpo@[company-domain]"],
  [/Invitrace UK/g, GDPR_PLACEHOLDERS.company],
  [/Invitrace Thailand/g, GDPR_PLACEHOLDERS.affiliate],
  [/Invitrace Health/g, GDPR_PLACEHOLDERS.affiliate],
  [/Invitrace Co\., Ltd\. \(Thailand\)/g, GDPR_PLACEHOLDERS.affiliate],
  [/within the Invitrace group/g, "within the [Company Name] group"],
  [/Invitrace group/g, "[Company Name] group"],
  [/Invitrace/g, GDPR_PLACEHOLDERS.company],
  [/invitrace\.com/gi, "[company-domain]"],
  [/Soli UK South/g, GDPR_PLACEHOLDERS.region],
  [/Soli platform/g, `${GDPR_PLACEHOLDERS.product} platform`],
  [/\bsoli-db\b/g, "[database-name]"],
  [/\bsoli-blob\b/g, "[blob-storage-account]"],
  [/\bsoli-gpt\b/g, "[ai-deployment]"],
  [/\bsoli_/g, "[product]_"],
  [/\bSoli\b/g, GDPR_PLACEHOLDERS.product],
];

const HEADER_NOTE =
  "_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._";

const FOOTER_NOTE =
  "_Template — customize confidentiality and ownership statements for your organisation before distribution._";

export function scrubGdprText(text) {
  let out = text;

  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }

  // Extraction artefacts
  out = out.replace(/This document governs This document governs/g, "This document governs");
  out = out.replace(
    / for \[Company Name\] in relation to the \[Product Name\] platform\. for \[Company Name\] in relation to the \[Product Name\] platform\./g,
    " for [Company Name] in relation to the [Product Name] platform.",
  );

  out = out.replace(
    /_Reference example from Invitrace UK GDPR pack\. Customize for your product before publication\./g,
    HEADER_NOTE,
  );
  out = out.replace(
    /_UK GDPR required document template\. Replace all \[placeholders\] with your organisation details before publication\._+/g,
    HEADER_NOTE,
  );
  out = out.replace(
    /The content of this document is proprietary and confidential information of \[Company Name\]\. It is not intended to be distributed or used by any party without written consent\./g,
    FOOTER_NOTE,
  );

  // Title lines that still say Soli Platform
  out = out.replace(/^# Soli Platform DPIA/m, "# Platform DPIA");
  out = out.replace(/Soli Platform DPIA/g, "Platform DPIA");

  // Email / URL artefacts
  out = out.replace(/privacy@privacy@/g, "privacy@");
  out = out.replace(/(\w+)@privacy@\[company-domain\]/g, "$1@[company-domain]");
  out = out.replace(/https:\/\/www\.privacy@\[company-domain\]/g, "https://www.[company-domain]");
  out = out.replace(/https:\/\/app\.soli\.privacy@\[company-domain\]/g, "https://app.[company-domain]");
  out = out.replace(/https:\/\/app\.\[product\]\.privacy@\[company-domain\]/g, "https://app.[company-domain]");

  return out;
}

function walkFiles(dir, ext, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walkFiles(full, ext, acc);
    } else if (name.endsWith(ext)) {
      acc.push(full);
    }
  }
  return acc;
}

function scrubManifest(manifestPath) {
  if (!existsSync(manifestPath)) return;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  manifest.description = "UK GDPR required document pack (scrubbed templates)";
  delete manifest.sourcePath;

  for (const doc of manifest.documents) {
    doc.title = scrubGdprText(doc.title);
    if (doc.slug === "soli-platform-dpia") {
      doc.slug = "platform-dpia";
      doc.title = "Platform DPIA";
      if (doc.knowledgePath) {
        doc.knowledgePath = doc.knowledgePath.replace("soli-platform-dpia", "platform-dpia");
      }
    }
    if (doc.sourceFile) {
      doc.sourceFile = scrubGdprText(doc.sourceFile);
    }
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

const root = process.argv[2] ?? DEFAULT_ROOT;

console.log(`Scrubbing GDPR branding in:\n  ${root}\n`);

let scrubbed = 0;
for (const file of walkFiles(root, ".md")) {
  const before = readFileSync(file, "utf-8");
  const after = scrubGdprText(before);
  writeFileSync(file, after, "utf-8");
  if (after !== before) scrubbed += 1;
}

// Rename soli-platform-dpia.md → platform-dpia.md
const oldDpia = join(root, "governance", "soli-platform-dpia.md");
const newDpia = join(root, "governance", "platform-dpia.md");
if (existsSync(oldDpia)) {
  const content = scrubGdprText(readFileSync(oldDpia, "utf-8"));
  writeFileSync(newDpia, content, "utf-8");
  if (existsSync(newDpia) && existsSync(oldDpia) && oldDpia !== newDpia) {
    unlinkSync(oldDpia);
  }
  console.log("✓ Renamed governance/soli-platform-dpia.md → platform-dpia.md");
}

scrubManifest(join(root, "manifest.json"));

console.log(`Done: scrubbed ${scrubbed} markdown files`);
console.log(`Placeholders: ${GDPR_PLACEHOLDERS.company}, ${GDPR_PLACEHOLDERS.product}, ${GDPR_PLACEHOLDERS.affiliate}`);
