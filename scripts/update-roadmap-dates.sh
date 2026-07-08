#!/usr/bin/env bash
# Add start/end dates to all DNA roadmap GitHub issues.
set -euo pipefail

REPO="superhumaan/DNA"

update_issue() {
  local num="$1" start="$2" end="$3" extra="${4:-}"
  local current
  current=$(gh issue view "$num" --repo "$REPO" --json body -q .body)
  # Strip existing schedule block if re-running
  current=$(echo "$current" | sed '/^## Schedule$/,/^## /{ /^## Schedule$/d; /^## /!d; }')
  current=$(echo "$current" | sed '/^## Schedule$/,${ /^## Schedule$/d; /^Start:/d; /^End:/d; /^$/d; }')
  # Remove trailing schedule section at end
  current=$(echo "$current" | sed '/^## Schedule$/,$d')

  gh issue edit "$num" --repo "$REPO" --body "$(cat <<EOF
${current}

## Schedule

- **Start:** ${start}
- **End:** ${end}
${extra}
EOF
)"
  echo "Updated #${num} (${start} → ${end})"
}

update_issue 1  "2026-05-01" "2026-07-31"
update_issue 2  "2026-05-05" "2026-06-20"
update_issue 3  "2026-05-12" "2026-06-28"
update_issue 4  "2026-05-19" "2026-07-01"
update_issue 5  "2026-06-02" "2026-07-05"
update_issue 6  "2026-06-09" "2026-07-08"
update_issue 7  "2026-06-16" "2026-07-08"
update_issue 8  "2026-06-23" "2026-07-08"
update_issue 9  "2026-06-30" "2026-07-08"
update_issue 10 "2026-07-01" "2026-08-31"
update_issue 11 "2026-07-08" "2026-09-15"
update_issue 12 "2026-09-01" "2026-12-15"
update_issue 13 "2026-10-01" "2027-01-31"
update_issue 14 "2026-10-15" "2027-02-28"
update_issue 15 "2027-01-01" "2027-03-31"
update_issue 16 "2026-08-01" "2026-10-31"
update_issue 17 "2026-11-01" "2027-02-28"

echo "All roadmap issues updated with schedule dates."
