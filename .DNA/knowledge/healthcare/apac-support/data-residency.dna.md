# APAC — Data Residency

| Region | Common cloud | Notes |
|--------|--------------|-------|
| Australia | ap-southeast-2 (Sydney) | My Health Record data rules |
| New Zealand | ap-southeast-2 or NZ Azure | Te Whatu Ora guidance |
| Singapore | ap-southeast-1 | NEHR accredited hosting |
| Japan | ap-northeast-1 (Tokyo) | APPI cross-border consent |
| Korea | ap-northeast-2 (Seoul) | PIPA strict transfer rules |
| India | ap-south-1 (Mumbai) | ABDM data policies |
| Indonesia | ap-southeast-3 (Jakarta) | SATUSEHAT local processing |
| China | in-country only | PIPL — no default AWS US |

## PHI engineering
- Encrypt in transit and at rest; audit PHI access
- Never log clinical documents or identifiers in app logs
- Document subprocessors and data residency in Impressions