# Migration & upgrade — PCI DSS Depth

## Principles
- Read changelog; run in staging first
- Keep one rollback path (image tag / flag)
- Update Impressions if architecture changes

## Compatibility
- Expand/contract for schema changes
- Dual-run old/new readers when flipping formats
- Version webhooks and APIs explicitly

## Rollback
Document the exact command or previous image digest. Test restore for data stores.

## Post-upgrade
- [ ] Smoke recipes pass
- [ ] Alerts quiet
- [ ] Impressions / CellularMemory updated if architecture changed
- [ ] Changelog note for operators
