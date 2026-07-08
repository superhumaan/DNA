# Daily workflow

The standard DNA workflow after `dna init`.

---

## Morning setup

```bash
dna scan
dna context cursor
dna doctor
```

---

## Before AI sessions

```bash
# General project context
dna context cursor

# Platform feature work
dna context platform --feature admin-portal

# RBAC work
dna context rbac

# Compliance work
dna context compliance --tier sme --frameworks gdpr
```

---

## During development

```bash
dna validate                    # Check Behaviour compliance
dna quality report --feature    # Feature factory quality gate
dna feature "Describe what you want in plain language"
```

---

## Brownfield projects

```bash
dna analyze --deep
dna document --from-code
dna plan ivf --quote "Your migration goals"
dna context ivf
```

See [Brownfield IVF](./brownfield-ivf.md).

---

## Close-out gates

```bash
dna docker build
dna github push
```

GitHub permissions are granted once during `dna init` via browser login.

---

## Related

- [Quick start](../../engineering/quick-start.md)
- [Feature factory](./feature-factory.md)
