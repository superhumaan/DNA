# Recipes — PostgreSQL

Practical drills. Run in staging before production changes.

### Recipe 1

Apply forward migration on staging + rollback plan

**Steps:** prepare → execute → verify → clean up.

### Recipe 2

Failover drill (promote replica or restore backup)

**Steps:** prepare → execute → verify → clean up.

### Recipe 3

Explain analyze a slow query and add index safely

**Steps:** prepare → execute → verify → clean up.


## Definition of success
Each recipe leaves the system healthy and leaves an audit trail (logs or ticket note).
