# DR — Passive / Cold (Backup–Restore)

## Pattern
- Production **active** in HQ region only
- DR region holds: IaC templates, **offline backups**, optional idle networking
- On disaster: provision infra → restore latest backup → repoint DNS

## RPO / RTO
- **RPO:** last backup interval (e.g. 1h WAL + nightly snapshot)
- **RTO:** hours — acceptable for startup tier if documented

## Requirements
- Backup encryption + restore tested (not just "backups exist")
- Runbook in `DNA/Impressions/devops/rollback-plan.md`
- Communication template for customers

## When to upgrade
Enterprise RFP requires hot standby → move to active-passive warm minimum.
