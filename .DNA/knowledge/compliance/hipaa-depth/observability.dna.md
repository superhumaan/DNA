# Observability — HIPAA Depth

## Golden signals
- PHI access anomalies
- open BAAs
- training completion

## Instrumentation
- Structured logs with request/trace ids
- Metrics: rate, errors, duration, saturation
- Traces across auth → app → DB/AI/payment

## Alerts (starter)
- Error rate spike vs baseline
- p95 latency budget burn
- Saturation (pool/queue) > threshold
- Certificate / secret expiry (if applicable)

## Dashboards
One “HIPAA Depth health” board: traffic, errors, latency, dependency status. Link from runbook.

## Privacy
Scrub tokens, raw cards, PHI from logs. Sample carefully in regulated domains.
