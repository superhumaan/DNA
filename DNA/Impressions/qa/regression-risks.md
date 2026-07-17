# Regression Risks

| Area | Risk | Mitigation |
|------|------|------------|
| Lab authentication/pairing | Public trust bypass or forged state | Unit + HTTP integration tests; timing-safe signatures |
| Shared Lab state | Lost update, split brain, backend outage | Adapter contract/concurrency tests; fail closed |
| Polling capacity | Recompute stampede or oversized payload | 200-viewer load gate, ETag/304 assertions |
| CI strictness | False green or permanently red main | Clean-checkout workflow tests and staged enablement |
| Coverage scope | Inflated metric or hidden critical code | Explicit reviewed include/exclude policy |
| Public health report | Leaked paths/secrets or stale claims | Sanitizer/schema tests, timestamp and source SHA |
| DNA-Web sync | Updating stale sibling checkout | Canonical `DNA-Web` path and sync regression |
| npm release | Version/docs/package drift | Lockfile, package inspection, GitHub publish workflow |
