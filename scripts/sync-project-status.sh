#!/usr/bin/env bash
# Set Status column on a GitHub Project v2 board for DNA roadmap issues.
# Usage: ./scripts/sync-project-status.sh [project_number]
# Default project: 3 (DNA - Roadmap). Use 4 for DNA - Defects.
#
# Requires: gh auth refresh -s read:project,project (as superhumaan)
set -euo pipefail

OWNER="superhumaan"
PROJECT_NUMBER="${1:-3}"
REPO="superhumaan/DNA"

SHIPPED=(1 2 3 4 5 6 7 8 9 10)
IN_PROGRESS=(11)
PLANNED=(12 13 14 15 16 17)

if ! gh project view "$PROJECT_NUMBER" --owner "$OWNER" &>/dev/null; then
  echo "Missing project scopes. Run:"
  echo "  gh auth switch -u superhumaan"
  echo "  gh auth refresh -s read:project,project"
  exit 1
fi

PROJECT_ID=$(gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json -q .id)
STATUS_FIELD=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json -q '.fields[] | select(.name=="Status") | .id')

pick_option() {
  local candidates=("$@")
  local name id
  for name in "${candidates[@]}"; do
    id=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json -q ".fields[] | select(.name==\"Status\") | .options[]? | select(.name==\"$name\") | .id" 2>/dev/null || true)
    if [[ -n "$id" ]]; then
      echo "$id"
      return
    fi
  done
  echo ""
}

if [[ "$PROJECT_NUMBER" == "4" ]]; then
  SHIPPED_OPT=$(pick_option "Done")
  IN_PROGRESS_OPT=$(pick_option "In progress")
  PLANNED_OPT=$(pick_option "Backlog")
else
  SHIPPED_OPT=$(pick_option "Done")
  IN_PROGRESS_OPT=$(pick_option "In progress")
  PLANNED_OPT=$(pick_option "Todo")
fi

if [[ -z "$SHIPPED_OPT" || -z "$IN_PROGRESS_OPT" || -z "$PLANNED_OPT" ]]; then
  echo "Could not resolve Status options:"
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER"
  exit 1
fi

set_status_for_issue() {
  local num="$1" option_id="$2"
  local url item_id
  url=$(gh issue view "$num" --repo "$REPO" --json url -q .url)
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$url" 2>/dev/null || true
  item_id=$(gh project item-list "$PROJECT_NUMBER" --owner "$OWNER" --format json -q ".items[] | select(.content.number==$num) | .id" | head -1)
  if [[ -z "$item_id" ]]; then
    echo "WARN: no project item for #$num"
    return
  fi
  gh project item-edit --project-id "$PROJECT_ID" --id "$item_id" \
    --field-id "$STATUS_FIELD" --single-select-option-id "$option_id"
  echo "Updated #$num"
}

echo "Syncing project #$PROJECT_NUMBER ($PROJECT_ID)..."

for num in "${SHIPPED[@]}"; do set_status_for_issue "$num" "$SHIPPED_OPT"; done
for num in "${IN_PROGRESS[@]}"; do set_status_for_issue "$num" "$IN_PROGRESS_OPT"; done
for num in "${PLANNED[@]}"; do set_status_for_issue "$num" "$PLANNED_OPT"; done

echo "Done."
