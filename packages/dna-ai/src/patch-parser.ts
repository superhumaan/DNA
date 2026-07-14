import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AiRepairPlan } from "@superhumaan/dna-config";

export interface ParsedPatchChange {
  file: string;
  description: string;
  patch?: string;
  search?: string;
  replace?: string;
}

/** Files the gateway playbook may create when missing. */
const ALLOW_CREATE = new Set(["src/health.ts"]);

const PLACEHOLDER_PATCH =
  /\/\/ existing code|DNA suggested fix for:|logger\.error\(\{ err: error \}, 'unknown'\)/;

function isLowQualityPatch(change: ParsedPatchChange): boolean {
  const text = `${change.patch ?? ""}\n${change.replace ?? ""}\n${change.search ?? ""}`;
  if (PLACEHOLDER_PATCH.test(text)) return true;
  // Blind comment-before-export is not a real fix
  if (change.search === "export" && (change.replace ?? "").includes("DNA suggested fix")) {
    return true;
  }
  return false;
}

export function parseRepairResponse(content: string): Partial<AiRepairPlan> | null {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
  const raw = jsonMatch?.[1]?.trim() ?? content.trim();

  try {
    const parsed = JSON.parse(raw) as Partial<AiRepairPlan>;
    if (parsed.proposedChanges || parsed.diagnosis) return parsed;
  } catch {
    // try extracting JSON object from mixed content
    const objectMatch = content.match(/\{[\s\S]*"proposedChanges"[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]) as Partial<AiRepairPlan>;
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function applyPatches(
  projectRoot: string,
  changes: ParsedPatchChange[],
): Promise<string[]> {
  const modified: string[] = [];

  for (const change of changes) {
    if (isLowQualityPatch(change)) continue;

    const filePath = join(projectRoot, change.file);
    try {
      let content: string;
      let existed = true;
      try {
        content = await readFile(filePath, "utf-8");
      } catch {
        content = "";
        existed = false;
      }

      // Never invent new files except explicit health playbook targets
      if (!existed && !ALLOW_CREATE.has(change.file)) continue;

      let updated = content;

      if (change.search != null && change.replace != null) {
        if (!content.includes(change.search)) continue;
        updated = content.replace(change.search, change.replace);
      } else if (change.patch) {
        if (change.patch.includes("<<<<<<<") || change.patch.startsWith("--- ")) {
          updated = applyUnifiedDiff(content, change.patch);
        } else if (!existed && ALLOW_CREATE.has(change.file)) {
          updated = `${change.patch}\n`;
        } else if (existed && !content.includes(change.patch)) {
          // append only when the file already exists and we have a named create target
          if (ALLOW_CREATE.has(change.file)) {
            updated = content + `\n\n${change.patch}\n`;
          } else {
            continue;
          }
        } else {
          continue;
        }
      } else {
        continue;
      }

      if (updated !== content) {
        await writeFile(filePath, updated, "utf-8");
        modified.push(change.file);
      }
    } catch {
      // skip failed patch
    }
  }

  return modified;
}

function applyUnifiedDiff(original: string, diff: string): string {
  const lines = diff.split("\n");
  const searchLines: string[] = [];
  const replaceLines: string[] = [];
  let mode: "none" | "search" | "replace" = "none";

  for (const line of lines) {
    if (line.startsWith("<<<<<<<")) {
      mode = "search";
      continue;
    }
    if (line.startsWith("=======")) {
      mode = "replace";
      continue;
    }
    if (line.startsWith(">>>>>>>")) {
      break;
    }
    if (mode === "search") searchLines.push(line);
    if (mode === "replace") replaceLines.push(line);
  }

  if (searchLines.length === 0) return original;
  const search = searchLines.join("\n");
  if (!original.includes(search)) return original;
  return original.replace(search, replaceLines.join("\n"));
}

export function buildStructuredRepairPromptSuffix(): string {
  return [
    "",
    "Respond with ONLY a JSON object (no markdown outside the JSON) in this shape:",
    JSON.stringify(
      {
        diagnosis: "root cause explanation",
        confidence: 0.85,
        proposedChanges: [
          {
            file: "path/to/file.ts",
            description: "what this change does",
            search: "exact code to find",
            replace: "replacement code",
          },
        ],
        branchName: "dna/fix/issue-id",
        prTitle: "[DNA] Fix: short title",
        prBody: "PR description with test plan",
        testPlan: "how to verify the fix",
      },
      null,
      2,
    ),
  ].join("\n");
}
