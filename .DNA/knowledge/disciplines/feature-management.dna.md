# End-to-End Feature Management

## Lifecycle
1. Intent captured (user story / initiative)
2. DNA plan generated (`dna plan feature <id>`)
3. Permission matrix if access-controlled
4. API + persistence
5. UI with all surfaces gated
6. Tests + Impressions update
7. Feature flag rollout
8. Audit + analytics

## Artifacts per feature
- `.DNA/plans/feature-*.md`
- Permission matrix (if RBAC)
- Impressions architecture update
- Admin config screen (if configurable)

## neuralNetwork
Route via intent matching feature category.
