# Guidelines

## MUST
- Run real `npx dna` commands in shell — never invent CLI output
- Load `.DNA/neuralNetwork.json`, matching behaviour, and listed contextLoads before acting
- Respond in plain English; lead with outcome, then evidence paths
- Reuse the repository's existing packaging, publish, theme, and API patterns
- Write named artifacts to the paths this stem specifies (or state why deferred)
- Cover failure modes listed in the prompt — do not skip the unhappy path
- Cite concrete evidence (paths, CLI output, configs) for every material claim
- If the required surface is absent, stop and say so — do not invent a second product
- Keep the helper headless: no focus steal, no extra UI
- Make enable and disable reversible in the same session
- Document registration, smoke, and removal in the agent notes

## SHOULD
- Hand off to `ship-feature` when implementation needs the agent loop
- Label unverified claims as **assumption**
- End with the next stem and open questions

## NEVER
- Skip reading this stem's guidelines, expectations, and context
- Force-push main/master
- Commit or echo secrets, signing keys, or credentials
- Name or copy another repository's product, host, brand, palette, or script
- Invent metrics or ship status without measurement or an assumption label
- Leave work with no artifact path and no explicit deferral reason
- Add analytics or a remote call just so the helper can check in
- Hide the helper so the user cannot turn it off
