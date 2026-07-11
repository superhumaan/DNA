#!/usr/bin/env node
/**
 * Maintainer script — ingest a feedback payload JSON file into superhumaan/DNA issues.
 *
 * Usage:
 *   DNA_FEEDBACK_TOKEN=ghp_... node scripts/feedback-ingest.mjs path/to/payload.json
 *   node scripts/feedback-ingest.mjs path/to/payload.json --dry-run
 */
import { readFile } from "node:fs/promises";
import { ingestFeedback } from "@superhumaan/dna-feedback";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const file = args.find((a) => !a.startsWith("-"));

if (!file) {
  console.error("Usage: node scripts/feedback-ingest.mjs <payload.json> [--dry-run]");
  process.exit(1);
}

const payload = JSON.parse(await readFile(file, "utf-8"));
const result = await ingestFeedback(payload, { dryRun });

if (result.action === "dry-run") {
  console.log("Dry run — set DNA_FEEDBACK_TOKEN to create issues.");
  process.exit(0);
}

if (result.action === "deduped") {
  console.log(`Deduped → issue #${result.issueNumber}: ${result.issueUrl}`);
} else {
  console.log(`Created → issue #${result.issueNumber}: ${result.issueUrl}`);
}
