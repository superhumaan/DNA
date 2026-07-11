import type { ScanResult } from "@superhumaan/dna-config";
import { STACK_ARCHETYPES, type StackArchetype } from "./catalog.js";
import { detectTechnologies } from "./detect.js";
import { supportsPreviewDeploy } from "./hosting.js";

function descIncludesPwa(description: string): boolean {
  const d = description.toLowerCase();
  return d.includes("pwa") || d.includes("progressive web");
}

export interface ArchetypeResolution {
  archetype: StackArchetype;
  confidence: "high" | "medium" | "low";
  reason: string;
}

function scoreArchetype(archetype: StackArchetype, detected: ReturnType<typeof detectTechnologies>): number {
  let score = 0;
  const tech = detected.technologies;

  if (archetype.id === "ghost-cms" && tech.has("ghost")) return 100;
  if (archetype.id === "mobile-expo" && (tech.has("react-native") || tech.has("metro"))) return 90;
  if (archetype.id === "flutter-mobile" && tech.has("flutter")) return 90;
  if (archetype.id === "desktop-electron" && tech.has("electron")) return 90;
  if (archetype.id === "desktop-tauri" && tech.has("tauri")) return 88;
  if (archetype.id === "astro-static" && tech.has("astro")) return 85;
  if (archetype.id === "next-fullstack" && tech.has("next")) return 90;
  if (archetype.id === "remix-fullstack" && tech.has("remix")) return 90;
  if (archetype.id === "nuxt-fullstack" && tech.has("nuxt")) return 88;
  if (archetype.id === "sveltekit-fullstack" && tech.has("sveltekit")) return 88;
  if (archetype.id === "sanity-headless" && tech.has("sanity")) return 92;
  if (archetype.id === "strapi-headless" && tech.has("strapi")) return 92;
  if (archetype.id === "payload-cms" && tech.has("payload")) return 92;
  if (archetype.id === "hono-api" && tech.has("hono")) return 85;
  if (archetype.id === "nestjs-modular" && tech.has("nestjs")) return 85;

  if (archetype.id === "vercel-supabase" && tech.has("supabase") && tech.has("react") && !tech.has("next")) {
    score += 80;
  }

  if (archetype.id === "vue-vite-api" && tech.has("vue") && !tech.has("next")) score += 75;
  if (archetype.id === "svelte-vite-api" && tech.has("svelte") && !tech.has("next")) score += 75;

  if (archetype.id === "react-vite-api") {
    if (tech.has("react") && !tech.has("next") && !tech.has("ghost")) score += 70;
    if (tech.has("vite")) score += 10;
    if (tech.has("express") || tech.has("fastify")) score += 10;
  }

  // Penalise excluded tech present
  for (const ex of archetype.excludes) {
    if (techHasId(tech, ex)) score -= 50;
  }

  return score;
}

function techHasId(tech: Set<string>, id: string): boolean {
  if (id === "react-spa") return tech.has("react") && !tech.has("next");
  return tech.has(id);
}

