> **DNA Prompt Stem:** `methodology-setup` — read `.DNA/stems/methodology-setup/` (all files) before proceeding.

# Methodology setup

Configure DNA delivery profile for how this team actually works.

User context: $ARGUMENTS

## Run

```bash
npx dna methodology show
npx dna methodology set --methodology <scrum|kanban|less|safe|spotify-model|shape-up|dna-default> \
  --archetype <travel-scale-up|big-tech|research-lab|agency|startup|none> \
  --ticket-system <jira|linear|github|azure-devops|none> \
  --doc-system <confluence|notion|impressions|google-docs|github-wiki>
npx dna plan methodology
```

## Output

1. Restate detected or chosen methodology in plain English
2. Show hierarchy and ceremonies
3. Confirm knowledge packs installed
4. Point user to `/create-ticket` and `/write-spec` stems
