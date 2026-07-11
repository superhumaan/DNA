> **DNA Prompt Stem:** `discovery-setup` — read `.DNA/stems/discovery-setup/` (all files) before proceeding.

# Discovery setup

Configure DNA discovery profile for how this team shapes products.

User context: $ARGUMENTS

## Run

```bash
npx dna discovery show
npx dna discovery set --lifecycle <ideation|problem-validation|solution-validation|pmf|growth|scale> \
  --team <innovation-lab|discovery-squad|embedded-triad|dual-track|design-ops|none> \
  --processes continuous-discovery,double-diamond \
  --methods user-interviews,usability-testing \
  --events design-sprint,research-readout
npx dna plan discovery
```

## Output

1. Restate lifecycle stage and team model in plain English
2. List installed discovery packs
3. Scaffold Impressions if needed
4. Suggest next stem: plan-research or synthesize-research