export function resolveArchetype(
  scan: ScanResult,
  description = "",
): ArchetypeResolution {
  const detected = detectTechnologies(scan);
  const desc = description.toLowerCase();

  // Explicit description hints
  if (desc.includes("ghost") || desc.includes("blog cms")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "ghost-cms")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Ghost / CMS" };
  }
  if (desc.includes("wordpress") || desc.includes("headless wp")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "wordpress-headless")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions WordPress headless" };
  }
  if (desc.includes("sanity")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "sanity-headless")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Sanity CMS" };
  }
  if (desc.includes("strapi")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "strapi-headless")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Strapi CMS" };
  }
  if (desc.includes("payload")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "payload-cms")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Payload CMS" };
  }
  if (desc.includes("contentful")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "contentful-headless")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Contentful" };
  }
  if (desc.includes("remix") && !detected.technologies.has("next")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "remix-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Remix" };
  }
  if (desc.includes("nuxt")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "nuxt-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Nuxt" };
  }
  if (desc.includes("sveltekit") || desc.includes("svelte kit")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "sveltekit-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions SvelteKit" };
  }
  if (desc.includes("angular")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "angular-spa")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions Angular" };
  }
  if (desc.includes("django")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "django-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Django" };
  }
  if (desc.includes("fastapi")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "fastapi-api")!;
    return { archetype: a, confidence: "high", reason: "Description mentions FastAPI" };
  }
  if (desc.includes("laravel")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "laravel-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Laravel" };
  }
  if (
    desc.includes("fhir") ||
    desc.includes("hipaa") ||
    desc.includes("ehr") ||
    desc.includes("clinical") ||
    desc.includes("healthcare") ||
    desc.includes("patient portal") ||
    desc.includes("telehealth")
  ) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "healthcare-fhir")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions healthcare / FHIR / HIPAA" };
  }
  if (desc.includes("unity") || desc.includes("game development") || desc.includes("multiplayer game")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "gaming-unity")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions Unity / game development" };
  }
  if (desc.includes("sap") || desc.includes("s/4hana") || desc.includes("erp integration")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "erp-sap-integration")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions SAP / ERP integration" };
  }
  if (desc.includes("plaid") || desc.includes("fintech") || desc.includes("neobank")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "fintech-plaid")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions fintech / Plaid" };
  }
  if (desc.includes("shopify") || desc.includes("headless commerce") || desc.includes("online store")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "ecommerce-shopify")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions Shopify / ecommerce" };
  }
  if (desc.includes("rag") || desc.includes("llm") || desc.includes("ai saas") || desc.includes("chatbot")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "ai-llm-saas")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions AI / LLM product" };
  }
  if (desc.includes("lms") || desc.includes("edtech") || desc.includes("learning platform")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "edtech-lms")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions EdTech / LMS" };
  }
  if (desc.includes("mqtt") || desc.includes("iot platform") || desc.includes("device telemetry")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "iot-mqtt")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions IoT / MQTT" };
  }
  if (desc.includes("insurance") || desc.includes("insurtech") || desc.includes("claims platform")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "insurance-insurtech")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions insurance" };
  }
  if (desc.includes("datadog") || desc.includes("observability") || desc.includes("slo")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "observability-production")!;
    return { archetype: a, confidence: "low", reason: "Description mentions observability" };
  }
  if ((desc.includes("aws") || desc.includes("amazon web services")) && desc.includes("saas")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "cloud-aws-saas")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions AWS SaaS" };
  }
  if (desc.includes("hono") && !detected.technologies.has("express")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "hono-api")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions Hono" };
  }
  if (desc.includes("pwa") || desc.includes("progressive web")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "pwa-react-vite")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions PWA" };
  }
  if (desc.includes("electron")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "desktop-electron")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Electron" };
  }
  if (desc.includes("tauri")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "desktop-tauri")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Tauri" };
  }
  if (desc.includes("desktop app") || desc.includes("desktop application")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "desktop-electron")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions desktop app" };
  }
  if (desc.includes("chrome extension") || desc.includes("browser extension")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "browser-extension-chrome")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions browser extension" };
  }
  if (desc.includes("safari extension")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "browser-extension-safari")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Safari extension" };
  }
  if (desc.includes("custom gpt") || desc.includes("gpt action") || desc.includes("gpt app")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "gpt-app")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions GPT app / actions" };
  }
  if (desc.includes("mcp server") || desc.includes("model context protocol")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "mcp-server")!;
    return { archetype: a, confidence: "high", reason: "Description mentions MCP server" };
  }
  if (desc.includes("flutter")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "flutter-mobile")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Flutter" };
  }
  if (desc.includes("swiftui") || desc.includes("ios app")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "ios-native")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions native iOS" };
  }
  if (desc.includes("jetpack compose") || desc.includes("android app")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "android-native")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions native Android" };
  }
  if (
    (desc.includes("astro") || desc.includes("marketing site") || desc.includes("landing page")) &&
    !detected.technologies.has("next")
  ) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "astro-static")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions marketing / Astro site" };
  }
  if (desc.includes("mobile app") || desc.includes("react native") || desc.includes("expo")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "mobile-expo")!;
    return { archetype: a, confidence: "medium", reason: "Description mentions mobile" };
  }
  if (desc.includes("next.js") || desc.includes("nextjs") || desc.includes("next js")) {
    const a = STACK_ARCHETYPES.find((x) => x.id === "next-fullstack")!;
    return { archetype: a, confidence: "high", reason: "Description mentions Next.js" };
  }

  let best: StackArchetype | undefined;
  let bestScore = -1;

  for (const archetype of STACK_ARCHETYPES) {
    const score = scoreArchetype(archetype, detected);
    if (score > bestScore) {
      bestScore = score;
      best = archetype;
    }
  }

  // No stack signals — do not invent react-vite-api for empty/non-code folders
  if (
    bestScore < 50 &&
    detected.technologies.size === 0 &&
    !scan.frontend &&
    !scan.backend &&
    scan.dependencies.length === 0
  ) {
    const placeholder = STACK_ARCHETYPES.find((a) => a.id === "react-vite-api")!;
    return {
      archetype: placeholder,
      confidence: "low",
      reason: "No package.json dependencies or source stack detected",
    };
  }

  best ??= STACK_ARCHETYPES.find((a) => a.id === "react-vite-api")!;

  // SaaS without supabase still defaults react-vite-api
  const isSaas =
    desc.includes("saas") || desc.includes("b2b") || desc.includes("platform");
  if (isSaas && detected.technologies.has("supabase") && best.id === "react-vite-api") {
    best = STACK_ARCHETYPES.find((a) => a.id === "vercel-supabase")!;
    bestScore = 85;
  }

  const confidence: ArchetypeResolution["confidence"] =
    bestScore >= 80 ? "high" : bestScore >= 60 ? "medium" : "low";

  const reason =
    bestScore >= 80
      ? `Detected dependencies match ${best.name}`
      : bestScore >= 50
        ? `Best fit from scan (score ${bestScore})`
        : "Default web archetype — no strong signals in package.json";

  return { archetype: best, confidence, reason };
}

