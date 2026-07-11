# HIPAA — Privacy & Security Rules

## Scope
Applies to **PHI** (Protected Health Information) held by covered entities and business associates in the US.

## PHI in software — engineering rules
- Encrypt ePHI at rest and in transit (addressable → implement unless documented reason not to)
- Unique user IDs; emergency access procedure
- Automatic logoff; audit controls on ePHI access
- **Minimum necessary** — API fields and exports scoped to role
- **Never** log PHI, put PHI in AI prompts, or send PHI to non-BAA vendors

## Business Associate Agreements
Required before any vendor processes PHI (hosting, email, support tools, analytics).

## Breach notification
- **60 days** to HHS if 500+ individuals affected
- Notify individuals without unreasonable delay

## De-identification
Safe Harbor (remove 18 identifiers) or Expert Determination — document method if using de-identified datasets for analytics.
