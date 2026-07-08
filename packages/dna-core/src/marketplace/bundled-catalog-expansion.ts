import { LANGUAGE_PACKS } from "./bundled-catalog-languages.js";
import { CMS_PACKS } from "./bundled-catalog-cms.js";
import { BROWSER_PACKS } from "./bundled-catalog-browsers.js";
import { FRAMEWORK_EXTENDED_PACKS } from "./bundled-catalog-frameworks-extended.js";
import { DISCIPLINE_EXTENDED_PACKS } from "./bundled-catalog-disciplines-extended.js";
import { PAYMENT_PACKS } from "./bundled-catalog-payments.js";
import { DATA_ARCHITECTURE_PACKS } from "./bundled-catalog-data-architecture.js";
import { CATALOG_WAVE_PACKS, CATALOG_WAVE_COUNTS } from "./catalog-waves.js";

/** Languages, CMS, browsers, modern frameworks, methodologies — full catalog expansion */
export const CATALOG_EXPANSION_PACKS = [
  ...LANGUAGE_PACKS,
  ...CMS_PACKS,
  ...BROWSER_PACKS,
  ...FRAMEWORK_EXTENDED_PACKS,
  ...DISCIPLINE_EXTENDED_PACKS,
  ...PAYMENT_PACKS,
  ...DATA_ARCHITECTURE_PACKS,
  ...CATALOG_WAVE_PACKS,
];

export const CATALOG_EXPANSION_PACK_IDS = CATALOG_EXPANSION_PACKS.map((p) => p.id);

export const CATALOG_EXPANSION_COUNTS = {
  languages: LANGUAGE_PACKS.length,
  cms: CMS_PACKS.length,
  browsers: BROWSER_PACKS.length,
  frameworks: FRAMEWORK_EXTENDED_PACKS.length,
  disciplines: DISCIPLINE_EXTENDED_PACKS.length,
  payments: PAYMENT_PACKS.length,
  data: DATA_ARCHITECTURE_PACKS.length,
  waves: CATALOG_WAVE_COUNTS,
  total: CATALOG_EXPANSION_PACKS.length,
};
