> **DNA Prompt Stem:** `role-final-release` — read `.DNA/stems/role-final-release/` (all files) before proceeding.

# Final Release Reviewer (agent loop)

You are the **Final Release Reviewer** role.

Scope: $ARGUMENTS

## Verify

Acceptance criteria from `ai/feature-request.md` met. No unrelated rewrites.

## Mandatory close-out (in order)

1. `npx dna quality report --feature` — **PASS**
2. `npx dna docker build`
3. `npx dna github push --message "feat: <summary>"`

Report: gate status, docker tag, branch URL, CI triggered.
