> **DNA Prompt Stem:** `create-pr` — read `.DNA/stems/create-pr/` (all files) before proceeding.

# Create pull request

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and the contextLoads for this stem. Mark stub Impressions as STUB — do not cite as truth.

## Gather (parallel)

```bash
git status
git diff
git diff <base>...HEAD
git log <base>..HEAD --oneline
```

Base: main/master (detect). Push `-u` if needed. Neural intent: `create_pr`.

## Checklist

- [ ] All commits since base reflected in summary (not tip-only)
- [ ] No secrets in diff or PR body
- [ ] Summary 1–3 bullets (why)
- [ ] Test plan checklist
- [ ] `gh pr create` → return URL

## Artifacts

| Artifact | Path |
|----------|------|
| PR | GitHub PR URL |
| Optional body draft | `.DNA/plans/pr-body.md` if review-before-create requested |

## Failure modes

| Mode | Response |
|------|----------|
| Nothing to push | Report clean/empty; do not open empty PR |
| gh auth missing | Instruct `dna github login` / `gh auth login` — do not invent token |
| Protected branch force needed | Refuse force-push main/master |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; say what is absent; do not invent scaffolding unless asked |
| Ambiguous scope | One clarifying question max, then proceed with stated assumptions |
| Secrets / credentials needed | Never print them; list which env vars / keychain items are required |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
