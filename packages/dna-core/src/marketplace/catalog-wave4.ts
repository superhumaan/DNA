import type { KnowledgePack } from "@superhumaan/dna-config";
import { WAVE4_CLOUD_INFRA_PACKS } from "./catalog-wave4-cloud-infra.js";
import { WAVE4_BACKEND_DATA_PACKS } from "./catalog-wave4-backend-data.js";
import {
  WAVE4_FRONTEND_DESIGN_PACKS,
  WAVE4_ECOMMERCE_LOGISTICS_PACKS,
} from "./catalog-wave4-frontend-ecommerce.js";
import {
  WAVE4_AUTH_SECURITY_PACKS,
  WAVE4_INTEGRATIONS_PACKS,
} from "./catalog-wave4-auth-integrations.js";
import {
  WAVE4_VERTICALS_PACKS,
  WAVE4_AI_DEVTOOLS_PACKS,
} from "./catalog-wave4-verticals-ai.js";

/** Wave 4 — remaining gap inventory: regional cloud, ORMs, long-tail verticals, security depth */
export const CATALOG_WAVE4_PACKS: KnowledgePack[] = [
  ...WAVE4_CLOUD_INFRA_PACKS,
  ...WAVE4_BACKEND_DATA_PACKS,
  ...WAVE4_FRONTEND_DESIGN_PACKS,
  ...WAVE4_ECOMMERCE_LOGISTICS_PACKS,
  ...WAVE4_AUTH_SECURITY_PACKS,
  ...WAVE4_INTEGRATIONS_PACKS,
  ...WAVE4_VERTICALS_PACKS,
  ...WAVE4_AI_DEVTOOLS_PACKS,
];

export const CATALOG_WAVE4_COUNTS = {
  cloudInfra: WAVE4_CLOUD_INFRA_PACKS.length,
  backendData: WAVE4_BACKEND_DATA_PACKS.length,
  frontendDesign: WAVE4_FRONTEND_DESIGN_PACKS.length,
  ecommerceLogistics: WAVE4_ECOMMERCE_LOGISTICS_PACKS.length,
  authSecurity: WAVE4_AUTH_SECURITY_PACKS.length,
  integrations: WAVE4_INTEGRATIONS_PACKS.length,
  verticals: WAVE4_VERTICALS_PACKS.length,
  aiDevtools: WAVE4_AI_DEVTOOLS_PACKS.length,
  total: CATALOG_WAVE4_PACKS.length,
};
