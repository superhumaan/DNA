# Recipes — Redis

Practical drills. Run in staging before production changes.

### Recipe 1

Cache stampede protection

**Steps:** prepare → execute → verify → clean up.

### Recipe 2

Flush namespace in staging only

**Steps:** prepare → execute → verify → clean up.

### Recipe 3

Failover to DB-only path

**Steps:** prepare → execute → verify → clean up.


## Definition of success
Each recipe leaves the system healthy and leaves an audit trail (logs or ticket note).
