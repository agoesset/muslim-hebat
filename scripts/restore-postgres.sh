#!/usr/bin/env sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Usage: scripts/restore-postgres.sh backups/file.sql"
  exit 1
fi

docker compose exec -T postgres psql -U "${POSTGRES_USER:-muslim_hebat}" "${POSTGRES_DB:-muslim_hebat}" < "$1"
