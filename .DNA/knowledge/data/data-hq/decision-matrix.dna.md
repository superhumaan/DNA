# Data HQ — Decision Matrix

| Factor | Question |
|--------|----------|
| Customers | Where are majority data subjects? |
| Contract | What does enterprise DPA require? |
| Latency | p95 API target for primary users? |
| Team | Where do engineers operate during incidents? |
| Payments | Processor settlement currency & entity? |
| DR | Acceptable RPO if HQ region fails? |

## Tier guidance
| Tier | Data HQ bar |
|------|-------------|
| Startup | Pick one region; document in Impressions; avoid multi-region complexity |
| SME | Named HQ + backup in-region; subprocessors mapped |
| Corporate | HQ per legal entity; formal residency exceptions approved |
| Enterprise | Multi-region with explicit HQ per data category; legal sign-off on replicas |
