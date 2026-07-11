# Observability

## Three pillars
- **Logs:** structured JSON, correlation IDs
- **Metrics:** RED/USE for services
- **Traces:** OpenTelemetry → vendor (Datadog, Honeycomb, Grafana)

Never log secrets or full PII. Pair with `runtime.behaviour.md`.