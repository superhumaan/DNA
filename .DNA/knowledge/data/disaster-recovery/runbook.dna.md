# DR — Runbook Template

## 1. Detect
- Region health checks failing
- Error budget burn / paging

## 2. Decide
- Confirm region outage vs app bug
- Invoke incident commander; time-box failover decision

## 3. Failover (active-passive hot)
1. Pause writes (maintenance mode) if split-brain risk
2. Promote replica / restore DB in DR
3. Verify data checkpoint
4. Scale DR app tier
5. Switch GLB/DNS
6. Re-enable webhooks; replay from queue

## 4. Communicate
- Status page; customer email if SLA breach

## 5. Post-incident
- Failback plan when HQ healthy
- Update `amygdala/repeated-failures.md`
- Schedule game-day follow-up

```bash
dna plan compliance --frameworks iso27001,soc2 --tier corporate --quote "DR test evidence"
```
