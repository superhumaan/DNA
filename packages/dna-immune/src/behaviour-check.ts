import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RuntimeEvent } from "@superhumaan/dna-config";

const VIOLATION_PATTERNS = [
  /password\s*=\s*['"][^'"]+['"]/i,
  /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
  /\beval\s*\(/i,
  /BEGIN (RSA |OPENSSH )?PRIVATE KEY/i,
];

export async function checkBehaviourViolation(
  dnaRoot: string,
  event: RuntimeEvent,
): Promise<boolean> {
  for (const pattern of VIOLATION_PATTERNS) {
    const text = `${event.message} ${event.stack ?? ""}`;
    if (pattern.test(text)) return true;
  }

  const securityPath = join(dnaRoot, "behaviour", "security.behaviour.md");
  try {
    const security = await readFile(securityPath, "utf-8");
    if (
      security.includes("Never commit secrets") &&
      /secret|credential|token/i.test(event.message) &&
      !event.message.includes("[REDACTED]")
    ) {
      return true;
    }
  } catch {
    // no behaviour file
  }

  if (event.type === "uncaught_exception" || event.type === "unhandled_rejection") {
    const runtimePath = join(dnaRoot, "behaviour", "runtime.behaviour.md");
    try {
      await readFile(runtimePath, "utf-8");
      return true;
    } catch {
      return false;
    }
  }

  return false;
}
