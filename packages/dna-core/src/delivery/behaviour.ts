import type { DnaConfig } from "@superhumaan/dna-config";
import { getArchetypeMeta, getMethodologyMeta, resolveDeliveryProfile } from "./catalog.js";

export function deliveryBehaviourMarkdown(config: DnaConfig): string {
  const profile = resolveDeliveryProfile(config);
  const meta = getMethodologyMeta(profile.methodology);
  const archetype = getArchetypeMeta(profile.companyArchetype);

  return `<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Delivery Behaviour

## Profile

- **Methodology:** ${meta.name} (\`${profile.methodology}\`)
- **Company archetype:** ${archetype.name} (\`${profile.companyArchetype}\`)
- **Ticket system:** ${profile.ticketSystem}
- **Doc system:** ${profile.docSystem}
- **Work hierarchy:** ${profile.hierarchy.join(" → ")}
- **Custom overrides:** \`${profile.customProfile}\`

## Rules — tickets and documents

1. **Before creating tickets or specs:** run \`dna context methodology\` or read \`.DNA/knowledge/methodologies/\`
2. **Match org hierarchy** — use ${profile.hierarchy.join(" → ")}, not DNA defaults unless methodology is dna-default
3. **Ticket tool:** output for **${profile.ticketSystem}** field conventions (see \`methodologies/ticket-writing\`)
4. **Doc tool:** output for **${profile.docSystem}** template shape (see \`methodologies/document-writing\`)
5. **Custom profile wins** — if \`${profile.customProfile}\` conflicts with packs, follow custom profile
6. **Code gates unchanged** — methodology shapes planning artifacts; DNA still requires tests, coverage, quality report, docker, push

## Ceremonies

${profile.ceremonies.map((c) => `- ${c}`).join("\n") || "- (none configured)"}

## Stem packs

- \`/create-ticket\` — write work items in org format
- \`/write-spec\` — PRD, design doc, RFC per methodology
- \`/break-down-work\` — decompose initiative to executable units
- \`/align-delivery\` — verify plan matches how this team works
- \`/methodology-setup\` — configure or change delivery profile
`;
}
