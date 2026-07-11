<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# Delivery Behaviour

## Profile

- **Methodology:** DNA Feature Factory (`dna-default`)
- **Company archetype:** None (`none`)
- **Ticket system:** github
- **Doc system:** impressions
- **Work hierarchy:** feature → story → task
- **Custom overrides:** `.DNA/delivery/profile.md`

## Rules — tickets and documents

1. **Before creating tickets or specs:** run `dna context methodology` or read `.DNA/knowledge/methodologies/`
2. **Match org hierarchy** — use feature → story → task, not DNA defaults unless methodology is dna-default
3. **Ticket tool:** output for **github** field conventions (see `methodologies/ticket-writing`)
4. **Doc tool:** output for **impressions** template shape (see `methodologies/document-writing`)
5. **Custom profile wins** — if `.DNA/delivery/profile.md` conflicts with packs, follow custom profile
6. **Code gates unchanged** — methodology shapes planning artifacts; DNA still requires tests, coverage, quality report, docker, push

## Ceremonies

- plan
- implement
- quality-gate
- ship

## Stem packs

- `/create-ticket` — write work items in org format
- `/write-spec` — PRD, design doc, RFC per methodology
- `/break-down-work` — decompose initiative to executable units
- `/align-delivery` — verify plan matches how this team works
- `/methodology-setup` — configure or change delivery profile
