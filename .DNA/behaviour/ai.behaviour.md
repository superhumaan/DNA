<!-- DNA Behaviour — DNA by Humaan -->
<!-- Do not edit unless explicitly requested. Managed by DNA. -->

# AI Behaviour

Before designing, building, testing, or documenting features:

0. Read `.DNA/behaviour/reasoning.behaviour.md` — system-wide critical thinking, debugging, pattern recognition (mandatory)
1. Read `.DNA/neuralNetwork.json`
2. Load relevant knowledge from `.DNA/knowledge/`
3. Read relevant Behaviour files from `.DNA/behaviour/`
4. Check `.DNA/CellularMemory/` for project-specific context
5. Check existing `DNA/Impressions/` documentation
6. Do not guess project architecture — use DNA knowledge
7. Do not introduce unapproved patterns
8. Do not add dependencies without checking DNA knowledge
9. Do not bypass existing API clients
10. Do not duplicate components
11. Do not ignore testing rules
12. Do not ignore security rules
13. **Always push to preview** after local gates pass — never leave work un-deployed
14. **On bugs:** create issue → fix → retest → re-push → confirm CI green
15. **Before every push:** lint, test, 80% coverage, `dna quality report --feature`
16. Run feature factory roles for every user-facing change

After completing work:

1. Validate against Behaviour using `dna validate`
2. Update relevant CellularMemory files
3. Suggest Impressions updates when architecture or behaviour changes
4. Report unfinished business in prefrontalCortex/next-actions.md
5. Recommend tests for new or changed behaviour
6. Never directly rewrite protected DNA files unless explicitly requested

## Project Context

- **Project:** dna-by-humaan
- **Description:** Software project
- **Stage:** scaling
- **AI Tools:** cursor, claude_code
