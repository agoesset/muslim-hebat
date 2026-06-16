#!/usr/bin/env bash
set -euo pipefail

# Simple production health monitor for Muslim Hebat
# Usage: URL=http://localhost ALERT_WEBHOOK=https://hooks.slack.com/... ./monitor.sh

URL="${URL:-http://localhost}"
WEBHOOK="${ALERT_WEBHOOK:-}"
TIMEOUT="${TIMEOUT:-10}"
LABEL="${LABEL:-muslim-hebat}"

check() {
  local path="$1"
  local expect="$2"
  local full="${URL}${path}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$full" || echo "000")
  if [ "$status" != "$expect" ]; then
    local msg="[${LABEL}] ALERT: ${full} returned HTTP ${status} (expected ${expect})"
    echo "$msg"
    if [ -n "$WEBHOOK" ]; then
      curl -s -X POST -H "Content-Type: application/json" \
        --data "{\"text\":\"$msg\"}" "$WEBHOOK" || true
    fi
    return 1
  fi
  echo "[${LABEL}] OK: ${full} -> ${status}"
}

fail=0
check "/health" "200" || fail=1
check "/api/public/articles?limit=1" "200" || fail=1
check "/" "200" || fail=1

exit "$fail"
