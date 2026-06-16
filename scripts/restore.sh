#!/usr/bin/env bash
set -euo pipefail

# Restore a gzipped pg_dump for Muslim Hebat
# Usage: ./restore.sh /backups/muslim_hebat_scheduled_20260616_120000.sql.gz

DUMP_FILE="${1:-}"
DB="${POSTGRES_DB:-muslim_hebat}"
USER="${POSTGRES_USER:-muslim_hebat}"
PASS="${POSTGRES_PASSWORD:-change-me}"
HOST="${POSTGRES_HOST:-postgres}"
PORT="${POSTGRES_PORT:-5432}"

if [ -z "$DUMP_FILE" ]; then
  echo "Usage: $0 <dump-file.sql.gz>"
  exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo "Dump file not found: $DUMP_FILE"
  exit 1
fi

echo "[restore] restoring $DUMP_FILE to $DB@$HOST"
gunzip -c "$DUMP_FILE" | PGPASSWORD="$PASS" psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB"
echo "[restore] done"
