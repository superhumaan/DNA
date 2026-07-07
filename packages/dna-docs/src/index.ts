import { PRODUCT_NAME, COMPANY_NAME } from "@superhumaan/dna-config";

export function getReadmeIntro(): string {
  return `# ${PRODUCT_NAME}

> Git remembers your code. DNA remembers your system.

Created by **${COMPANY_NAME}**.
`;
}

export const DOCS_SECTIONS = [
  "product",
  "architecture",
  "security",
  "qa",
  "devops",
  "compliance",
  "srs",
  "release-notes",
] as const;
