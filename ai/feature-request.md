# Feature Request

_Auto-maintained by DNA. Updated 2026-07-24. The user does not fill this in manually._

## Latest request

> I want this level of detail, /labs is extremely useful and helpful
> (Sentry Issues list + Issue detail screenshots — approved)

## Acceptance Criteria

- [x] Issues list shows: title + category, short ID / fingerprint hint, culprit, last seen, age, event count, optional users, severity, mini 24h trend
- [x] Issue detail hero: Events, Users (or —), First seen, Last seen, severity, environment, release
- [x] Issue detail includes Highlights (derived), Events volume chart, Stack Trace, Breadcrumbs, Tags, Contexts, Additional Data JSON, Related events
- [x] Packages / Trace panels render when data exists; otherwise clear empty states
- [x] Tag search/filter on detail when tags present
- [x] Empty runtime still loads without broken charts
- [ ] Quality gate PASS; docker build; push feature branch
