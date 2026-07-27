# SLA & support — PCI DSS Depth

## Service expectations
Define availability target and support hours for **PCI DSS Depth** surfaces (internal vs customer-facing).

## Severity
| Sev | Meaning | Response |
|-----|---------|----------|
| 1 | Outage / data loss / auth/payment break | Immediate page |
| 2 | Major degradation | Same business day |
| 3 | Minor / workaround exists | Backlog |

## Customer comms
Status page or in-app banner when Sev1/2; never silence incidents.

## Handoffs
On-call → owning team → vendor support with ticket IDs and recent deploy SHA.
