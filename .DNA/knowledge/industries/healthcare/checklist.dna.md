# Healthcare — Best Practices

**Do:**
- Treat PHI as toxic — minimize, encrypt, audit every access
- Use FHIR resources idiomatically; don't invent clinical schemas
- Design for clinician interruption and 10-second tasks
- Support accessibility (WCAG 2.2 AA) — aging patients and clinicians
- Plan for offline/degraded mode in wards

**Don't:**
- Store PHI in analytics without de-identification
- Mix prod and staging patient data
- Skip BAA/DPA before any subprocessor
- Use consumer chat UX for clinical alerts (alarm fatigue)