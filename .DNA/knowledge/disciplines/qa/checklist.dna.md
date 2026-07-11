# QA — Feature Completion Checklist

Before marking a feature done:

- [ ] Unit tests for new logic
- [ ] Integration tests for new API routes
- [ ] Permission-denied cases tested server-side
- [ ] `npm test` passes locally
- [ ] `npm run test:coverage` meets thresholds
- [ ] `dna quality report --feature` → PASS
- [ ] No unrelated files modified
- [ ] Success criteria in `ai/feature-request.md` checked off