export function stackFromArchetype(
  resolution: ArchetypeResolution,
  scan: ScanResult,
  description: string,
): {
  archetype: string;
  frontend?: string;
  bundler?: string;
  backend?: string;
  database?: string;
  platform?: string;
  hosting?: string;
  testing?: string;
} {
  const { archetype } = resolution;
  const detected = detectTechnologies(scan);
  const isSaas =
    description.toLowerCase().includes("saas") ||
    description.toLowerCase().includes("b2b") ||
    description.toLowerCase().includes("platform");

  const pick = (
    layer: keyof StackArchetype["layers"],
    fallback?: string,
    useArchetypeDefault = true,
  ) => {
    const allowed = archetype.layers[layer];
    if (!allowed?.length) return fallback;
    const fromScan =
      layer === "frontend"
        ? detected.frontend
        : layer === "backend"
          ? detected.backend
          : layer === "database"
            ? detected.database ?? scan.database
            : layer === "testing"
              ? detected.testing
              : layer === "bundler"
                ? detected.bundler
                : layer === "hosting"
                  ? scan.hosting
                  : undefined;
    if (fromScan && allowed.includes(fromScan)) return fromScan;
    if (layer === "frontend" && fromScan === "next") return "next";
    if (!useArchetypeDefault) return fallback;
    return allowed[0];
  };

  const database =
    scan.database ??
    pick("database", detected.technologies.has("supabase") ? "supabase" : undefined, false);

  const hosting = scan.hosting ?? pick("hosting", undefined, false);

  return {
    archetype: archetype.id,
    frontend: pick("frontend", scan.frontend),
    bundler: pick("bundler", archetype.id === "next-fullstack" ? "next" : scan.frontend ? "vite" : undefined),
    backend: pick("backend", scan.backend),
    database,
    platform:
      archetype.platform === "cms"
        ? "CMS"
        : archetype.platform === "mobile"
          ? "mobile app"
          : archetype.platform === "desktop"
            ? "desktop app"
            : isSaas
              ? "B2B SaaS"
              : descIncludesPwa(description)
                ? "pwa"
                : "web app",
    hosting,
    testing: pick("testing", scan.testFramework ?? "vitest"),
  };
}

/** Whether CI should scaffold a Vercel/Netlify preview workflow for this project. */
export function shouldScaffoldPreviewWorkflow(scan: ScanResult, hosting?: string): boolean {
  const resolved = hosting ?? scan.hosting;
  return supportsPreviewDeploy(resolved);
}
