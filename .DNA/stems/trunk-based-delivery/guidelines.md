# Guidelines

## MUST
- Run real `npx dna` commands in shell — never invent CLI output
- Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting
- Respond in plain English; lead with outcome, then evidence paths
- Reuse existing DNA patterns, rules, and knowledge — do not invent parallel workflows
- Write named artifacts to the paths this stem specifies (or state why deferred)
- Cover failure modes listed in the prompt — do not skip the unhappy path
- Cite concrete evidence (paths, CLI output, configs) for every material claim
- Provide 2–3 example-quality responses in spirit: specific, scoped, next-step clear
- Stay on trunk or the one user-chosen short-lived branch
- Load CellularMemory before shipping so prior decisions are not forgotten
- Quality PASS before push
- Push current branch only — no inventing remotes

## SHOULD
- If a surface (Tauri, fleet, Lab, admin, i18n) is missing, say so and degrade gracefully
- Hand off to `ship-feature` / agent-loop when implementation is required after a plan/audit
- Label unverified claims as **assumption**
- End with next stem + open questions

## NEVER
- Skip reading this stem's guidelines, expectations, and context
- Force-push main/master
- Commit or echo secrets from env, signing keys, or CLI output
- Invent metrics, scan results, or audit scores without measurement or assumption labels
- Implement product features when this stem is plan-only or audit-only
- Leave work with no artifact path and no explicit deferral reason
- Create feature/* or hop branches to test on preview
- Dual-track the same feature across multiple remotes
- Invent marketing slogans or decorative subheaders under page titles
- Start a parallel architecture that ignores existing repo patterns
