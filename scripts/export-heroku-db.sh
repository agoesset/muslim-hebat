#!/bin/sh
set -eu

APP="${HEROKU_APP:-muslimhebat}"
OUT="${1:-backups/heroku-$(date +%Y%m%d-%H%M%S).dump}"

mkdir -p "$(dirname "$OUT")"

echo "Capturing Heroku backup on $APP..."
heroku pg:backups:capture --app "$APP"
heroku pg:backups:download --app "$APP" --output "$OUT"
echo "Saved $OUT"
echo "Copy to the VPS, then run: scripts/import-postgres-dump.sh $OUT"
