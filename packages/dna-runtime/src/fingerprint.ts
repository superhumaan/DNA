import { createHash } from "node:crypto";
import type { RuntimeEvent } from "@superhumaan/dna-config";

export function issueFingerprint(event: RuntimeEvent, category?: string): string {
  const parts = [
    event.endpoint ?? "global",
    String(event.statusCode ?? ""),
    event.message.slice(0, 80),
    category ?? "",
  ];
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

export function fingerprintLabel(fingerprint: string): string {
  return `dna-fp-${fingerprint}`;
}
