import type { ScanResult } from "@superhumaan/dna-config";

/** Detect deployment/hosting platform from repo files and dependencies. */
export function detectHosting(scan: ScanResult, files: string[]): string | undefined {
  const deps = new Set(scan.dependencies.map((d) => d.toLowerCase()));

  if (files.some((f) => f === "vercel.json" || f.startsWith(".vercel/")) || deps.has("vercel")) {
    return "vercel";
  }
  if (files.some((f) => f === "netlify.toml")) {
    return "netlify";
  }
  if (files.some((f) => f === "railway.toml" || f === "railway.json")) {
    return "railway";
  }
  if (files.some((f) => f.includes("azure-pipelines") || f.endsWith("azure-pipelines.yml"))) {
    return "azure";
  }
  if (
    files.some(
      (f) =>
        f.includes(".github/workflows") &&
        (f.includes("ecr") || f.includes("ecs") || f.includes("amazon-ecr")),
    )
  ) {
    return "aws-ecr";
  }
  if (scan.docker) {
    return "docker";
  }
  return undefined;
}

export function supportsPreviewDeploy(hosting?: string): boolean {
  return hosting === "vercel" || hosting === "netlify";
}

export function defaultPreviewProvider(hosting?: string): "vercel" | "netlify" {
  return hosting === "netlify" ? "netlify" : "vercel";
}
