#!/usr/bin/env bash
# Sync DNA roadmap issues to GitHub Project #3 (DNA - Roadmap).
# Requires: gh auth refresh -s read:project,project
set -euo pipefail

OWNER="superhumaan"
PROJECT_NUMBER=3
REPO="superhumaan/DNA"

echo "Checking gh project scopes..."
if ! gh project view "$PROJECT_NUMBER" --owner "$OWNER" &>/dev/null; then
  echo "Missing project scopes. Run:"
  echo "  gh auth refresh -s read:project,project"
  exit 1
fi

# Roadmap issue numbers (created 2026-07-08)
ISSUES=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17)

# Status field values — adjust if your project uses different option names
SHIPPED=(1 2 3 4 5 6 7 8 9 10 12 13 14 15 16 17)
IN_PROGRESS=(11)
PLANNED=()

echo "Adding ${#ISSUES[@]} roadmap issues to project..."
for num in "${ISSUES[@]}"; do
  url=$(gh issue view "$num" --repo "$REPO" --json url -q .url)
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$url" 2>/dev/null || true
done

echo "Done. Set Status column manually or via:"
echo "  gh project field-list $PROJECT_NUMBER --owner $OWNER"
echo ""
echo "Suggested column mapping:"
echo "  Shipped (unreleased): ${SHIPPED[*]-}"
echo "  In progress:          ${IN_PROGRESS[*]-}"
echo "  Planned:              ${PLANNED[*]-}"
echo ""
echo "Date fields (set on project board Start/End date columns):"
echo "  See README.md Roadmap table or run: ./scripts/update-roadmap-dates.sh"
echo ""
echo "Setting Status column..."
"$(dirname "$0")/sync-project-status.sh" "$PROJECT_NUMBER"
