# Feature Quality Workflow

Local SonarQube-style analysis — runs by default during feature factory. No SonarQube server required.

## When

- **Feature start:** `dna feature "..."` writes a baseline report to `.DNA/reports/quality/`
- **Before completion:** Code Quality Analyst runs `dna quality report --feature`
- **CI optional:** add `dna quality report` to your pipeline for full-repo scans

## Commands

```bash
dna quality report --feature          # feature-scoped gate (default for factory)
dna quality report                    # full repository scan
dna quality report --paths src/foo.ts # specific files
dna quality scan --feature            # stdout only, no file
```

## Gate

- **PASS** — no blocker or critical issues
- **FAIL** — fix blockers/criticals before marking feature complete

Reports: `.DNA/reports/quality/<feature-slug>.md` and `latest.md`

## Checks

| Category | Examples |
|----------|----------|
| Security | Hardcoded secrets, eval, unsafe HTML |
| Reliability | Empty catch, debugger |
| Maintainability | Large files, debug logs, `any` types |
| Coverage | New files without tests (feature scope) |
| Toolchain | lint, typecheck, check scripts |
