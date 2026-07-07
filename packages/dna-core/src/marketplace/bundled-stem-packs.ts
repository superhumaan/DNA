import type { KnowledgePack } from "@superhumaan/dna-config";
import { STEM_FRAMEWORK_PACKS } from "./bundled-stem-frameworks.js";
import { STEM_PLATFORM_PACKS } from "./bundled-stem-platforms.js";

/** Stem packs — foundational delivery-surface knowledge (mobile, PWA, desktop, extensions, GPT, etc.) */
export const STEM_PACKS: KnowledgePack[] = [...STEM_FRAMEWORK_PACKS, ...STEM_PLATFORM_PACKS];

export const STEM_PACK_IDS = STEM_PACKS.map((p) => p.id);
