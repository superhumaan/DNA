import type { ScanResult } from "@superhumaan/dna-config";

/** Technology ids used in archetypes and conflict rules */
export type StackTechnology =
  | "react"
  | "vue"
  | "svelte"
  | "angular"
  | "next"
  | "react-native"
  | "ghost"
  | "vite"
  | "next-bundler"
  | "metro"
  | "express"
  | "fastify"
  | "nestjs"
  | "hono"
  | "koa"
  | "supabase"
  | "postgresql"
  | "sqlite"
  | "mysql"
  | "mongodb"
  | "vitest"
  | "jest"
  | "playwright"
  | "electron"
  | "tauri"
  | "astro"
  | "flutter"
  | "remix"
  | "nuxt"
  | "sveltekit"
  | "sanity"
  | "strapi"
  | "payload"
  | "django"
  | "fastapi"
  | "laravel";

const DEP_SIGNALS: Record<StackTechnology, string[]> = {
  react: ["react", "@vitejs/plugin-react"],
  vue: ["vue", "@vitejs/plugin-vue"],
  svelte: ["svelte", "@sveltejs/kit"],
  angular: ["@angular/core"],
  next: ["next"],
  "react-native": ["react-native", "expo", "@expo/metro-runtime"],
  ghost: ["ghost"],
  vite: ["vite", "@vitejs/plugin-react", "@vitejs/plugin-vue", "@sveltejs/vite-plugin-svelte"],
  "next-bundler": ["next"],
  metro: ["react-native", "expo", "metro"],
  express: ["express"],
  fastify: ["fastify"],
  nestjs: ["@nestjs/core"],
  hono: ["hono"],
  koa: ["koa"],
  supabase: ["@supabase/supabase-js", "@supabase/auth-helpers-react"],
  postgresql: ["pg", "postgres", "@prisma/client", "drizzle-orm"],
  sqlite: ["better-sqlite3", "sqlite3"],
  mysql: ["mysql2", "mysql"],
  mongodb: ["mongodb", "mongoose"],
  vitest: ["vitest"],
  jest: ["jest"],
  playwright: ["@playwright/test"],
  electron: ["electron"],
  tauri: ["@tauri-apps/api", "@tauri-apps/cli"],
  astro: ["astro"],
  flutter: ["flutter"],
  remix: ["@remix-run/react", "@remix-run/node"],
  nuxt: ["nuxt"],
  sveltekit: ["@sveltejs/kit"],
  sanity: ["sanity", "@sanity/client", "@sanity/vision"],
  strapi: ["@strapi/strapi", "@strapi/plugin-users-permissions"],
  payload: ["payload", "@payloadcms/db-postgres", "@payloadcms/next"],
  django: ["django"],
  fastapi: ["fastapi"],
  laravel: ["laravel"],
};

export interface DetectedStack {
  technologies: Set<StackTechnology>;
  /** Map layer hints from scan */
  frontend?: string;
  backend?: string;
  bundler?: string;
  database?: string;
  testing?: string;
}

export function detectTechnologies(scan: ScanResult): DetectedStack {
  const deps = new Set(scan.dependencies.map((d) => d.toLowerCase()));
  const technologies = new Set<StackTechnology>();

  for (const [tech, packages] of Object.entries(DEP_SIGNALS) as [StackTechnology, string[]][]) {
    if (packages.some((pkg) => deps.has(pkg.toLowerCase()))) {
      technologies.add(tech);
    }
  }

  if (scan.frontend === "ghost" as string) technologies.add("ghost");

  let bundler: string | undefined;
  if (technologies.has("next")) bundler = "next";
  else if (technologies.has("nuxt")) bundler = "nuxt";
  else if (technologies.has("remix")) bundler = "remix";
  else if (technologies.has("sveltekit")) bundler = "sveltekit";
  else if (technologies.has("astro")) bundler = "astro";
  else if (technologies.has("vite")) bundler = "vite";
  else if (technologies.has("metro")) bundler = "metro";
  else if (technologies.has("ghost")) bundler = "ghost";

  return {
    technologies,
    frontend: scan.frontend,
    backend: scan.backend,
    bundler,
    database: scan.database,
    testing: scan.testFramework,
  };
}

export function detectedTechList(detected: DetectedStack): string[] {
  const list = [...detected.technologies];
  return list.sort();
}
