import type { KnowledgePack } from "@superhumaan/dna-config";
import { WAVE3_BACKEND_FRONTEND_PACKS } from "./catalog-wave3-backend-frontend.js";
import { WAVE3_ENTERPRISE_PACKS } from "./catalog-wave3-enterprise.js";
import { WAVE3_CLOUD_OPS_PACKS } from "./catalog-wave3-cloud-ops.js";
import {
  WAVE3_GAMING_XR_PACKS,
  WAVE3_WEB3_IOT_PACKS,
  WAVE3_HEALTHCARE_EXTENDED_PACKS,
} from "./catalog-wave3-verticals-deep.js";
import { WAVE3_DATA_COMPLIANCE_CMS_PACKS } from "./catalog-wave3-data-compliance-cms.js";
import { WAVE3_AI_PACKS } from "./catalog-wave3-ai-extended.js";

/** Wave 3 — enterprise ERP/HR, extended frontend/backend, compliance depth, gaming/XR, long-tail */
export const CATALOG_WAVE3_PACKS: KnowledgePack[] = [
  ...WAVE3_BACKEND_FRONTEND_PACKS,
  ...WAVE3_ENTERPRISE_PACKS,
  ...WAVE3_CLOUD_OPS_PACKS,
  ...WAVE3_GAMING_XR_PACKS,
  ...WAVE3_WEB3_IOT_PACKS,
  ...WAVE3_HEALTHCARE_EXTENDED_PACKS,
  ...WAVE3_DATA_COMPLIANCE_CMS_PACKS,
  ...WAVE3_AI_PACKS,
];

export const CATALOG_WAVE3_COUNTS = {
  backendFrontend: WAVE3_BACKEND_FRONTEND_PACKS.length,
  enterprise: WAVE3_ENTERPRISE_PACKS.length,
  cloudOps: WAVE3_CLOUD_OPS_PACKS.length,
  gamingXr: WAVE3_GAMING_XR_PACKS.length,
  web3Iot: WAVE3_WEB3_IOT_PACKS.length,
  healthcareExtended: WAVE3_HEALTHCARE_EXTENDED_PACKS.length,
  dataComplianceCms: WAVE3_DATA_COMPLIANCE_CMS_PACKS.length,
  aiExtended: WAVE3_AI_PACKS.length,
  total: CATALOG_WAVE3_PACKS.length,
};
