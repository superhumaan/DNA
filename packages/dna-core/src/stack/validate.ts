import type { DnaConfig, ValidationResult } from "@superhumaan/dna-config";
import type { ScanResult } from "@superhumaan/dna-config";
import { STACK_CONFLICTS, getArchetype } from "./catalog.js";
import { detectTechnologies, detectedTechList } from "./detect.js";

export function validateStackCompatibility(
  config: DnaConfig | null,
  scan: ScanResult,
): ValidationResult["errors"] {
  const errors: ValidationResult["errors"] = [];
  const detected = detectTechnologies(scan);
  const tech = detected.technologies;

  // Global conflict rules from package.json
  for (const conflict of STACK_CONFLICTS) {
    const allPresent = conflict.technologies.every((t) => techHas(tech, t));
    if (allPresent) {
      errors.push({
        code: "STACK_CONFLICT",
        message: `Stack conflict (${conflict.technologies.join(" + ")}): ${conflict.reason}`,
        severity: conflict.severity,
      });
    }
  }

  const archetypeId = config?.stack.archetype;
  if (!archetypeId) {
    errors.push({
      code: "STACK_NO_ARCHETYPE",
      message: "No stack archetype in config. Run `dna init` or `dna stack recommend` to set one.",
      severity: "warning",
    });
    return errors;
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    errors.push({
      code: "STACK_UNKNOWN_ARCHETYPE",
      message: `Unknown stack archetype: ${archetypeId}`,
      severity: "error",
    });
    return errors;
  }

  // Excluded technologies for this archetype
  for (const ex of archetype.excludes) {
    if (techHas(tech, ex)) {
      errors.push({
        code: "STACK_ARCHETYPE_VIOLATION",
        message: `Archetype "${archetype.name}" excludes "${ex}" but it was detected in dependencies. Change archetype or remove the dependency.`,
        severity: "error",
      });
    }
  }

  // Config vs scan drift
  if (config.stack.frontend && scan.frontend && config.stack.frontend !== scan.frontend) {
    const allowed = archetype.layers.frontend ?? [];
    if (!allowed.includes(scan.frontend)) {
      errors.push({
        code: "STACK_DRIFT_FRONTEND",
        message: `Config frontend is "${config.stack.frontend}" but scan detected "${scan.frontend}" (not in archetype ${archetypeId}).`,
        severity: "warning",
      });
    }
  }

  if (config.stack.backend && scan.backend && config.stack.backend !== scan.backend) {
    const allowed = archetype.layers.backend ?? [];
    if (scan.backend && allowed.length && !allowed.includes(scan.backend)) {
      errors.push({
        code: "STACK_DRIFT_BACKEND",
        message: `Config backend is "${config.stack.backend}" but scan detected "${scan.backend}" (not in archetype ${archetypeId}).`,
        severity: "warning",
      });
    }
  }

  if (config.stack.bundler && detected.bundler && config.stack.bundler !== detected.bundler) {
    errors.push({
      code: "STACK_DRIFT_BUNDLER",
      message: `Config bundler is "${config.stack.bundler}" but scan suggests "${detected.bundler}".`,
      severity: "warning",
    });
  }

  return errors;
}

function techHas(tech: Set<string>, id: string): boolean {
  if (id === "react-spa") return tech.has("react") && !tech.has("next");
  return tech.has(id);
}

export function formatStackValidationSummary(
  config: DnaConfig | null,
  scan: ScanResult,
): string {
  const detected = detectTechnologies(scan);
  const archetype = config?.stack.archetype ? getArchetype(config.stack.archetype) : undefined;

  const lines = [
    "DNA Stack Summary",
    "=================",
    "",
    `Archetype:  ${archetype?.name ?? config?.stack.archetype ?? "not set"}`,
    `Platform:   ${archetype?.platform ?? "—"}`,
    "",
    "Configured:",
    `  Frontend:  ${config?.stack.frontend ?? "—"}`,
    `  Bundler:   ${config?.stack.bundler ?? "—"}`,
    `  Backend:   ${config?.stack.backend ?? "—"}`,
    `  Database:  ${config?.stack.database ?? "—"}`,
    "",
    "Detected in package.json:",
    `  ${detectedTechList(detected).join(", ") || "none"}`,
    "",
  ];

  if (archetype) {
    lines.push("This archetype excludes:", `  ${archetype.excludes.join(", ")}`, "");
  }

  return lines.join("\n");
}
