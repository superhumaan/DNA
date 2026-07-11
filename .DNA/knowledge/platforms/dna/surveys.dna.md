# Survey Programme (CSS + NPS)

## Types
- **CSS** — Client Satisfaction Score (numeric scale avg)
- **NPS** — Net Promoter Score (0–10)

## Customisation surfaces (per survey type)
- Target audience
- Email template
- Login/branding page
- Form builder (sections + fields, drag-drop)
- Schedule + campaign enable

## Public respondent flow
`/survey/{css|nps}/enter` → passcode → form → thank you

## Ops hub
`/operations/surveys` — manager role required

## Scheduler
Cron checks campaign_enabled; NPS tied to active CSS campaign in DNA production rule.
