import { HEALTHCARE_OVERVIEW_COUNTRY_IDS } from "./catalog-wave-healthcare-overview-countries.js";
import { HEALTHCARE_APAC_ISO_CODES } from "./catalog-wave-healthcare-apac.js";
import { enrichCountryBundlePacks } from "./healthcare-systems-by-country.js";

/** Installed with every country healthcare bundle. */
export const HEALTHCARE_UNIVERSAL_BUNDLE_PACKS = [
  "healthcare/overview",
  "healthcare/fhir-r4",
  "healthcare/phi-engineering",
  "healthcare/terminology",
] as const;

/** Regional APAC packs added to every APAC/Oceania country bundle. */
export const HEALTHCARE_APAC_REGIONAL_BUNDLE_PACKS = [
  "healthcare/overview-apac",
  "healthcare/apac-support",
] as const;

const APAC_BASE = [
  "healthcare/patient-portal",
  "healthcare/telehealth",
  ...HEALTHCARE_APAC_REGIONAL_BUNDLE_PACKS,
] as const;

function apacBundle(
  iso: string,
  extra: readonly string[] = [],
): readonly string[] {
  return [`healthcare/overview-${iso}`, `healthcare/${iso}-support`, ...APAC_BASE, ...extra];
}

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
    "healthcare/smart-on-fhir",
  ],
  au: apacBundle("au"),
  nz: apacBundle("nz"),
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
  jp: apacBundle("jp"),
  kr: apacBundle("kr"),
  sg: apacBundle("sg"),
  in: apacBundle("in"),
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
  tw: apacBundle("tw"),
  hk: apacBundle("hk"),
  my: apacBundle("my"),
  th: apacBundle("th"),
  ph: apacBundle("ph"),
  id: apacBundle("id"),
  vn: apacBundle("vn"),
  cn: apacBundle("cn"),
  bd: apacBundle("bd"),
  pk: apacBundle("pk"),
  lk: apacBundle("lk"),
  np: apacBundle("np"),
  kh: apacBundle("kh"),
  mm: apacBundle("mm"),
};

export const HEALTHCARE_ALL_OVERVIEW_PACK_IDS = [
  ...HEALTHCARE_OVERVIEW_COUNTRY_IDS,
  "healthcare/overview-apac",
  ...HEALTHCARE_APAC_ISO_CODES.map((iso) => `healthcare/overview-${iso}`),
].filter((id, i, arr) => arr.indexOf(id) === i);

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
  if (packId === "healthcare/overview-apac") {
    return [
      "healthcare/overview-apac",
      ...HEALTHCARE_UNIVERSAL_BUNDLE_PACKS,
      ...HEALTHCARE_APAC_REGIONAL_BUNDLE_PACKS.filter((p) => p !== "healthcare/overview-apac"),
    ];
  }

  const iso = healthcareOverviewIso(packId);
  if (!iso || !HEALTHCARE_COUNTRY_BUNDLE_PACKS[iso]) return null;

  const countryPacks = enrichCountryBundlePacks(iso, HEALTHCARE_COUNTRY_BUNDLE_PACKS[iso]);
  const ordered = [packId, ...HEALTHCARE_UNIVERSAL_BUNDLE_PACKS, ...countryPacks.filter((p) => p !== packId)];
  return [...new Set(ordered)];
}

/** True when pack id is a registered country healthcare overview. */
export function isHealthcareCountryOverviewPack(packId: string): boolean {
  return HEALTHCARE_ALL_OVERVIEW_PACK_IDS.includes(packId);
}
