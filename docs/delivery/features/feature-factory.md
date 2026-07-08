# Feature factory

DNA's feature factory lets teams describe features in plain language — in Cursor, Claude, or the terminal — and get structured plans, knowledge, and quality gates automatically.

---

## How it works

Installed during `dna init`. No copy-paste prompts required.

```bash
# In Cursor or Claude chat — describe what you want
"I want providers to record phone calls and transcribe notes"

# Or from terminal
dna feature "Admin portal with Google directory sync and audit log"
```

DNA generates:

- Feature plan in `.DNA/plans/`
- Relevant knowledge pack installs
- neuralNetwork intent routing
- Quality report template

---

## Quality gates

Each feature gets a **local quality report** (SonarQube-style SAST + lint/typecheck) in `.DNA/reports/quality/` — no SonarQube server needed.

```bash
dna quality report --feature
```

Agents should run this before marking work complete.

---

## Close-out gates

```bash
dna docker build      # Container build verification
dna github push       # Push with GitHub auth from init
```

---

## Uninstall

```bash
dna feature-factory uninstall
```

---

## Related

- [Platform features](./platform-features/overview.md)
- [Quality reports](../../quality-assurance/quality-reports.md)
- [Platform catalog](../../product/platform-catalog.md)
