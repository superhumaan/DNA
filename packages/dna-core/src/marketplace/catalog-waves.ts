import type { KnowledgePack } from "@superhumaan/dna-config";
import { HEALTHCARE_PACKS } from "./catalog-wave-healthcare.js";
import { DATABASE_PACKS } from "./catalog-wave-databases.js";
import { CLOUD_PACKS } from "./catalog-wave-cloud.js";
import { AUTH_PACKS, AI_PACKS } from "./catalog-wave-auth-ai.js";
import { INTEGRATION_PACKS, OBSERVABILITY_PACKS } from "./catalog-wave-integrations-observability.js";
import { FRONTEND_TOOL_PACKS, ECOMMERCE_CRM_PACKS } from "./catalog-wave-frontend-ecommerce.js";
import {
  FINTECH_EXTENDED_PACKS,
  REALTIME_PACKS,
  VERTICAL_MISC_PACKS,
} from "./catalog-wave-fintech-realtime-verticals.js";
import { CATALOG_WAVE3_PACKS, CATALOG_WAVE3_COUNTS } from "./catalog-wave3.js";
import { CATALOG_WAVE4_PACKS, CATALOG_WAVE4_COUNTS } from "./catalog-wave4.js";
import { WAVE5_FINAL_PACKS } from "./catalog-wave5-final.js";

/** Wave 2+ catalog packs — databases, cloud, healthcare, integrations, verticals */
export const CATALOG_WAVE_PACKS: KnowledgePack[] = [
  ...HEALTHCARE_PACKS,
  ...DATABASE_PACKS,
  ...CLOUD_PACKS,
  ...AUTH_PACKS,
  ...AI_PACKS,
  ...INTEGRATION_PACKS,
  ...OBSERVABILITY_PACKS,
  ...FRONTEND_TOOL_PACKS,
  ...ECOMMERCE_CRM_PACKS,
  ...FINTECH_EXTENDED_PACKS,
  ...REALTIME_PACKS,
  ...VERTICAL_MISC_PACKS,
  ...CATALOG_WAVE3_PACKS,
  ...CATALOG_WAVE4_PACKS,
  ...WAVE5_FINAL_PACKS,
];

export const CATALOG_WAVE_COUNTS = {
  healthcare: HEALTHCARE_PACKS.length,
  databases: DATABASE_PACKS.length,
  cloud: CLOUD_PACKS.length,
  auth: AUTH_PACKS.length,
  ai: AI_PACKS.length,
  integrations: INTEGRATION_PACKS.length,
  observability: OBSERVABILITY_PACKS.length,
  frontendTools: FRONTEND_TOOL_PACKS.length,
  ecommerceCrm: ECOMMERCE_CRM_PACKS.length,
  fintechExtended: FINTECH_EXTENDED_PACKS.length,
  realtime: REALTIME_PACKS.length,
  verticalMisc: VERTICAL_MISC_PACKS.length,
  wave3: CATALOG_WAVE3_COUNTS,
  wave4: CATALOG_WAVE4_COUNTS,
  wave5: WAVE5_FINAL_PACKS.length,
  total: CATALOG_WAVE_PACKS.length,
};
