import { HEALTHCARE_OVERVIEW_COUNTRY_IDS } from "./catalog-wave-healthcare-overview-countries.js";

/** Installed with every country healthcare bundle. */
export const HEALTHCARE_UNIVERSAL_BUNDLE_PACKS = [
  "healthcare/overview",
  "healthcare/fhir-r4",
  "healthcare/phi-engineering",
  "healthcare/terminology",
] as const;

/** Country-specific packs beyond universal — includes overview, support, and regional depth. */
export const HEALTHCARE_COUNTRY_BUNDLE_PACKS: Record<string, readonly string[]> = {
  us: [
    "healthcare/overview-us",
    "healthcare/us-support",
    "healthcare/smart-on-fhir",
    "healthcare/redox",
    "healthcare/epic",
    "healthcare/cms-interop",
    "healthcare/da-vinci",
    "healthcare/tefca-qhin",
    "healthcare/patient-portal",
    "healthcare/telehealth",
    "healthcare/fda-samd",
    "healthcare/x12-edi",
  ],
  uk: [
    "healthcare/overview-uk",
    "healthcare/uk-support",
    "healthcare/nhs-fhir",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "healthcare/telehealth",
    "compliance/gdpr",
  ],
  ca: [
    "healthcare/overview-ca",
    "healthcare/ca-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
    "healthcare/redox",
  ],
  au: [
    "healthcare/overview-au",
    "healthcare/au-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  eu: [
    "healthcare/overview-eu",
    "healthcare/eu-support",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  de: [
    "healthcare/overview-de",
    "healthcare/de-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "healthcare/telehealth",
    "compliance/gdpr",
  ],
  fr: [
    "healthcare/overview-fr",
    "healthcare/fr-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "healthcare/telehealth",
    "healthcare/smart-on-fhir",
    "compliance/gdpr",
  ],
  ie: [
    "healthcare/overview-ie",
    "healthcare/ie-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  nl: [
    "healthcare/overview-nl",
    "healthcare/nl-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  ch: [
    "healthcare/overview-ch",
    "healthcare/ch-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  jp: [
    "healthcare/overview-jp",
    "healthcare/jp-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  kr: [
    "healthcare/overview-kr",
    "healthcare/kr-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  sg: [
    "healthcare/overview-sg",
    "healthcare/sg-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  nz: [
    "healthcare/overview-nz",
    "healthcare/nz-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  in: [
    "healthcare/overview-in",
    "healthcare/in-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  br: [
    "healthcare/overview-br",
    "healthcare/br-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  mx: [
    "healthcare/overview-mx",
    "healthcare/mx-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  za: [
    "healthcare/overview-za",
    "healthcare/za-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  sa: [
    "healthcare/overview-sa",
    "healthcare/sa-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  ae: [
    "healthcare/overview-ae",
    "healthcare/ae-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  il: [
    "healthcare/overview-il",
    "healthcare/il-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  it: [
    "healthcare/overview-it",
    "healthcare/it-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  es: [
    "healthcare/overview-es",
    "healthcare/es-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  se: [
    "healthcare/overview-se",
    "healthcare/se-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  no: [
    "healthcare/overview-no",
    "healthcare/no-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  dk: [
    "healthcare/overview-dk",
    "healthcare/dk-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  fi: [
    "healthcare/overview-fi",
    "healthcare/fi-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  at: [
    "healthcare/overview-at",
    "healthcare/at-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  be: [
    "healthcare/overview-be",
    "healthcare/be-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  pl: [
    "healthcare/overview-pl",
    "healthcare/pl-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  pt: [
    "healthcare/overview-pt",
    "healthcare/pt-support",
    "healthcare/overview-eu",
    "healthcare/mdr-eu",
    "healthcare/patient-portal",
    "compliance/gdpr",
  ],
  tw: [
    "healthcare/overview-tw",
    "healthcare/tw-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  hk: [
    "healthcare/overview-hk",
    "healthcare/hk-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  my: [
    "healthcare/overview-my",
    "healthcare/my-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  th: [
    "healthcare/overview-th",
    "healthcare/th-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  ph: [
    "healthcare/overview-ph",
    "healthcare/ph-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  id: [
    "healthcare/overview-id",
    "healthcare/id-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  vn: [
    "healthcare/overview-vn",
    "healthcare/vn-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
  cn: [
    "healthcare/overview-cn",
    "healthcare/cn-support",
    "healthcare/patient-portal",
    "healthcare/telehealth",
  ],
};

export const HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS = Object.keys(HEALTHCARE_COUNTRY_BUNDLE_PACKS).map(
  (iso) => `healthcare/${iso}-support`,
);

const OVERVIEW_ISO_RE = /^healthcare\/overview-([a-z]{2})$/;

/** Extract ISO code from a country overview pack id. */
export function healthcareOverviewIso(packId: string): string | undefined {
  const m = packId.match(OVERVIEW_ISO_RE);
  return m?.[1];
}

/**
 * Resolve full install bundle when user installs a country healthcare overview.
 * Returns null when the pack is not a country overview entry point.
 */
export function resolveHealthcareCountryBundlePackIds(packId: string): string[] | null {
  const iso = healthcareOverviewIso(packId);
  if (!iso || !HEALTHCARE_COUNTRY_BUNDLE_PACKS[iso]) return null;

  const countryPacks = HEALTHCARE_COUNTRY_BUNDLE_PACKS[iso];
  const ordered = [packId, ...HEALTHCARE_UNIVERSAL_BUNDLE_PACKS, ...countryPacks.filter((p) => p !== packId)];
  return [...new Set(ordered)];
}

/** True when pack id is a registered country healthcare overview. */
export function isHealthcareCountryOverviewPack(packId: string): boolean {
  return HEALTHCARE_OVERVIEW_COUNTRY_IDS.includes(packId);
}
